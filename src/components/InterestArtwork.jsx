import { useEffect, useRef } from 'react'

/* ------------------------------------------------------------------ */
/* Scene 1 — Physics: The Glass Prism                                  */
/* ------------------------------------------------------------------ */

const PRISM_BANDS = [
  ['#ff3d6e', 300, 316],
  ['#ff9a3c', 316, 332],
  ['#ffe94d', 332, 348],
  ['#4dff9e', 348, 364],
  ['#3ad7ff', 364, 380],
  ['#5b6bff', 380, 396],
  ['#b05cff', 396, 412],
]

const PRISM_DUST = [
  [96, 150, 1.6, 0],
  [500, 118, 1.3, -3],
  [540, 520, 1.7, -6],
  [120, 470, 1.2, -2],
  [330, 520, 1.1, -8],
  [250, 90, 1.3, -5],
  [440, 470, 1, -9],
]

function PrismScene() {
  return (
    <svg viewBox="0 0 600 600" focusable="false" className="ix-svg">
      <defs>
        <linearGradient id="ixp-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eaf6ff" stopOpacity=".22" />
          <stop offset=".5" stopColor="#8b5cff" stopOpacity=".07" />
          <stop offset="1" stopColor="#5bdbea" stopOpacity=".16" />
        </linearGradient>
        <linearGradient id="ixp-edge" gradientUnits="userSpaceOnUse" x1="190" y1="150" x2="410" y2="340">
          <stop offset="0" stopColor="#f4fbff" />
          <stop offset=".55" stopColor="#b9a4ff" />
          <stop offset="1" stopColor="#7fe9ff" />
        </linearGradient>
        <linearGradient id="ixp-beamfade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="234" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".7" stopColor="#fff" stopOpacity=".95" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="ixp-halo" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#8b5cff" stopOpacity=".28" />
          <stop offset="1" stopColor="#8b5cff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ixp-spot" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id="ixp-bloom" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="ixp-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      <circle cx="300" cy="290" r="270" fill="url(#ixp-halo)" />

      <g className="ixp-float">
        {/* dispersed spectrum: scroll tilts the fan, CSS animates breathing */}
        <g className="ixp-scroll">
          <g className="ixp-sway">
            <g className="ixp-spread" style={{ mixBlendMode: 'screen' }} filter="url(#ixp-bloom)" opacity=".75">
              {PRISM_BANDS.map(([c, y1, y2]) => (
                <polygon key={c} points={`368,268 600,${y1} 600,${y2}`} fill={c} />
              ))}
            </g>
            <g className="ixp-spread" style={{ mixBlendMode: 'screen' }}>
              {PRISM_BANDS.map(([c, y1, y2], i) => (
                <polygon
                  key={c}
                  className="ixp-band"
                  style={{ animationDelay: `${i * 0.4}s` }}
                  points={`368,268 600,${y1} 600,${y2}`}
                  fill={c}
                  fillOpacity=".62"
                />
              ))}
              <line x1="368" y1="268" x2="600" y2="300" stroke="#ff5f86" strokeWidth="1.2" />
              <line x1="368" y1="268" x2="600" y2="356" stroke="#9dffcb" strokeWidth="1" strokeOpacity=".7" />
              <line x1="368" y1="268" x2="600" y2="412" stroke="#c98bff" strokeWidth="1.2" />
              <line className="ixp-run2" x1="368" y1="268" x2="600" y2="348" stroke="#fff" strokeWidth="1.4" strokeOpacity=".8" />
            </g>
          </g>
        </g>

        {/* entering beam */}
        <line x1="0" y1="306" x2="234" y2="264" stroke="#fff" strokeWidth="9" strokeOpacity=".5" filter="url(#ixp-bloom)" />
        <line x1="0" y1="306" x2="234" y2="264" stroke="url(#ixp-beamfade)" strokeWidth="2.4" strokeLinecap="round" />
        <line className="ixp-run" x1="0" y1="306" x2="234" y2="264" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />

        {/* glass */}
        <polygon points="300,150 190,340 410,340" fill="url(#ixp-glass)" />
        <polygon points="300,150 300,340 410,340" fill="#bfeaff" fillOpacity=".05" />
        <polygon points="300,150 190,340 410,340" fill="none" stroke="#8b5cff" strokeWidth="7" strokeOpacity=".38" strokeLinejoin="round" filter="url(#ixp-bloom)" />

        {/* inner beam + faint internal reflections */}
        <line x1="234" y1="264" x2="368" y2="268" stroke="#fff" strokeWidth="5" strokeOpacity=".35" filter="url(#ixp-soft)" />
        <line x1="234" y1="264" x2="368" y2="268" stroke="#fff" strokeWidth="1.6" strokeOpacity=".9" />
        <line x1="234" y1="264" x2="318" y2="340" stroke="#fff" strokeWidth="1" strokeOpacity=".16" />
        <line x1="368" y1="268" x2="262" y2="340" stroke="#fff" strokeWidth="1" strokeOpacity=".12" />
        <polygon points="300,176 262,246 300,246" fill="#fff" fillOpacity=".05" />

        {/* luminous edges */}
        <polygon points="300,150 190,340 410,340" fill="none" stroke="url(#ixp-edge)" strokeWidth="1.6" strokeLinejoin="round" />
        <line className="ixp-glint" x1="300" y1="150" x2="190" y2="340" stroke="#fff" strokeWidth="2.2" strokeOpacity=".9" strokeLinecap="round" />
        <line className="ixp-glint" style={{ animationDelay: '2.8s' }} x1="410" y1="340" x2="300" y2="340" stroke="#aeeeff" strokeWidth="2" strokeOpacity=".9" strokeLinecap="round" />
        <circle cx="300" cy="150" r="3" fill="#fff" />

        {/* entry + exit flares */}
        <circle className="ixp-flare-in" cx="234" cy="264" r="22" fill="url(#ixp-spot)" opacity=".8" />
        <circle className="ixp-flare" cx="368" cy="268" r="34" fill="url(#ixp-spot)" opacity=".7" style={{ mixBlendMode: 'screen' }} />
      </g>

      <g fill="#cfd8ff">
        {PRISM_DUST.map(([cx, cy, r, d]) => (
          <circle key={`${cx}-${cy}`} className="ixp-dust" style={{ animationDelay: `${d}s` }} cx={cx} cy={cy} r={r} />
        ))}
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Scene 2 — Astronomy: The Fluorescent Galaxy                         */
/* ------------------------------------------------------------------ */

const GALAXY_ARMS = {
  a1: 'M20 0 C20 2 21 7 20 10 C20 13 18 17 16 20 C13 23 10 26 6 28 C2 30 -3 32 -8 32 C-13 32 -19 31 -24 28 C-29 25 -35 21 -39 16 C-42 11 -46 4 -47 -3 C-49 -10 -49 -19 -47 -26 C-45 -34 -40 -43 -34 -50 C-28 -57 -19 -64 -10 -68 C0 -72 12 -75 24 -74 C36 -73 50 -70 61 -63 C73 -56 85 -46 94 -33 C102 -21 110 -4 112 13 C114 30 113 51 107 69 C101 88 90 108 74 124 C58 139 37 154 13 162 C-10 170 -40 175 -67 172 C-95 168 -128 158 -154 141 C-181 123 -209 97 -227 66 C-245 34 -257 -28 -263 -47',
  a2: 'M-20 0 C-20 -2 -21 -7 -20 -10 C-20 -13 -18 -17 -16 -20 C-13 -23 -10 -26 -6 -28 C-2 -30 3 -32 8 -32 C13 -32 19 -31 24 -28 C29 -25 35 -21 39 -16 C42 -11 46 -4 47 3 C49 10 49 19 47 26 C45 34 40 43 34 50 C28 57 19 64 10 68 C0 72 -12 75 -24 74 C-36 73 -50 70 -61 63 C-73 56 -85 46 -94 33 C-102 21 -110 4 -112 -13 C-114 -30 -113 -51 -107 -69 C-101 -88 -90 -108 -74 -124 C-58 -139 -37 -154 -13 -162 C10 -170 40 -175 67 -172 C95 -168 128 -158 154 -141 C181 -123 209 -97 227 -66 C245 -34 257 28 263 47',
  a3: 'M0 20 C-1 20 -6 21 -8 21 C-11 20 -15 19 -18 18 C-20 16 -23 14 -26 11 C-28 8 -30 4 -31 0 C-32 -4 -33 -8 -32 -13 C-32 -17 -30 -22 -28 -27 C-25 -31 -22 -36 -17 -39 C-13 -43 -7 -46 -1 -48 C5 -50 12 -51 19 -50 C26 -49 34 -47 41 -43 C48 -39 55 -34 61 -27 C66 -20 71 -11 74 -2 C77 7 79 19 77 29 C76 40 73 53 67 63 C62 74 53 85 43 94 C32 102 19 111 4 115 C-10 119 -28 122 -45 120 C-61 119 -80 114 -97 105 C-114 96 -131 83 -145 67 C-158 51 -171 30 -178 8',
  a4: 'M0 -20 C1 -20 6 -21 8 -21 C11 -20 15 -19 18 -18 C20 -16 23 -14 26 -11 C28 -8 30 -4 31 0 C32 4 33 8 32 13 C32 17 30 22 28 27 C25 31 22 36 17 39 C13 43 7 46 1 48 C-5 50 -12 51 -19 50 C-26 49 -34 47 -41 43 C-48 39 -55 34 -61 27 C-66 20 -71 11 -74 2 C-77 -7 -79 -19 -77 -29 C-76 -40 -73 -53 -67 -63 C-62 -74 -53 -85 -43 -94 C-32 -102 -19 -111 -4 -115 C10 -119 28 -122 45 -120 C61 -119 80 -114 97 -105 C114 -96 131 -83 145 -67 C158 -51 171 -30 178 -8',
}

const GALAXY_STARS = [
  [62, 120, 1.5, 0, '#e9e2ff'],
  [530, 90, 1.2, -1, '#e9e2ff'],
  [566, 310, 1.7, -2, '#e9e2ff'],
  [90, 520, 1.3, -3, '#e9e2ff'],
  [300, 46, 1.1, -0.5, '#e9e2ff'],
  [400, 560, 1.5, -2.5, '#e9e2ff'],
  [30, 330, 1, -1.5, '#e9e2ff'],
  [210, 70, 1.2, -3.5, '#e9e2ff'],
  [520, 500, 1.1, -0.8, '#e9e2ff'],
  [130, 250, 1, -2.2, '#e9e2ff'],
  [470, 60, 1.4, -1.2, '#9fe8ff'],
  [70, 430, 1.3, -2.8, '#9fe8ff'],
  [560, 440, 1, -0.2, '#9fe8ff'],
]

function GalaxyScene() {
  return (
    <svg viewBox="0 0 600 600" focusable="false" className="ix-svg">
      <defs>
        <radialGradient id="ixg-grad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="270">
          <stop offset="0" stopColor="#fff0ff" />
          <stop offset=".16" stopColor="#e0d0ff" />
          <stop offset=".42" stopColor="#a070ff" />
          <stop offset=".72" stopColor="#5a3fd0" />
          <stop offset="1" stopColor="#2c2486" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ixg-ice" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="270">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".5" stopColor="#bfe9ff" />
          <stop offset="1" stopColor="#7fe9ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ixg-halo" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#7a4cff" stopOpacity=".34" />
          <stop offset=".6" stopColor="#3b2a8f" stopOpacity=".14" />
          <stop offset="1" stopColor="#3b2a8f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ixg-corefill" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".25" stopColor="#f1e6ff" />
          <stop offset=".6" stopColor="#b78cff" stopOpacity=".55" />
          <stop offset="1" stopColor="#8b5cff" stopOpacity="0" />
        </radialGradient>
        <filter id="ixg-b14" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="ixg-b4" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <filter id="ixg-b30" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="28" />
        </filter>
        {Object.entries(GALAXY_ARMS).map(([id, d]) => (
          <path key={id} id={`ixg-${id}`} fill="none" d={d} />
        ))}
      </defs>

      <circle cx="300" cy="300" r="290" fill="url(#ixg-halo)" />
      <ellipse cx="300" cy="300" rx="210" ry="120" fill="#6a3dff" opacity=".22" filter="url(#ixg-b30)" transform="rotate(-22 300 300)" />

      {/* tilted disk: 2.5D via rotate + vertical squash */}
      <g transform="translate(300 300) rotate(-22) scale(1 .55)">
        <g className="ixg-breathe">
          <g className="ixg-scroll">
            <g className="ixg-spin">
              <g filter="url(#ixg-b14)" stroke="url(#ixg-grad)" strokeWidth="34" strokeLinecap="round" opacity=".5">
                <use href="#ixg-a1" />
                <use href="#ixg-a2" />
              </g>
              <g filter="url(#ixg-b14)" stroke="url(#ixg-grad)" strokeWidth="22" strokeLinecap="round" opacity=".3">
                <use href="#ixg-a3" />
                <use href="#ixg-a4" />
              </g>
              <g filter="url(#ixg-b4)" stroke="url(#ixg-grad)" strokeLinecap="round" opacity=".85">
                <use href="#ixg-a1" strokeWidth="10" />
                <use href="#ixg-a2" strokeWidth="10" />
                <use href="#ixg-a3" strokeWidth="5" opacity=".7" />
                <use href="#ixg-a4" strokeWidth="5" opacity=".7" />
              </g>
              <g className="ixg-flow" stroke="url(#ixg-grad)" strokeLinecap="round" strokeWidth="2.6" strokeDasharray="0.1 8">
                <use href="#ixg-a1" />
                <use href="#ixg-a2" />
              </g>
              <g className="ixg-flow2" stroke="url(#ixg-ice)" strokeLinecap="round" strokeWidth="3.2" strokeDasharray="0.1 21" opacity=".9">
                <use href="#ixg-a1" />
                <use href="#ixg-a2" />
                <use href="#ixg-a3" />
                <use href="#ixg-a4" />
              </g>
              <g className="ixg-flow" stroke="url(#ixg-grad)" strokeLinecap="round" strokeWidth="1.8" strokeDasharray="0.1 11" opacity=".8">
                <use href="#ixg-a3" />
                <use href="#ixg-a4" />
              </g>
            </g>
          </g>

          <g fill="none" strokeLinecap="round">
            <circle className="ixg-r1" r="62" stroke="#f0e6ff" strokeWidth="2.2" strokeDasharray="0.1 7" opacity=".8" />
            <circle className="ixg-r2" r="104" stroke="#c9b8ff" strokeWidth="2.2" strokeDasharray="0.1 9" opacity=".7" />
            <circle className="ixg-r3" r="150" stroke="#a98bff" strokeWidth="2" strokeDasharray="0.1 12" opacity=".6" />
            <circle className="ixg-r4" r="204" stroke="#9fe8ff" strokeWidth="2" strokeDasharray="0.1 18" opacity=".55" />
            <circle className="ixg-r2" r="248" stroke="#7a5cff" strokeWidth="1.8" strokeDasharray="0.1 24" opacity=".5" />
          </g>
        </g>
      </g>

      {/* core */}
      <g className="ixg-core">
        <circle cx="300" cy="300" r="70" fill="url(#ixg-corefill)" opacity=".8" filter="url(#ixg-b14)" />
        <circle cx="300" cy="300" r="26" fill="url(#ixg-corefill)" />
        <circle cx="300" cy="300" r="7" fill="#fff" />
      </g>
      <ellipse cx="300" cy="300" rx="230" ry="2.4" fill="#bfe9ff" opacity=".28" filter="url(#ixg-b4)" transform="rotate(-22 300 300)" />

      {/* cosmic dust */}
      <g filter="url(#ixg-b30)">
        <ellipse className="ixg-cloud" cx="170" cy="400" rx="70" ry="36" fill="#3b2a8f" opacity=".5" transform="rotate(-22 170 400)" />
        <ellipse className="ixg-cloud" style={{ animationDelay: '-7s' }} cx="440" cy="190" rx="64" ry="30" fill="#5a3fd0" opacity=".38" transform="rotate(-22 440 190)" />
        <ellipse className="ixg-cloud" style={{ animationDelay: '-12s' }} cx="470" cy="420" rx="50" ry="24" fill="#7fe9ff" opacity=".12" />
      </g>

      {GALAXY_STARS.map(([cx, cy, r, d, c]) => (
        <circle key={`${cx}-${cy}`} className="ixg-star" style={{ animationDelay: `${d}s` }} cx={cx} cy={cy} r={r} fill={c} />
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Scene 3 — Music: Golden Sound Ribbons                               */
/* ------------------------------------------------------------------ */

const R = {
  a: [
    'M20,330 C120,180 220,180 310,300 C400,420 480,420 580,260 L580,300 C480,470 390,470 300,350 C210,230 130,230 20,370 Z',
    'M20,320 C120,230 220,150 310,290 C400,430 480,380 580,280 L580,320 C480,430 390,500 300,340 C210,200 130,270 20,360 Z',
  ],
  b: [
    'M20,260 C130,400 230,400 300,290 C380,170 470,170 580,330 L580,366 C470,210 390,214 310,330 C240,440 130,440 20,296 Z',
    'M20,280 C130,350 230,430 300,300 C380,150 470,210 580,310 L580,346 C470,250 390,190 310,340 C240,420 130,400 20,316 Z',
  ],
  c: [
    'M20,300 C140,210 240,390 300,300 C360,210 470,390 580,300 L580,308 C470,360 360,240 300,304 C240,368 140,248 20,308 Z',
    'M20,300 C140,390 240,210 300,300 C360,390 470,210 580,300 L580,308 C470,240 360,360 300,304 C240,248 140,368 20,308 Z',
  ],
  h1: [
    'M20,300 C140,150 240,450 300,300 C360,150 470,450 580,300',
    'M20,300 C140,450 240,150 300,300 C360,450 470,150 580,300',
  ],
  h2: [
    'M20,330 C150,230 250,420 320,320 C390,220 480,400 580,320',
    'M20,330 C150,420 250,230 320,320 C390,400 480,220 580,320',
  ],
}

const RIBBON_DUR = { a: '6.4s', b: '7.6s', c: '5.2s', h1: '6s', h2: '8.4s' }
const RIBBON_SPARKS = [
  [90, 200, 1.6, 0],
  [210, 470, 1.3, -1.2],
  [380, 120, 1.5, -2.4],
  [520, 440, 1.4, -3.6],
  [470, 190, 1.1, -0.6],
  [130, 420, 1.2, -4.2],
  [300, 520, 1.1, -1.8],
]

function RibbonPath({ id }) {
  const [s1, s2] = R[id]
  return (
    <path id={`ixr-${id}`} d={s1} fill={id.startsWith('h') ? 'none' : undefined}>
      <animate
        attributeName="d"
        dur={RIBBON_DUR[id]}
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;.5;1"
        keySplines=".45 0 .55 1;.45 0 .55 1"
        values={`${s1};${s2};${s1}`}
      />
    </path>
  )
}

function RibbonScene() {
  return (
    <svg viewBox="0 0 600 600" focusable="false" className="ix-svg">
      <defs>
        <linearGradient id="ixr-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6b3a08" />
          <stop offset=".18" stopColor="#f5c451" />
          <stop offset=".32" stopColor="#fff1c9" />
          <stop offset=".46" stopColor="#e08a1e" />
          <stop offset=".62" stopColor="#8a4f0b" />
          <stop offset=".78" stopColor="#f7d27a" />
          <stop offset=".9" stopColor="#fff4d6" />
          <stop offset="1" stopColor="#b8720f" />
          <animateTransform attributeName="gradientTransform" type="translate" values="-.25 -.1;.25 .1;-.25 -.1" dur="8s" repeatCount="indefinite" />
        </linearGradient>
        <linearGradient id="ixr-g2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a3f05" />
          <stop offset=".2" stopColor="#e08a1e" />
          <stop offset=".36" stopColor="#ffd27a" />
          <stop offset=".52" stopColor="#b8620a" />
          <stop offset=".7" stopColor="#f5a63a" />
          <stop offset=".86" stopColor="#ffe3a8" />
          <stop offset="1" stopColor="#8a4f0b" />
          <animateTransform attributeName="gradientTransform" type="translate" values=".2 0;-.2 .1;.2 0" dur="9.5s" repeatCount="indefinite" />
        </linearGradient>
        <linearGradient id="ixr-g3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fbe8c0" stopOpacity=".2" />
          <stop offset=".3" stopColor="#fff6de" />
          <stop offset=".6" stopColor="#f5d9a0" />
          <stop offset="1" stopColor="#fbe8c0" stopOpacity=".25" />
        </linearGradient>
        <radialGradient id="ixr-halo" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#e08a1e" stopOpacity=".3" />
          <stop offset="1" stopColor="#e08a1e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ixr-edgefade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" />
          <stop offset=".08" stopColor="#fff" />
          <stop offset=".92" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="ixr-mask" maskUnits="userSpaceOnUse" x="0" y="-100" width="600" height="800">
          <rect x="0" y="-100" width="600" height="800" fill="url(#ixr-edgefade)" />
        </mask>
        <filter id="ixr-bloom" x="-20%" y="-30%" width="140%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="ixr-soft" x="-20%" y="-30%" width="140%" height="160%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <RibbonPath id="a" />
        <RibbonPath id="b" />
        <RibbonPath id="c" />
        <RibbonPath id="h1" />
        <RibbonPath id="h2" />
      </defs>

      <circle cx="300" cy="300" r="290" fill="url(#ixr-halo)" />

      <g className="ixr-scroll" mask="url(#ixr-mask)">
        <g className="ixr-beat">
          <g className="ixr-glow" filter="url(#ixr-bloom)" style={{ mixBlendMode: 'screen' }}>
            <use href="#ixr-a" fill="#e08a1e" opacity=".8" />
            <use href="#ixr-b" fill="#f5a63a" opacity=".7" />
            <use href="#ixr-c" fill="#fbe8c0" opacity=".6" />
          </g>

          <use href="#ixr-b" fill="url(#ixr-g2)" />
          <use href="#ixr-a" fill="url(#ixr-g1)" />
          <use href="#ixr-c" fill="url(#ixr-g3)" />

          <g fill="none" strokeLinejoin="round" filter="url(#ixr-soft)">
            <use href="#ixr-b" stroke="#ffe3a8" strokeWidth="1" opacity=".7" />
            <use href="#ixr-a" stroke="#fff1c9" strokeWidth="1.2" opacity=".85" />
            <use href="#ixr-c" stroke="#ffffff" strokeWidth=".8" opacity=".8" />
          </g>

          <use href="#ixr-h1" stroke="#fbe8c0" strokeWidth="1.1" opacity=".55" />
          <use href="#ixr-h2" stroke="#f5a63a" strokeWidth="1" opacity=".5" />
        </g>
      </g>

      <g fill="#ffe3a8">
        {RIBBON_SPARKS.map(([cx, cy, r, d]) => (
          <circle key={`${cx}-${cy}`} className="ixr-spark" style={{ animationDelay: `${d}s` }} cx={cx} cy={cy} r={r} />
        ))}
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Contract: InterestsSection owns `active`; this consumes the index.  */
/*   single  → render only the scene for `active` (static fallback)    */
/* ------------------------------------------------------------------ */

const SCENES = [PrismScene, GalaxyScene, RibbonScene]

function relation(i, active) {
  if (i === active) return 'is-current'
  return (i - active + SCENES.length) % SCENES.length === 1 ? 'is-next' : 'is-prev'
}

export default function InterestArtwork({ active = 0, single = false, className = '' }) {
  const wrapRef = useRef(null)

  // Park SMIL (the ribbons' morphing) while their scene is off-screen.
  useEffect(() => {
    const svg = wrapRef.current?.querySelector('.ix-scene--2 svg')
    if (!svg || typeof svg.pauseAnimations !== 'function') return
    if (active === 2) svg.unpauseAnimations()
    else svg.pauseAnimations()
  }, [active])

  if (single) {
    const Scene = SCENES[active] ?? PrismScene
    return (
      <div className={`ix-art ix-art--single ${className}`.trim()} aria-hidden="true">
        <Scene />
      </div>
    )
  }

  return (
    <div ref={wrapRef} data-active={active} className={`ix-art ${className}`.trim()} aria-hidden="true">
      <span className="ix-ring" />
      {SCENES.map((Scene, i) => (
        <div key={i} className={`ix-scene ix-scene--${i} ${relation(i, active)}`}>
          <Scene />
        </div>
      ))}
    </div>
  )
}
