/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // === BRAND COLOR TOKENS ===
      // Edit these once and they propagate everywhere.
      colors: {
        // Backgrounds
        cream: {
          DEFAULT: '#FAF7F2',  // primary warm white
          deep: '#F4EFE6',     // section divider tone
          paper: '#FBFAF6',    // card backgrounds
        },
        // Text
        ink: {
          DEFAULT: '#1A1916',  // primary near-black
          soft: '#403D37',     // secondary text
          mute: '#7A7269',     // captions, metadata
          fade: '#B8B0A4',     // disabled, dividers
        },
        // The single brand accent — golden-red / honey amber
        // Use SPARINGLY (target <5% of any page)
        honey: {
          DEFAULT: '#B8541A',  // primary CTA, key accent
          deep: '#9A4516',     // hover state
          warm: '#C8651E',     // lighter variant for highlights
          glow: '#E8A87C',     // 20% tint for subtle backgrounds
        },
        // Sikkim regional accent (optional — for map component)
        moss: '#5A6E4A',       // forest green for region indicators
      },

      // === TYPOGRAPHY TOKENS ===
      fontFamily: {
        // Headlines — Cormorant Garamond (transitional serif, Aesop-adjacent)
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        // Body & UI — Inter (neutral grotesque)
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },

      // === TYPOGRAPHIC SCALE ===
      // Editorial scale — bigger jumps between sizes than default Tailwind
      fontSize: {
        'micro':    ['0.6875rem', { lineHeight: '1rem',     letterSpacing: '0.08em' }], // 11px — labels, eyebrows
        'tiny':     ['0.75rem',   { lineHeight: '1.1rem',   letterSpacing: '0.04em' }], // 12px — captions
        'sm':       ['0.875rem',  { lineHeight: '1.4rem'    }],                          // 14px
        'base':     ['1rem',      { lineHeight: '1.65rem'   }],                          // 16px — body
        'lg':       ['1.125rem',  { lineHeight: '1.75rem'   }],                          // 18px — lead
        'xl':       ['1.375rem',  { lineHeight: '1.9rem'    }],                          // 22px
        '2xl':      ['1.75rem',   { lineHeight: '2.25rem'   }],                          // 28px — h3
        '3xl':      ['2.25rem',   { lineHeight: '2.65rem'   }],                          // 36px — h2
        '4xl':      ['3rem',      { lineHeight: '3.3rem'    }],                          // 48px
        '5xl':      ['3.75rem',   { lineHeight: '4rem'      }],                          // 60px — h1
        '6xl':      ['4.5rem',    { lineHeight: '4.75rem'   }],                          // 72px — hero
        '7xl':      ['5.5rem',    { lineHeight: '5.75rem'   }],                          // 88px — display
      },

      // === SPACING SCALE ===
      // Generous whitespace is core to the aesthetic
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '38': '9.5rem',
      },

      // === LAYOUT TOKENS ===
      maxWidth: {
        'reading': '38rem',     // long-form prose width
        'content': '78rem',     // standard content max
        'wide': '90rem',        // wide hero sections
      },

      // === MOTION ===
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.22, 1, 0.36, 1)', // smooth, restrained
      },
    },
  },
  plugins: [],
};
