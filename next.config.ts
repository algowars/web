import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async rewrites() {
		const apiServerUrl = process.env.NEXT_PUBLIC_API_SERVER_URL;
		if (!apiServerUrl) return [];

		return [
			{
				source: "/api/:path*",
				destination: `${apiServerUrl}/api/:path*`,
			},
		];
	},
};

export default nextConfig;
