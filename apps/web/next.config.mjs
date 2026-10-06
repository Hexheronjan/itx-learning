import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@nalara/config", "@nalara/shared-types", "@nalara/ai-gateway"],
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
