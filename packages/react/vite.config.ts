import react from "@vitejs/plugin-react";
import { defineConfig, type ConfigEnv, type UserConfig } from "vite";
import webfontDownload from "vite-plugin-webfont-dl";

export default defineConfig(({ command }: ConfigEnv): UserConfig => {
  const config: UserConfig = {
    plugins: [
      react({
        // Only .tsx files
        include: "**/*.tsx",
      }),
      webfontDownload(),
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
  }
  // command === 'build'
  return {
    // build specific config
    ...config,
  };
});
