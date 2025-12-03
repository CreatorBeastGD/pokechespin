import type { Config } from "tailwindcss";

export default {
	mode: "jit",
    darkMode: ["class"],
    content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	  ],
  theme: {
	screens: {
		sm: '640px',
		md: '768px',
		lg: '1024px',
		xl: '1280px',
	  },
  	extend: {
  		colors: {
			normal: "#919aa1",
			fighting: "#d5425f",
			flying: "#9bb3e1",
			poison: "#b962cf",
			ground: "#d68e5e",
			rock: "#cbbd8d",
			bug: "#99c32f",
			ghost: "#626dbd",
			steel: "#5497a3",
			fire: "#ffa152",
			water: "#5faadd",
			grass: "#5dbe67",
			electric: "#f7da5b",
			psychic: "#fb8684",
			ice: "#7dd2c7",
			dragon: "#0970bb",
			dark: "#656777",
			fairy: "#ffaef0",
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		display: ['responsive', 'group-hover', 'focus-within', 'hover', 'focus'],
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
