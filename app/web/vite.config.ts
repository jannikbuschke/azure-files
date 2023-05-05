import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { name, version } from "./package.json"
// import "vite/types/importMeta.d" // Not needed when not using TypeScript

// if (import.meta.hot) {
//   import.meta.hot.on("vite:beforeFullReload", () => {
//     throw "(skipping full reload)"
//   })
// }

export default defineConfig({
  define: {
    pkgJson: { name, version },
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],

  build: {
    sourcemap: true,
    outDir: "./build/",
    target: "es2015",
    minify: false,
  },
  esbuild: {
    jsxFactory: `jsx`,
    logOverride: { "this-is-undefined-in-esm": "silent" },
    // jsxInject: `import { jsx, css } from '@emotion/react'`,
  },
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
  server: {
    port: 3000,
    open: false,
    hmr: {
      // port: 5001,
      clientPort: 5001,
    },
  },
})
