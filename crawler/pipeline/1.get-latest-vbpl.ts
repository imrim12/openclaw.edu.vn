import { setTimeout as sleep } from 'node:timers/promises'
import {
  appendLine,
  DEFAULT_USER_AGENT,
  ensureDir,
  listingResponseSchema,
  loadListingIds,
  makeLogger,
  readEnvNumber,
  VBPL_ENDPOINT,
  VBPL_PATHS,
  writeJson,
} from './_lib.ts'

const PAGE_SIZE = readEnvNumber('CRAWLER_LIST_PAGE_SIZE', 1000)
const REQUEST_DELAY_MS = readEnvNumber('CRAWLER_LIST_DELAY_MS', 300)
const STOP_AFTER_KNOWN = readEnvNumber('CRAWLER_LIST_STOP_AFTER_KNOWN', PAGE_SIZE)
const REQUEST_TIMEOUT_MS = readEnvNumber('CRAWLER_LIST_TIMEOUT_MS', 60_000)
const MAX_RETRIES = readEnvNumber('CRAWLER_LIST_MAX_RETRIES', 5)
const RETRY_BACKOFF_MS = [2_000, 5_000, 15_000, 60_000, 180_000]

const log = makeLogger(VBPL_PATHS.listLog)

interface RunState {
  startedAt: string
  finishedAt: string | null
  pagesFetched: number
  newItemsAppended: number
  knownAtStart: number
  totalReported: number | null
  stopReason: 'caught-up' | 'reached-end' | 'fatal'
}

async function fetchPage(pageNumber: number): Promise<{ total: number, items: ReadonlyArray<{ id: string }> }> {
  const url = `${VBPL_ENDPOINT}/doc/all`
  const body = JSON.stringify({
    sortDirection: 'desc',
    sortBy: 'issueDate',
    pageSize: PAGE_SIZE,
    pageNumber,
  })

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController()
    const timer = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': DEFAULT_USER_AGENT,
          'Accept': 'application/json',
        },
        body,
        signal: controller.signal,
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status} on page ${pageNumber}: ${text.slice(0, 200)}`)
      }
      const json: unknown = await res.json()
      const parsed = listingResponseSchema.safeParse(json)
      if (!parsed.success) {
        throw new Error(`page ${pageNumber} response shape: ${parsed.error.message.slice(0, 300)}`)
      }
      if (!parsed.data.success) {
        throw new Error(`page ${pageNumber} success=false`)
      }
      return { total: parsed.data.data.total, items: parsed.data.data.items }
    }
    catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (attempt === MAX_RETRIES)
        throw new Error(message)
      const wait = RETRY_BACKOFF_MS[attempt] ?? 60_000
      log(`page ${pageNumber} attempt ${attempt + 1} failed: ${message} — backoff ${wait}ms`)
      await sleep(wait)
    }
    finally {
      globalThis.clearTimeout(timer)
    }
  }
  throw new Error('unreachable')
}

async function main(): Promise<void> {
  ensureDir(VBPL_PATHS.markdownDir)
  log(`get-latest-vbpl — pageSize=${PAGE_SIZE}, stopAfterKnown=${STOP_AFTER_KNOWN}`)

  const known = await loadListingIds(VBPL_PATHS.list)
  log(`loaded ${known.size} known ids from existing manifest`)

  const state: RunState = {
    startedAt: new Date().toISOString(),
    finishedAt: null,
    pagesFetched: 0,
    newItemsAppended: 0,
    knownAtStart: known.size,
    totalReported: null,
    stopReason: 'reached-end',
  }

  let consecutiveKnown = 0
  let pageNumber = 1

  while (true) {
    const t0 = Date.now()
    const { total, items } = await fetchPage(pageNumber)
    const dur = Date.now() - t0
    state.pagesFetched += 1
    if (state.totalReported === null) {
      state.totalReported = total
      log(`API total=${total} → ${Math.ceil(total / PAGE_SIZE)} pages`)
    }

    if (items.length === 0) {
      log(`page ${pageNumber} empty — stopping (reached end)`)
      state.stopReason = 'reached-end'
      break
    }

    let newOnPage = 0
    for (const item of items) {
      if (known.has(item.id)) {
        consecutiveKnown += 1
      }
      else {
        consecutiveKnown = 0
        known.add(item.id)
        appendLine(VBPL_PATHS.list, JSON.stringify(item))
        state.newItemsAppended += 1
        newOnPage += 1
      }
    }

    log(`page ${pageNumber} got ${items.length} (${newOnPage} new, run consecutive-known=${consecutiveKnown}) in ${dur}ms — cum new=${state.newItemsAppended}`)

    if (consecutiveKnown >= STOP_AFTER_KNOWN) {
      log(`hit ${consecutiveKnown} consecutive known ids — caught up, stopping`)
      state.stopReason = 'caught-up'
      break
    }

    if (state.totalReported !== null && known.size >= state.totalReported && state.newItemsAppended === 0) {
      log('all known and total matches — stopping')
      state.stopReason = 'caught-up'
      break
    }

    pageNumber += 1
    await sleep(REQUEST_DELAY_MS)
  }

  state.finishedAt = new Date().toISOString()
  writeJson(VBPL_PATHS.listState, state)
  log(`finished — appended ${state.newItemsAppended} new items, total in manifest now ${known.size}, reason=${state.stopReason}`)
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.stack ?? err.message : String(err)
  log(`FATAL: ${message}`)
  process.exitCode = 1
})
