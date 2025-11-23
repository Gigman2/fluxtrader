import path from "path";
import { defineConfig, loadEnv, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from "vite-plugin-compression";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = mode === "production";

  return {
    server: {
      port: 5034,
      host: "0.0.0.0",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    build: {
      sourcemap: isProduction,
      outDir: "build",
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: isProduction, // Remove console.logs in production
          drop_debugger: true,
          pure_funcs: isProduction
            ? ["console.log", "console.info", "console.debug"]
            : [],
        },
      },
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            router: ["react-router-dom"],
            ui: ["framer-motion", "react-hook-form"],
            utils: ["lodash", "dayjs", "uuid"],
          },
        },
      },
      cssCodeSplit: true,
      assetsInlineLimit: 2048,
    },
    plugins: [
      react(),
      tailwindcss(), // Tailwind CSS v4 Vite plugin
      tsconfigPaths(),
      {
        name: "load+transform-js-files-as-jsx",
        transform(code: string, id: string) {
          if (!id.match(/src\/.*\.js$/)) {
            return null;
          }

          // Use the exposed transform from vite, instead of directly
          // transforming with esbuild
          return transformWithEsbuild(code, id, {
            loader: "jsx",
            jsx: "automatic",
          });
        },
      },
      viteCompression({
        algorithm: "gzip",
        ext: ".gz",
      }),
      viteCompression({
        algorithm: "brotliCompress",
        ext: ".br",
      }),
    ],
    // Optimize css
    css: {
      // Enable CSS modules
      modules: {
        scopeBehaviour: "local",
        localsConvention: "camelCaseOnly",
        generateScopedName: "[local]_[hash:base64:5]",
      },
    },
    define: {
      "process.env": env,
    },
  };
});
