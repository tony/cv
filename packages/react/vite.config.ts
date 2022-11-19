import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { ConfigEnv, UserConfig } from "vite";
export default defineConfig(({ command }: ConfigEnv): UserConfig => {
  const config: UserConfig = {
    plugins: [
      react({
        // Only .tsx files
        include: "**/*.tsx",
      }),
    ],

    build: {
      rollupOptions: {},
    },
  };
  if (command === "serve") {
    return {
      // dev specific config
      ...config,
    };
  } else {
    // command === 'build'
    return {
      // build specific config
      ...config,
    };
  }
});
