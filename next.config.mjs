import { build } from "velite";

if (!process.env.VELITE_STARTED && process.argv[1]?.endsWith("/next")) {
	process.env.VELITE_STARTED = "1";
	const dev = process.argv.includes("dev");
	await build({ watch: dev, clean: true });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx"],
};

export default nextConfig;
