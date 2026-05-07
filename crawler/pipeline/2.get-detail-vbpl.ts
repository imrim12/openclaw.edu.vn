import { setTimeout as sleep } from 'node:timers/promises'
import {
  appendLine,
  DEFAULT_USER_AGENT,
  detailResponseSchema,
  HttpError,
  isPermanentBody,
  isTransientHttp,
  iterListingItems,
  loadDoneIds,
  loadIdsFromNdjson,
  makeLogger,
  randomDelayMs,
  readEnvNumber,
  VBPL_ENDPOINT,
  VBPL_PATHS,
  writeJson,
} from './_lib.ts'

const MIN_DELAY_MS = readEnvNumber('CRAWLER_MIN_DELAY_MS', 1_000)
const MAX_DELAY_MS = readEnvNumber('CRAWLER_MAX_DELAY_MS', 10_000)
const REQUEST_TIMEOUT_MS = readEnvNumber('CRAWLER_DETAIL_TIMEOUT_MS', 45_000)
const MAX_RETRIES = readEnvNumber('CRAWLER_DETAIL_MAX_RETRIES', 4)
const HARD_LIMIT = process.env.CRAWLER_LIMIT === undefined ? Infinity : Number(process.env.CRAWLER_LIMIT)
const PROGRESS_EVERY = readEnvNumber('CRAWLER_DETAIL_PROGRESS_EVERY', 50)
const RETRY_BACKOFF_MS = [3_000, 10_000, 30_000, 120_000]

if (Number.isNaN(HARD_LIMIT))
  throw new Error('CRAWLER_LIMIT must be a number')

const log = makeLogger(VBPL_PATHS.detailsLog)

interface RunStats {
  startedAt: number
  done: number
  dead: number
  processedThisRun: number
}

async function fetchDetail(id: string): Promise<unknown> {
  const url = `${VBPL_ENDPOINT}/doc/${id}`
  const controller = new AbortController()
  const timer = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': DEFAULT_USER_AGENT, 'Accept': 'application/json' },
      signal: controller.signal,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new HttpError(res.status, text, `HTTP ${res.status}: ${text.slice(0, 200)}`)
    }
    const json: unknown = await res.json()
    const parsed = detailResponseSchema.safeParse(json)
    if (!parsed.success) {
      throw new Error(`response shape: ${parsed.error.message.slice(0, 300)}`)
    }
    if (!parsed.data.success) {
      throw new Error('success=false')
    }
    return parsed.data.data
  }
  finally {
    globalThis.clearTimeout(timer)
  }
}

async function main(): Promise<void> {
  log(`get-detail-vbpl — delay [${MIN_DELAY_MS}, ${MAX_DELAY_MS}] ms, no proxy, single connection`)

  const done = await loadDoneIds(VBPL_PATHS.detailsDone)
  const dead = await loadIdsFromNdjson(VBPL_PATHS.detailsDead)
  for (const id of dead) done.add(id)
  log(`already done: ${done.size - dead.size}, previously dead-lettered: ${dead.size}`)

  const stats: RunStats = {
    startedAt: Date.now(),
    done: done.size,
    dead: 0,
    processedThisRun: 0,
  }

  let totalSeen = done.size

  for await (const item of iterListingItems(VBPL_PATHS.list)) {
    if (stats.processedThisRun >= HARD_LIMIT) {
      log(`hit CRAWLER_LIMIT=${HARD_LIMIT}, stopping`)
      break
    }
    totalSeen += 1
    if (done.has(item.id))
      continue

    const id = item.id
    let attempt = 0
    while (attempt <= MAX_RETRIES) {
      const t0 = Date.now()
      try {
        const data = await fetchDetail(id)
        const dur = Date.now() - t0
        appendLine(VBPL_PATHS.details, JSON.stringify({ id, fetchedAt: new Date().toISOString(), data }))
        appendLine(VBPL_PATHS.detailsDone, id)
        done.add(id)
        stats.done += 1
        stats.processedThisRun += 1
        if (stats.done % PROGRESS_EVERY === 0) {
          const elapsed = (Date.now() - stats.startedAt) / 1000
          const rate = stats.processedThisRun / Math.max(elapsed, 1)
          const remaining = totalSeen - stats.done - stats.dead
          const etaSec = rate > 0 ? remaining / rate : 0
          log(`progress: ${stats.done} done (${rate.toFixed(2)} req/s; last ${dur}ms; ETA ~${Math.round(etaSec / 3600)}h; dead=${stats.dead})`)
        }
        break
      }
      catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        const permanent = err instanceof HttpError && (!isTransientHttp(err.status) || isPermanentBody(err.body))
        attempt += 1
        if (permanent || attempt > MAX_RETRIES) {
          appendLine(VBPL_PATHS.detailsDead, JSON.stringify({ id, listing: item, error: message, permanent }))
          stats.dead += 1
          stats.processedThisRun += 1
          log(`dead-letter ${id} (${permanent ? 'permanent' : `after ${MAX_RETRIES + 1} attempts`}): ${message}`)
          break
        }
        const wait = RETRY_BACKOFF_MS[attempt - 1] ?? 60_000
        log(`retry ${id} attempt ${attempt}: ${message} — backoff ${wait}ms`)
        await sleep(wait)
      }
    }

    await sleep(randomDelayMs(MIN_DELAY_MS, MAX_DELAY_MS))
  }

  const elapsedSec = Math.round((Date.now() - stats.startedAt) / 1000)
  writeJson(VBPL_PATHS.detailsState, {
    done: stats.done,
    dead: stats.dead,
    processedThisRun: stats.processedThisRun,
    elapsedSec,
    finishedAt: new Date().toISOString(),
  })
  log(`finished — done=${stats.done}, dead=${stats.dead}, processedThisRun=${stats.processedThisRun}, elapsed=${elapsedSec}s`)
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.stack ?? err.message : String(err)
  log(`FATAL: ${message}`)
  process.exitCode = 1
})
