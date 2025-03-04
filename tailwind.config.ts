import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {},
	},
	plugins: [
		require("daisyui")
	],
	daisyui: {
		themes: [
			{
				bookmarkshark: {
					"primary": "#2f3e46",   // Deep ocean blue
					"secondary": "#00b4d8", // Bright cyan
					"accent": "#ff6b6b",    // Coral red for highlights
					"neutral": "#f5f7fa",   // Soft gray-white
					"base-100": "#ffffff",  // Clean white background
					"info": "#38bdf8",      // Light blue for info messages
					"success": "#48c78e",   // Sea green for success
					"warning": "#f59e0b",   // Golden yellow for warnings
					"error": "#e63946",  
				}
			}
		]
	},
} satisfies Config;
