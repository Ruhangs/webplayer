import Util from '../utils/util'
import Sniffer from '../utils/sniffer'
import Errors from '../error'
import * as Events from '../events'
import XG_DEBUG from '../utils/debug'
import hooksDescriptor, { hook, useHooks, removeHooks, delHooksDescriptor } from './hooksDescriptor'

function showErrorMsg (pluginName: string, msg: any) {
  XG_DEBUG.logError(`[${pluginName}] event or callback cant be undefined or null when call ${msg}`)
}

class BasePlugin {
  [key: string]: any;
  __args: IBasePluginOptions
  private __events: Record<string, any> = {}
  private __onceEvents: Record<string, any> = {}
  player: any
  playerConfig: IPlayerOptions
  pluginName: string
  config: { [propName: string]: any }
  logger: any
  

  static defineGetterOrSetter (Obj: any, map: MapType) {
    for (const key in map) {
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        Object.defineProperty(Obj, key, map[key])
      }
    }
  }

  static defineMethod (Obj: any, map: MapType) {
    for (const key in map) {
      if (Object.prototype.hasOwnProperty.call(map, key) && typeof map[key] === 'function') {
        Object.defineProperty(Obj, key, {
          configurable: true,
          value: map[key]
        })
      }
    }
  }

  static get defaultConfig (): MapType {
    return {}
  }

  static get pluginName (): string {
    return 'pluginName'
  }

  constructor (args: IBasePluginOptions) {
    if (Util.checkIsFunction(this.beforeCreate)) {
      this.beforeCreate(args)
    }
    hooksDescriptor(this)

    this.__args = args
    this.__events = {} // 对player的事件监听缓存
    this.__onceEvents = {}
    this.config = args.config || {}
    this.player = null
    this.playerConfig = {}
    this.pluginName = ''
    this.__init(args)
  }

  beforeCreate (args: IBasePluginOptions) {
    console.log(args)
  }
  afterCreate () {}
  beforePlayerInit () {}
  onPluginsReady () {}
  afterPlayerInit () {}
  destroy () {}

  protected __init (args: IBasePluginOptions) {
    this.player = args.player
    this.playerConfig = args.player && args.player.config
    const constructor = this.constructor as typeof BasePlugin;
    this.pluginName = args.pluginName ? args.pluginName.toLowerCase() : constructor.pluginName.toLowerCase()
    this.logger = args.player && args.player.logger
  }

  updateLang (lang: string) {
    if (!lang) {
      lang = this.lang
    }
  }

  get lang (): string {
    return this.player.lang
  }

  get i18n () {
    return this.player.i18n
  }

  get i18nKeys () {
    return this.player.i18nKeys
  }

  /**
   * @description当前支持的事件类型
   * @type { 'touch' | 'mouse' }
   */
  get domEventType (): 'touch' | 'mouse' {
    let _e: 'touch' | 'mouse' = Util.checkTouchSupport() ? 'touch' : 'mouse'
    if (this.playerConfig && (this.playerConfig.domEventType === 'touch' || this.playerConfig.domEventType === 'mouse')) {
      _e = this.playerConfig.domEventType
    }
    return _e
  }

  /**
   *
   * @param { string | Array<string> } event
   * @param { Function } callback
   * @returns
   */
  on (event: string | Array<string>, callback: Function) {
    if (!event || !callback || !this.player) {
      showErrorMsg(this.pluginName, 'plugin.on(event, callback)')
      return
    }
    if (typeof event === 'string') {
      this.__events[event] = callback
      this.player.on(event, callback)
    } else if (Array.isArray(event)) {
      event.forEach((item) => {
        this.__events[item] = callback
        this.player.on(item, callback)
      })
    }
  }

  /**
   *
   * @param { string } event
   * @param { Function } callback
   * @returns
   */
  once (event: string | Array<string>, callback: Function) {
    if (!event || !callback || !this.player) {
      showErrorMsg(this.pluginName, 'plugin.once(event, callback)')
      return
    }
    if (typeof event === 'string') {
      this.__onceEvents[event] = callback
      this.player.once(event, callback)
    } else if (Array.isArray(event)) {
      event.forEach((item) => {
        this.__onceEvents[item] = callback
        this.player.once(event, callback)
      })
    }
  }

  /**
   *
   * @param { string } event
   * @param { Function } callback
   * @returns
   */
  off (event: string | Array<string>, callback: Function) {
    if (!event || !callback || !this.player) {
      showErrorMsg(this.pluginName, 'plugin.off(event, callback)')
      return
    }
    if (typeof event === 'string') {
      delete this.__events[event]
      this.player.off(event, callback)
    } else if (Array.isArray(event)) {
      event.forEach((item) => {
        delete this.__events[item]
        this.player.off(item, callback)
      })
    }
  }

  offAll () {
    ['__events', '__onceEvents'].forEach(key => {
      Object.keys(this[key]).forEach(item => {
        this[key][item] && this.off(item, this[key][item])
        item && delete this[key][item]
      })
    })
    this.__events = {}
    this.__onceEvents = {}
  }

  /**
   *
   * @param { string } event
   * @param  {...any} res
   * @returns
   */
  emit (event: string, ...res: any) {
    if (!this.player) {
      return
    }
    this.player.emit(event, ...res)
  }

  emitUserAction (event: string, action: any, params = {}) {
    if (!this.player) {
      return
    }
    const nParams = {
      ...params,
      pluginName: this.pluginName
    }
    this.player.emitUserAction(event, action, nParams)
  }

  /**
   * @param { string } hookName
   * @param { Function } handler
   * @param { {pre: Function| null , next: Function | null} } preset
   * @returns
   */
  hook (hookName: string, handler: Function, preset: {pre: Function| null , next: Function | null} = { pre: null, next: null }) {
    console.log(hookName, handler, preset)
    // TODO 不确定
    return hook.bind(this, ...arguments)
  }

  /**
   * @param { string } hookName
   * @param { (plugin: any, ...args) => boolean | Promise<any> } handler
   * @param  {...any} args
   * @returns { boolean } isSuccess
   */
  useHooks (hookName: string, handler: any, ...args: any[]) {
    console.log(hookName, handler, ...args)
    return useHooks.bind(this, ...arguments)
  }

  /**
   * @param { string } hookName
   * @param { (plugin: any, ...args) => boolean | Promise<any> } handler
   * @param  {...any} args
   * @returns { boolean } isSuccess
   */
  removeHooks (hookName: any, handler: any, ...args: any[]) {
    console.log(hookName, handler, ...args)
    return removeHooks.bind(this, ...arguments)
  }

  /**
   * 注册子插件
   * @param { any } plugin
   * @param { any } [options]
   * @param { string } [name]
   * @returns { any }
   */
  registerPlugin (plugin: any, options: any = {}, name: string = '') {
    if (!this.player) {
      return
    }
    name && (options.pluginName = name)
    return this.player.registerPlugin({ plugin, options })
  }

  /**
   *
   * @param { string } name
   * @returns { any | null }
   */
  getPlugin (name: string) {
    return this.player ? this.player.getPlugin(name) : null
  }

  __destroy () {
    const player = this.player
    const pluginName = this.pluginName
    this.offAll()
    Util.clearAllTimers(this)
    if (Util.checkIsFunction(this.destroy)) {
      this.destroy()
    }

    ['player', 'playerConfig', 'pluginName', 'logger', '__args', '__hooks'].map(item => {
      this[item] = null
    })
    player.unRegisterPlugin(pluginName)
    delHooksDescriptor(this)
  }
}
export {
  BasePlugin as default,
  Util,
  Sniffer,
  Errors,
  Events,
  XG_DEBUG
}
