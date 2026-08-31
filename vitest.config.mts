import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    // Mirrors the "@/*" path alias from tsconfig.json. Vitest doesn't read
    // tsconfig paths on its own, so without this every "@/lib/..." import in a
    // test fails to resolve.
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // Node, not jsdom: these tests cover pure functions. Adding jsdom would
    // only be worth it for component tests, which aren't here yet.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
