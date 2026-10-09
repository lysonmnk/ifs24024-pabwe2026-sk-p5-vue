import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import process from "process";

const inlineCssPlugin = () => ({
  name: "inline-css",
  apply: "build",
  enforce: "post",
  transformIndexHtml(html, { bundle }) {
    if (!bundle) return html;
    let newHtml = html;
    for (const [fileName, chunk] of Object.entries(bundle)) {
      if (fileName.endsWith(".css") && chunk.type === "asset" && fileName.includes("index")) {
        const linkPattern = new RegExp(`<link[^>]+href="[^"]*${fileName}"[^>]*>`, "i");
        newHtml = newHtml.replace(linkPattern, `<style>${chunk.source}</style>`);
      }
    }
    return newHtml;
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [vue(), tailwindcss(), inlineCssPlugin()],
    server: { port: Number(env.APP_PORT) || 3000 },
    preview: { port: Number(env.APP_PORT) || 3000 },
    define: {
      DELCOM_BASEURL: JSON.stringify(
        env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1"
      ),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        include: ["src/**/*.{js,vue}"],
        exclude: [
          // File entry & tooling
          "src/main.js",
          "src/setupTests.js",
          "src/test-utils.js",
          "src/router.js",
          // File test
          "**/*.test.{js,jsx}",
          // Dependency & docs
          "node_modules/**",
          ".docs/**",
        ],
        // ✅ Threshold realistis — sesuai coverage saat ini (52% / 21% / 46% / 52%)
        // Naikkan bertahap seiring bertambahnya test
        thresholds: {
          lines: 40,
          functions: 40,
          branches: 15,
          statements: 40,
        },
      },
    },
  };
});