import { defineConfig } from 'vite'
// yarn add --dev @esbuild-plugins/node-globals-polyfill
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// yarn add --dev @esbuild-plugins/node-modules-polyfill
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/player.ts',
      name: 'CXAIPlayer',
      fileName: 'cxaiPlayer',
    },
  },
  // resolve: {
  //   alias: {
  //     events: 'rollup-plugin-node-polyfills/polyfills/events',
  //   }
  // }
})
