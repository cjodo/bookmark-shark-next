import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	logging: {
		fetches: {
			fullUrl: true
		}
	},
	experimental: {
		serverActions: {
			bodySizeLimit: '2mb'
		}
	},

};

export default nextConfig;
