import { defineConfig } from 'vite'
import uniPlugin from '@dcloudio/vite-plugin-uni'
import { networkInterfaces } from 'node:os'

const uni = typeof uniPlugin === 'function'
  ? uniPlugin
  : (uniPlugin as unknown as { default: typeof uniPlugin }).default

export default defineConfig({
  plugins: [
    uni(),
    {
      name: 'h5-address-hint',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          const interfaces = Object.values(networkInterfaces())
            .flat()
            .filter((item) => item?.family === 'IPv4' && !item.internal)
          const lanAddress = interfaces[0]?.address

          console.log('\nH5 已启动：')
          console.log('电脑浏览器：http://localhost:5173')
          if (lanAddress) console.log(`手机浏览器：http://${lanAddress}:5173（请连接同一 Wi-Fi）`)
          console.log('')
        })
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
})
