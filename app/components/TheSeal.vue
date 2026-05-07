<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<template>
  <svg
    :width="size ?? 120"
    :height="size ?? 120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Cao đẳng OpenClaw"
  >
    <defs>
      <linearGradient
        id="claw-grad"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop
          offset="0%"
          stop-color="#ff4d4d"
        />
        <stop
          offset="100%"
          stop-color="#991b1b"
        />
      </linearGradient>
    </defs>
    <circle
      cx="60"
      cy="60"
      r="57"
      stroke="#ff4d4d"
      stroke-width="1.5"
      fill="none"
      opacity="0.6"
    />
    <circle
      cx="60"
      cy="60"
      r="53"
      stroke="#ff4d4d"
      stroke-width="0.5"
      fill="none"
      opacity="0.3"
    />
    <path
      id="arc-top"
      d="M 10,60 A 50,50 0 0,1 110,60"
      fill="none"
    />
    <path
      id="arc-bottom"
      d="M 18,72 A 48,48 0 0,0 102,72"
      fill="none"
    />
    <text
      font-family="'Clash Display', sans-serif"
      font-size="8"
      fill="#ff4d4d"
      letter-spacing="2"
      font-weight="700"
    >
      <textPath
        href="#arc-top"
        startOffset="8%"
      >
        CAO ĐẲNG OPENCLAW
      </textPath>
    </text>
    <text
      font-family="'Clash Display', sans-serif"
      font-size="7"
      fill="#ff4d4d"
      letter-spacing="1.5"
      font-weight="600"
    >
      <textPath
        href="#arc-bottom"
        startOffset="22%"
      >
        EST. 2026
      </textPath>
    </text>
    <g transform="translate(60,56) scale(0.38)">
      <path
        d="M0,-44 C-6,-30 -18,-10 -22,10 C-24,22 -18,32 -8,36 C-2,38 4,36 8,30 L14,44 C6,52 -4,56 -14,54 C-30,50 -40,36 -38,18 C-36,-6 -20,-32 -10,-50 Z"
        fill="url(#claw-grad)"
      />
      <path
        d="M0,-44 C6,-30 18,-10 22,10 C24,22 18,32 8,36 C2,38 -4,36 -8,30 L-14,44 C-6,52 4,56 14,54 C30,50 40,36 38,18 C36,-6 20,-32 10,-50 Z"
        fill="url(#claw-grad)"
        opacity="0.85"
      />
      <path
        d="M0,-50 C0,-34 0,-10 0,8 C0,20 4,30 0,40 C-4,30 0,20 0,8 C0,-10 0,-34 0,-50 Z"
        fill="url(#claw-grad)"
        opacity="0.7"
      />
    </g>
  </svg>
</template>
