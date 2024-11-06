import './style.css'
import { sxaiPlayer } from '../lib/player'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>web播放器开发</h1>
    <div id="myplayer"></div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`


const player = new sxaiPlayer("myplayer", {
  type: "flv",
  url: "http://pull-demo.volcfcdnrd.com/live/st-4536521_yzmuhevcd.flv",
  isLive: false
})

console.log(player)

player.initPlayer()

player.play()

