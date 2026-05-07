<template>
  <section id="cai-dat">
    <div class="container">
      <p class="section-eyebrow">
        Block 03
      </p>
      <h2 class="section-title">
        Cài nhanh Trợ lý
      </h2>
      <p class="install-intro">
        Hoặc cài thủ công bằng một lệnh:
      </p>

      <div class="terminal">
        <div class="terminal-bar">
          <div class="terminal-dot" />
          <div class="terminal-dot" />
          <div class="terminal-dot" />
          <div class="terminal-title">
            ~ — bash
          </div>
        </div>
        <div class="terminal-body">
          <div class="term-line">
            <span class="term-prompt">$</span><span class="term-cmd">curl</span> https://openclaw.edu.vn/cai-dat/&lt;tên-trợ-lý&gt;.sh <span class="term-pipe">|</span> <span class="term-cmd">sh</span>
          </div>
          <div class="term-line term-comment">
            # Ví dụ:
          </div>
          <div class="term-line">
            <span class="term-prompt">$</span><span class="term-cmd">curl</span> https://openclaw.edu.vn/cai-dat/ke-toan-doanh-nghiep.sh <span class="term-pipe">|</span> <span class="term-cmd">sh</span>
          </div>
        </div>
      </div>

      <p class="install-explain">
        Script sẽ tải Trợ lý vào <code>OPENCLAW_ROOT/agents/&lt;tên-trợ-lý&gt;/</code> cùng bộ kỹ năng và dữ liệu cần thiết.
      </p>
    </div>
  </section>
</template>

<style scoped>
section {
  padding: 80px 0;
  border-top: 1px solid var(--border);
}

.section-eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-faint);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-eyebrow::before {
  content: "";
  width: 24px;
  height: 1px;
  background: var(--coral);
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(32px, 4.5vw, 48px);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 28px;
}

.install-intro {
  font-size: 17px;
  color: var(--text-dim);
  margin-bottom: 24px;
}

.terminal {
  background: var(--bg-deep);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 24px 70px -30px rgba(0, 0, 0, 0.6);
}

.terminal-bar {
  padding: 12px 16px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
}

.terminal-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--border-strong);
}

.terminal-dot:nth-child(1) {
  background: #ff5f56;
}

.terminal-dot:nth-child(2) {
  background: #ffbd2e;
}

.terminal-dot:nth-child(3) {
  background: #27c93f;
}

.terminal-title {
  flex: 1;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-faint);
}

.terminal-body {
  padding: 24px 24px 22px;
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.85;
}

.term-line {
  color: var(--text);
}

.term-prompt {
  color: var(--coral);
  user-select: none;
  margin-right: 12px;
}

.term-cmd {
  color: var(--cyan);
}

.term-pipe {
  color: var(--text-dim);
}

.term-comment {
  color: var(--text-faint);
  font-style: italic;
}

.install-explain {
  margin-top: 22px;
  font-size: 15px;
  color: var(--text-dim);
  line-height: 1.7;
}

.install-explain code {
  font-family: var(--font-mono);
  font-size: 13px;
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--cyan);
}

@media (max-width: 720px) {
  section {
    padding: 56px 0;
  }

  .terminal-body {
    padding: 18px;
    font-size: 12.5px;
  }
}
</style>
