import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Contract tests for the provider-facing API routes (Kit, Resend, Sanity).
// They run in Node against fakes of each provider's HTTP contract; they do not
// prove the live providers accept these requests.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
