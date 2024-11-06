import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/player.ts',
      name: 'CXAIPlayer-FLV',
      fileName: 'cxaiplayer-flv',
    },
  },
})
