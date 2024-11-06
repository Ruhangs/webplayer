function callHandler (obj: any, handler: any, next: any, ...args: any[]) {
    const ret = handler.call(obj, ...args)
    if (!next || typeof next !== 'function') {
      return
    }
    if (ret && ret.then) {
      ret.then((...args: any) => {
        next.call(obj, ...args)
      })
    } else {
      next.call(obj, ...args)
    }
  }
  
  /**
   * 给某个处理函数添加hook能力
   * @param { string } hookName
   * @param { Function } handler
   * @param { { pre?: any, next?:any } } preset
   * {
   *   pre: () => { // run beafore hook},
   *   next: () => { // run after hook return}
   * }
   */
  function hook (hookName: string, handler: Function, preset: { pre?: any, next?:any } = { pre: null, next: null }) {
    if (!this.__hooks) {
      this.__hooks = {}
    }
    !this.__hooks[hookName] && (this.__hooks[hookName] = null)
    return function () {
      if (preset.pre) {
        try {
          preset.pre.call(this, ...arguments)
        } catch (e: any) {
          e.message = `[pluginName: ${this.pluginName}:${hookName}:pre error] >> ${e.message}`
          throw e
        }
      }
      if (this.__hooks && this.__hooks[hookName]) {
        try {
          const preRet = runHooks(this, hookName, handler)
          if (preRet) {
            if (preRet.then) {
              preRet.then((isContinue: boolean) => {
                if (isContinue !== false) {
                  callHandler(this, handler, preset.next, ...arguments)
                  // handler.call(this, ...arguments)
                }
              }).catch((e: any) => {
                throw e
              })
            } else {
              callHandler(this, handler, preset.next, ...arguments)
              // handler.call(this, ...arguments)
            }
          } else if (preRet === undefined) {
            callHandler(this, handler, preset.next, ...arguments)
          }
        } catch (e: any) {
          e.message = `[pluginName: ${this.pluginName}:${hookName}] >> ${e.message}`
          throw e
        }
      } else {
        callHandler(this, handler, preset.next, ...arguments)
      }
    }.bind(this)
  }
  
  function findHookIndex (hookName: string, handler: any) {
    const { __hooks } = this
    if (!__hooks || !Array.isArray(__hooks[hookName])) {
      return -1
    }
    const hookHandlers = __hooks[hookName]
    for (let i = 0; i < hookHandlers.length; i++) {
      if (hookHandlers[i] === handler) {
        return i
      }
    }
    return -1
  }
  
  /**
   * add hooks
   * @param { string } hookName
   * @param { Function } handler
   */
  function useHooks (hookName: string, handler: Function) {
    const { __hooks } = this
    if (!__hooks) {
      return
    }
    // eslint-disable-next-line no-prototype-builtins
    if (!__hooks.hasOwnProperty(hookName)) {
      console.warn(`has no supported hook which name [${hookName}]`)
      return false
    }
    if (!Array.isArray(__hooks[hookName])) {
      __hooks[hookName] = []
    }
  
    if (findHookIndex.call(this, hookName, handler) === -1) {
      __hooks[hookName].push(handler)
    }
    return true
  }
  
  /**
   * remove hook
   * @param { string } hookName
   * @param { (plugin: any, ..args) => {} } handler
   * @returns void
   */
  function removeHooks (hookName: string, handler: (plugin: any, ...args: any) => {}) {
    const { __hooks } = this
    if (!__hooks) {
      return
    }
  
    if (Array.isArray(__hooks[hookName])) {
      const hooks = __hooks[hookName]
      const index = findHookIndex.call(this, hookName, handler)
  
      if (index !== -1) {
        hooks.splice(index, 1)
      }
    }
    delete __hooks[hookName]
  }
  
  /**
   * Add hooks to a plugin
   * @param { string } pluginName
   * @param  {...any} args
   */
  function usePluginHooks (pluginName: string, ...args: any) {
    if (!this.plugins || !this.plugins[pluginName.toLowerCase()]) {
      return
    }
    const plugin = this.plugins[pluginName.toLowerCase()]
    return plugin.useHooks && plugin.useHooks(...args)
  }
  
  function removePluginHooks (pluginName: string, ...args: any) {
    if (!this.plugins || !this.plugins[pluginName.toLowerCase()]) {
      return
    }
    const plugin = this.plugins[pluginName.toLowerCase()]
    if (plugin) {
      return plugin.removeHooks && plugin.removeHooks(...args)
    }
  }
  
  /**
   * hook decorator, add hooks props for for an instance
   * @param { any } instance
   * @param { Array<string> } [hookNames]
   */
  function hooksDescriptor (instance: any, presetHooks = []) {
    instance.__hooks = {}
    presetHooks && presetHooks.map(item => {
      instance.__hooks[item] = null
    })
    Object.defineProperty(instance, 'hooks', {
      get: () => {
        return instance.__hooks && Object.keys(instance.__hooks).map(key => {
          if (instance.__hooks[key]) {
            return key
          }
        })
      }
    })
  }
  
  function delHooksDescriptor (instance: any) {
    instance.__hooks = null
  }
  
  function runHooks (obj: any, hookName: string, handler: any, ...args: any) {
    if (obj.__hooks && Array.isArray(obj.__hooks[hookName])) {
      const hooks = obj.__hooks[hookName]
      let index = -1
      /**
       * @private
       */
      const runHooksRecursive = function (obj: any, hookName: string, handler: any, ...args: any) {
        index++
        // 递归终止条件
        if (hooks.length === 0 || index === hooks.length) {
          return handler.call(obj, obj, ...args)
        }
        // 递归调用
        const hook = hooks[index]
        const ret = hook.call(obj, obj, ...args)
        if (ret && ret.then) {
          return ret.then((data: boolean) => {
            return data === false ? null : runHooksRecursive(obj, hookName, handler, ...args)
          }).catch((e: { message: any }) => {
            console.warn(`[runHooks]${hookName} reject`, e.message)
          })
        } else if (ret !== false) {
          return runHooksRecursive(obj, hookName, handler, ...args)
        }
      }
  
      return runHooksRecursive(obj, hookName, handler, ...args)
    } else {
      return handler.call(obj, obj, ...args)
    }
  }
  
  export {
    hooksDescriptor as default,
    hook,
    useHooks,
    usePluginHooks,
    removePluginHooks,
    removeHooks,
    delHooksDescriptor,
    runHooks
  }
  