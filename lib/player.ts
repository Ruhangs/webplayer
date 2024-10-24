// import PLAYER_CONATANY from "./constants"

import { createDefaultConfig } from "./config"
import flvPlayerCore from "./player/flv/flv_core"

/**
 * 该文件中主要是用于处理播放器的交互以及当前环境可以支撑哪些解码模式
 */
export class sxaiPlayer {
  _config: playerConfig
  _containerId: string
  _player: any
  constructor(containerId: string, config: playerConfig) {
    this._config = config
    this.initDefaultConfig(config)
    this._containerId = containerId
    this._player = null
  }

  initDefaultConfig(config: playerConfig) {
    this._config = createDefaultConfig(config)
  }

  
  supportedModes(mediaInfo: Object) {
    const list = [] as Array<String>
    console.log(mediaInfo)
    return list
  }
 
  /**
   * 该方法中主要用于选择什么样的播放器内核
   * 首先，判断url中传递的媒体类型，媒体编码信息等
   * 然后，根据这些信息做选择
   */
  initPlayer() {
    console.log("chushihua")
    const type = this._config.type || this._config.url.split(".")[-1]
    // const container = document.getElementById(this._containerId)
    if(type === 'flv') {
      this._player = new flvPlayerCore(this._config)
    }
    // }else if(type === 'mp4') {
    //   this._player = document.createElement("video")
    //   this._player.src = this._config.url
    //   this._player.muted = true
    
    //   container?.appendChild(this._player)
    // }
    
  }

  play() {
    console.log("bofang",  this._player)
    this._player.install()
    // this._player.addEventListener("canplay", (event: any) => {
    //   this._player.play()
    //   console.log(
    //     event,
    //     "Yay! readyState just increased to  " +
    //       "HAVE_CURRENT_DATA or greater for first time.",
    //   );
    // });
  }

  pause() {
    // 暂停
  }

  seek() {
    // 点击进度条跳转
  }
}

