import XG_DEBUG from './debug'
import XgplayerTimeRange from './playerTimeRange'

const util: UtilType = {}

util.createDom = function (el: string = 'div', tpl: string = '', attrs: { [propName: string]: any } = {}, cname: string = ''): Element {
    const dom: HTMLElement | null = document.createElement(el)
    dom.className = cname
    dom.innerHTML = tpl
    Object.keys(attrs).forEach(item => {
        const key = item
        const value = attrs[item]
        if (el === 'video' || el === 'audio' || el === 'live-video') {
            if (value) {
                dom.setAttribute(key, value)
            }
        } else {
            dom.setAttribute(key, value)
        }
    })
    return dom
}

util.createDomFromHtml = function (html: string, attrs: { [propName: string]: any } = {}, classname: string = '') {
    try {
        let doc: HTMLElement | null = document.createElement('div')
        doc.innerHTML = html
        let dom: any = doc.children
        doc = null
        if (dom.length > 0) {
            dom = dom[0]
            classname && util.addClass(dom, classname)
            if (attrs) {
                Object.keys(attrs).forEach(key => {
                    dom.setAttribute(key, attrs[key])
                })
            }
            return dom
        }
        return null
    } catch (err) {
        XG_DEBUG.logError('util.createDomFromHtml', err)
        return null
    }
}

/**
 *
 * @param { HTMLElement } el
 * @param { string } className
 * @returns { boolean }
 */
util.hasClass = function (el: HTMLElement, className: string): boolean {
    if (!el || !className) {
        return false
    }
    try {
        return Array.prototype.some.call(el.classList, item => item === className)
    } catch (e) {
        const orgClassName = el.className && typeof el.className === 'object' ? el.getAttribute('class') : el.className
        return orgClassName && !!orgClassName.match(new RegExp('(\\s|^)' + className + '(\\s|$)')) ? true : false
    }
}

/**
 *
 * @param { HTMLElement } el
 * @param { string } className
 * @returns { void }
 */
util.addClass = function (el: HTMLElement, className: string): void {
    if (!el || !className) {
        return
    }
    try {
        className.replace(/(^\s+|\s+$)/g, '').split(/\s+/g).forEach(item => {
            item && el.classList.add(item)
        })
    } catch (e) {
        if (!util.hasClass(el, className)) {
            if (el.className && typeof el.className === 'object') {
                el.setAttribute('class', el.getAttribute('class') + ' ' + className)
            } else {
                el.className += ' ' + className
            }
        }
    }
}

/**
 *
 * @param { HTMLElement } el
 * @param { string } className
 * @returns { void }
 */
util.removeClass = function (el: HTMLElement, className: string): void {
    if (!el || !className) {
        return
    }
    try {
        className.replace(/(^\s+|\s+$)/g, '').split(/\s+/g).forEach(item => {
            item && el.classList.remove(item)
        })
    } catch (e) {
        if (util.hasClass(el, className)) {
            className.split(/\s+/g).forEach(item => {
                const reg = new RegExp('(\\s|^)' + item + '(\\s|$)')
                if (el.className && typeof el.className === 'object') {
                    el.setAttribute('class', el.getAttribute('class')!.replace(reg, ' '))
                } else {
                    el.className = el.className.replace(reg, ' ')
                }
            })
        }
    }
}

/**
 *
 * @param { HTMLElement } el
 * @param { string } className
 * @returns { void }
 */
util.toggleClass = function (el: HTMLElement, className: string): void {
    if (!el) {
        return
    }

    className.split(/\s+/g).forEach(item => {
        if (util.hasClass(el, item)) {
            util.removeClass(el, item)
        } else {
            util.addClass(el, item)
        }
    })
}

/**
 *
 * @param { string | Object } args0
 * @param { string } [className]
 * @returns { string }
 */
util.classNames = function (): string {
    const classname = []
    for (let i = 0; i < arguments.length; i++) {
        if (util.typeOf(arguments[i]) === 'String') {
            // classname += `${arguments[i]}`
            classname.push(arguments[i])
        } else if (util.typeOf(arguments[i]) === 'Object') {
            Object.keys(arguments[i]).map(key => {
                if (arguments[i][key]) {
                    // classname += key
                    classname.push(key)
                }
            })
        }
        // if (i < arguments.length - 1) {
        //   classname += ' '
        // }
    }
    return classname.join(' ')
}

/**
 *
 * @param { HTMLElement } el
 * @param { string } sel
 * @returns { HTMLElement }
 */
util.findDom = function (el: Document = document, sel: string): any {
    let dom
    // fix querySelector IDs that start with a digit
    // https://stackoverflow.com/questions/37270787/uncaught-syntaxerror-failed-to-execute-queryselector-on-document
    try {
        dom = el.querySelector(sel)
    } catch (e) {
        XG_DEBUG.logError('util.findDom', e)
        if (sel.indexOf('#') === 0) {
            dom = el.getElementById(sel.slice(1))
        }
    }
    return dom
}

// /**
//  *
//  * @param { HTMLElement } dom
//  * @param { string } key
//  * @returns { any }
//  */
// util.getCss = function (dom: any, key: string): any {
//   return dom.currentStyle ? dom.currentStyle[key] : document.defaultView?.getComputedStyle(dom, false)[key]
// }

util.padStart = function (str: string, length: number, pad: any) {
    const charstr = String(pad)
    const len = length >> 0
    let maxlen = Math.ceil(len / charstr.length)
    const chars = []
    const r = String(str)
    while (maxlen--) {
        chars.push(charstr)
    }
    return chars.join('').substring(0, len - r.length) + r
}

/**
 *
 * @param { number } time
 * @returns { string }
 */
util.format = function (time: number): string {
    if (window.isNaN(time)) {
        return ''
    }
    time = Math.round(time)
    const hour = util.padStart(Math.floor(time / 3600), 2, 0)
    const minute = util.padStart(Math.floor((time - hour * 3600) / 60), 2, 0)
    const second = util.padStart(Math.floor((time - hour * 3600 - minute * 60)), 2, 0)
    return (hour === '00' ? [minute, second] : [hour, minute, second]).join(':')
}

/**
 *
 * @param { Object } e
 * @returns { Object }
 */
util.event = function (e: any): any {
    if (e.touches) {
        const touch = e.touches[0] || e.changedTouches[0]
        e.clientX = touch.clientX || 0
        e.clientY = touch.clientY || 0
        e.offsetX = touch.pageX - touch.target.offsetLeft
        e.offsetY = touch.pageY - touch.target.offsetTop
    }
    e._target = e.target || e.srcElement
}

/**
 *
 * @param { any } obj
 * @returns { string }
 */
util.typeOf = function (obj: any): string {
    const matchObj = Object.prototype.toString.call(obj).match(/([^\s.*]+)(?=]$)/g)!
    return matchObj[0]
}

/**
 *
 * @param { any } dst
 * @param { any } src
 * @returns { any }
 */
util.deepCopy = function (dst: any, src: any): any {
    if (util.typeOf(src) === 'Object' && util.typeOf(dst) === 'Object') {
        Object.keys(src).forEach(key => {
            // eslint-disable-next-line no-undef
            if (util.typeOf(src[key]) === 'Object' && !(src[key] instanceof Node)) {
                if (dst[key] === undefined || dst[key] === undefined) {
                    dst[key] = src[key]
                } else {
                    util.deepCopy(dst[key], src[key])
                }
            } else if (util.typeOf(src[key]) === 'Array') {
                dst[key] = util.typeOf(dst[key]) === 'Array' ? dst[key].concat(src[key]) : src[key]
            } else {
                dst[key] = src[key]
            }
        })
        return dst
    }
}

/**
 *
 * @param { any } dst
 * @param { any } src
 * @returns { any }
 */
util.deepMerge = function (dst: any, src: any): any {
    Object.keys(src).map(key => {
        if (util.typeOf(src[key]) === 'Array' && util.typeOf(dst[key]) === 'Array') {
            if (util.typeOf(dst[key]) === 'Array') {
                dst[key].push(...src[key])
            }
        } else if (util.typeOf(dst[key]) === util.typeOf(src[key]) && dst[key] !== null && util.typeOf(dst[key]) === 'Object' && !(src[key] instanceof window.Node)) {
            util.deepMerge(dst[key], src[key])
        } else {
            src[key] !== null && (dst[key] = src[key])
        }
    })
    return dst
}

util.getBgImage = function (el: any) {
    // fix: return current page url when url is none
    const url = (el.currentStyle || window.getComputedStyle(el, null)).backgroundImage
    if (!url || url === 'none') {
        return ''
    }
    const a = document.createElement('a')
    a.href = url.replace(/url\("|"\)/g, '')
    return a.href
}

/**
 *
 * @param {  HTMLElement } dom
 * @returns { HTMLElement | null }
 */
util.copyDom = function (dom: HTMLElement): HTMLElement | null {
    if (dom && dom.nodeType === 1) {
        const back = document.createElement(dom.tagName)
        Array.prototype.forEach.call(dom.attributes, (node) => {
            back.setAttribute(node.name, node.value)
        })
        if (dom.innerHTML) {
            back.innerHTML = dom.innerHTML
        }
        return back
    } else {
        return null
    }
}

/**
 *
 * @param { any } context
 * @param { string } eventName
 * @param { function } intervalFunc
 * @param { number } frequency
 */
util.setInterval = function (context: any, eventName: string, intervalFunc: Function, frequency: number) {
    if (!context._interval[eventName]) {
        context._interval[eventName] = window.setInterval(intervalFunc.bind(context), frequency)
    }
}

/**
 *
 * @param { any } context
 * @param { string } eventName
 * @returns { void }
 */
util.clearInterval = function (context: any, eventName: string) {
    clearInterval(context._interval[eventName])
    context._interval[eventName] = null
}

/**
 *
 * @param { any } context
 * @param { function } fun
 * @param { number } time
 * @returns { number }
 */
util.setTimeout = function (context: any, fun: () => void, time: number): any {
    if (!context._timers) {
        context._timers = []
    }
    const id = setTimeout(() => {
        fun()
        util.clearTimeout(context, id)
    }, time)
    context._timers.push(id)
    return id
}

/**
 *
 * @param { any } context
 * @param { number } id
 */
util.clearTimeout = function (context: any, id: string | number | NodeJS.Timeout | undefined) {
    const { _timers } = context
    if (util.typeOf(_timers) === 'Array') {
        for (let i = 0; i < _timers.length; i++) {
            if (_timers[i] === id) {
                _timers.splice(i, 1)
                clearTimeout(id)
                break
            }
        }
    } else {
        clearTimeout(id)
    }
}

/**
 *
 * @param { any } context
 */
util.clearAllTimers = function (context: any) {
    const { _timers } = context
    if (util.typeOf(_timers) === 'Array') {
        _timers.map((item: string | number | NodeJS.Timeout | undefined) => {
            clearTimeout(item)
        })
        context._timerIds = []
    }
}

/**
 *
 * @param { string } name
 * @param { string } imgUrl
 * @param { number } [width]
 * @param { number } [height]
 * @returns { HTMLElement }
 */
util.createImgBtn = function (name: string, imgUrl: string, width: string, height: string) {
    const btn = util.createDom(`xg-${name}`, '', {}, `xgplayer-${name}-img`)
    btn.style.backgroundImage = `url("${imgUrl}")`
    if (width && height) {
        let w, h, unit
        ['px', 'rem', 'em', 'pt', 'dp', 'vw', 'vh', 'vm', '%'].every((item) => {
            if (width.indexOf(item) > -1 && height.indexOf(item) > -1) {
                w = parseFloat(width.slice(0, width.indexOf(item)).trim())
                h = parseFloat(height.slice(0, height.indexOf(item)).trim())
                unit = item
                return false
            } else {
                return true
            }
        })
        btn.style.width = `${w}${unit}`
        btn.style.height = `${h}${unit}`
        btn.style.backgroundSize = `${w}${unit} ${h}${unit}`
        if (name === 'start' && h && w) {
            btn.style.margin = `-${h / 2}${unit} auto auto -${w / 2}${unit}`
        } else {
            btn.style.margin = 'auto 5px auto 5px'
        }
    }
    return btn
}

/**
 *
 * @param { string } hex
 * @param { string | number } alpha
 * @returns { string }
 */
// util.Hex2RGBA = function (hex: string, alpha: any) {
//   const rgb: number[] = [] // 定义rgb数组
//   // eslint-disable-next-line no-useless-escape
//   if (/^\#[0-9A-F]{3}$/i.test(hex)) {
//     let sixHex = '#'
//     hex.replace(/[0-9A-F]/ig, function (kw: any) {
//       sixHex += kw + kw
//     })
//     hex = sixHex
//   }
//   if (/^#[0-9A-F]{6}$/i.test(hex)) {
//     hex.replace(/[0-9A-F]{2}/ig, function (kw: string) {
//       rgb.push(parseInt(kw, 16))
//     })
//     return `rgba(${rgb.join(',')}, ${alpha})`
//   } else {
//     return 'rgba(255, 255, 255, 0.1)'
//   }
// }

/**
 *
 * @returns { HTMLElement | null }
 */
util.getFullScreenEl = function () {
    // || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
    return document.fullscreenElement
}

/**
 * @param { any }
 * @returns { boolean }
 */
util.checkIsFunction = function (fun: any): boolean {
    return fun && typeof fun === 'function'
}

/**
 * @param { any }
 * @returns { boolean }
 */
util.checkIsObject = function (obj: null): boolean {
    return obj !== null && typeof obj === 'object'
}

/**
 * @param { HTMLElement }
 */
util.hide = function (dom: { style: { display: string } }): void {
    dom.style.display = 'none'
}

/**
 * @param { HTMLElement }
 * @param { block | flex | inline-block | inline-flex } [display]
 */
util.show = function (dom: { style: { display: any } }, display: string) {
    dom.style.display = display || 'block'
}

/**
 *
 * @param { any } val
 * @returns { boolean }
 */
util.isUndefined = function (val: null) {
    if (typeof val === 'undefined' || val === null) {
        return true
    }
}

util.isNotNull = function (val: null | undefined) {
    return !(val === undefined || val === null)
}

/**
 *
 * @param { HTMLElement } dom
 * @param { string } [text]
 * @returns
 */
util.setStyleFromCsstext = function (dom: HTMLElement, text: string) {
    // dom.setAttribute(style, text)
    if (!text) {
        return
    }
    if (util.typeOf(text) === 'String') {
        const styleArr = text.replace(/\s+/g, '').split(';')
        styleArr.map((item: string) => {
            if (item) {
                const arr: any = item.split(':')
                if (arr.length > 1) {
                    dom.style[arr[0]] = arr[1]
                }
            }
        })
    } else {
        Object.keys(text).map((key: any) => {
            dom.style[key] = text[key]
        })
    }
}

/**
 *
 * @param { string } key
 * @param { Array<any>} list
 * @returns { boolean }
 */
function checkIsIn(key: string | any[], list: string | any[]) {
    for (let i = 0, len = list.length; i < len; i++) {
        if (key.indexOf(list[i]) > -1) {
            return true
        }
    }
    return false
}

/**
 *
 * @param { HTMLElement } dom
 * @param { Array<string> } [list] attribute names to filter
 * @returns { {} | {[propName: string]: any;} }
 */
util.filterStyleFromText = function (dom: HTMLElement, list: Array<string> = ['width', 'height', 'top', 'left', 'bottom', 'right', 'position', 'z-index', 'padding', 'margin', 'transform']) {
    const _cssText = dom.style.cssText
    if (!_cssText) {
        return {}
    }
    const styleArr = _cssText.replace(/\s+/g, '').split(';')
    const ret: any = {}
    const remain: any = {}
    styleArr.map((item: string) => {
        if (item) {
            const arr: any = item.split(':')
            if (arr.length > 1) {
                if (checkIsIn(arr[0], list)) {
                    ret[arr[0]] = arr[1]
                    // dom.style[arr[0]] = 'initial'
                } else {
                    remain[arr[0]] = arr[1]
                }
            }
        }
    })
    dom.setAttribute('style', '')
    Object.keys(remain).map((key: any) => {
        // netStyle += `${key}: ${remain[key]};`
        dom.style[key] = remain[key]
    })
    return ret
}

/**
 *
 * @param { HTMLElement } dom
 * @returns { {} | {[propName: string]: any;} }
 */
util.getStyleFromCsstext = function (dom: { style: { cssText: any } }) {
    const _cssText = dom.style.cssText
    if (!_cssText) {
        return {}
    }
    const styleArr = _cssText.replace(/\s+/g, '').split(';')
    const ret: any = {}
    styleArr.map((item: string) => {
        if (item) {
            const arr = item.split(':')
            if (arr.length > 1) {
                ret[arr[0]] = arr[1]
            }
        }
    })
    return ret
}

util.preloadImg = (url: string, onload: (arg0: any) => any, onerror: (arg0: any) => any) => {
    if (!url) {
        return
    }
    let img: any = new window.Image()
    img.onload = (e: any) => {
        img = null
        onload && onload(e)
    }
    img.onerror = (e: any) => {
        img = null
        onerror && onerror(e)
    }
    img.src = url
}

util.stopPropagation = (e: { stopPropagation: () => void }) => {
    if (e) {
        e.stopPropagation()
    }
}

util.scrollTop = function () {
    return window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
}

util.scrollLeft = function () {
    return window.pageXOffset ||
        document.documentElement.scrollLeft ||
        document.body.scrollLeft ||
        0
}

util.checkTouchSupport = function () {
    return 'ontouchstart' in window
}

util.getBuffered2 = (vbuffered: { length: number; start: (arg0: number) => number; end: (arg0: number) => any }, maxHoleDuration = 0.5) => { // ref: hls.js
    const buffered = []
    for (let i = 0; i < vbuffered.length; i++) {
        buffered.push({ start: vbuffered.start(i) < 0.5 ? 0 : vbuffered.start(i), end: vbuffered.end(i) })
    }
    buffered.sort(function (a, b) {
        const diff = a.start - b.start
        if (diff) {
            return diff
        } else {
            return b.end - a.end
        }
    })
    let buffered2 = []
    if (maxHoleDuration) {
        for (let i = 0; i < buffered.length; i++) {
            const buf2len = buffered2.length
            if (buf2len) {
                const buf2end = buffered2[buf2len - 1].end
                if ((buffered[i].start - buf2end) < maxHoleDuration) {
                    if (buffered[i].end > buf2end) {
                        buffered2[buf2len - 1].end = buffered[i].end
                    }
                } else {
                    buffered2.push(buffered[i])
                }
            } else {
                buffered2.push(buffered[i])
            }
        }
    } else {
        buffered2 = buffered
    }
    return new XgplayerTimeRange(buffered2)
}

/**
 * @description css中有zoom的时候，位移会等比缩放，但是元素的宽高不会等比缩放，所以通过该api做统一
 * https://bugs.chromium.org/p/chromium/issues/detail?id=429140#c8
 * @param {Event} e
 * @param {number} zoom
 * @returns
 */
util.getEventPos = function (e: { touches: string | any[]; x: number; y: number; clientX: number; clientY: number; offsetX: number; offsetY: number; pageX: number; pageY: number }, zoom = 1) {
    if (e.touches && e.touches.length > 0) {
        e = e.touches[0]
    }
    return {
        x: e.x / zoom,
        y: e.y / zoom,
        clientX: e.clientX / zoom,
        clientY: e.clientY / zoom,
        offsetX: e.offsetX / zoom,
        offsetY: e.offsetY / zoom,
        pageX: e.pageX / zoom,
        pageY: e.pageY / zoom
    }
}

util.requestAnimationFrame = function (callback: FrameRequestCallback) {
    const _fun = window.requestAnimationFrame
    // // Older versions Chrome/Webkit
    // window.webkitRequestAnimationFrame ||

    // // Firefox < 23
    // window.mozRequestAnimationFrame ||

    // // opera
    // window.oRequestAnimationFrame ||

    // // ie
    // window.msRequestAnimationFrame
    if (_fun) {
        return _fun(callback)
    }
}

util.getHostFromUrl = function (url: string) {
    if (util.typeOf(url) !== 'String') {
        return ''
    }
    const results = url.split('/') // 以“/”进行分割
    let domain = ''
    if (results.length > 3 && results[2]) {
        domain = results[2]
    }
    return domain
}

util.cancelAnimationFrame = function (frameId: number) {
    //  || window.mozCancelAnimationFrame || window.cancelRequestAnimationFrame
    const _fun = window.cancelAnimationFrame
    _fun && _fun(frameId)
}

/**
 * @desc Check whether it is MediaSource start
 * @param { HTMLVideoElement | HTMLAudioElement | HTMLElement } video
 * @returns { boolean }
 */
util.isMSE = function (video: { media: any; currentSrc: string; src: string }) {
    if (video.media) {
        video = video.media
    }
    if (!video || !(video instanceof HTMLMediaElement)) {
        return false
    }
    return /^blob/.test(video.currentSrc) || /^blob/.test(video.src)
}

util.isBlob = function (url: string) {
    return typeof url === 'string' && /^blob/.test(url)
}

/**
 * @param { number } did
 * @returns { string }
 */
util.generateSessionId = function (did: number = 0) {
    let d = new Date().getTime()
    try {
        did = parseInt(did.toString())
    } catch (e) {
        did = 0
    }
    d += did
    if (window.performance && typeof window.performance.now === 'function') {
        d += parseInt(window.performance.now().toString()) // use high-precision timer if available
    }
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}

util.createEvent = function (eventName: string) {
    let event
    if (typeof window.Event === 'function') {
        event = new Event(eventName)
    } else {
        event = document.createEvent('Event')
        event.initEvent(eventName, true, true)
    }
    return event
}

/**
 * @description Adjust currentTime according to duration, when ended is true and currentTime is less than duration, or
 *              currentTime is greater than duration, return duration
 * @param { number } time
 * @param { number } duration
 * @param { boolean } isEnded
 * @returns { number } Adjusted time
 */
util.adjustTimeByDuration = function (time: number, duration: number, isEnded: boolean): number {
    if (!duration || !time) {
        return time
    }
    if (time > duration || (isEnded && time < duration)) {
        return duration
    }
    return time
}

util.createPositionBar = function (className: any, root: { appendChild: (arg0: any) => void }) {
    const dom = util.createDom(
        'xg-bar',
        '',
        { 'data-index': -1 },
        className
    )
    root.appendChild(dom)
    return dom
}

util.getTransformStyle = function (pos = { x: 0, y: 0, scale: 1, rotate: 0 }, transformValue = '') {
    const styles = {
        scale: `${pos.scale || 1}`,
        translate: `${pos.x || 0}%, ${pos.y || 0}%`,
        rotate: `${pos.rotate || 0}deg`
    }
    // 只复写Transform中已知的函数，对于其他函数不修改。解决全屏或者rotate插件执行时，对于镜像插件的影响
    for (const [key, value] of Object.entries(styles)) {
        const reg = new RegExp(`${key}\\([^\\(]+\\)`, 'g') // reg match: TransformFunc(values)
        const fn = `${key}(${value})`
        if (reg.test(transformValue)) {
            reg.lastIndex = -1
            transformValue = transformValue.replace(reg, fn)
        } else {
            transformValue += `${fn} `
        }
    }
    return transformValue
}

/**
 * @description 角度换算
 * @param {number} val
 * @returns {number}
 */
util.convertDeg = function (val: number): number {
    if (Math.abs(val) <= 1) {
        return val * 360
    }
    return val % 360
}

util.getIndexByTime = function (time: number, segments: string | any[]) {
    const _len = segments.length
    let _index = -1
    if (_len < 1) {
        return _index
    }
    if (time <= segments[0].end || _len < 2) {
        _index = 0
    } else if (time > segments[_len - 1].end) {
        _index = _len - 1
    } else {
        for (let i = 1; i < _len; i++) {
            if (time > segments[i - 1].end && time <= segments[i].end) {
                _index = i
                break
            }
        }
    }
    return _index
}
util.getOffsetCurrentTime = function (currentTime: number, segments: string | any[], index = -1) {
    let _index = -1
    if (index >= 0 && index < segments.length) {
        _index = index
    } else {
        _index = util.getIndexByTime(currentTime, segments)
    }
    if (_index < 0) {
        return -1
    }
    const _len = segments.length
    const { start, end, cTime, offset } = segments[_index]
    if (currentTime < start) {
        return cTime
    } else if (currentTime >= start && currentTime <= end) {
        return currentTime - offset
    } else if (currentTime > end && _index >= _len - 1) {
        return end
    }
    return -1
}

/**
 *
 * @param {*} offsetTime
 * @param {*} segments
 * @returns
 */
util.getCurrentTimeByOffset = function (offsetTime: number, segments: string | any[]) {
    let _index = -1
    if (!segments || segments.length < 0) {
        return offsetTime
    }
    for (let i = 0; i < segments.length; i++) {
        if (offsetTime <= segments[i].duration) {
            _index = i
            break
        }
    }
    if (_index !== -1) {
        const { start } = segments[_index]
        if (_index - 1 < 0) {
            return start + offsetTime
        } else {
            return start + (offsetTime - segments[_index - 1].duration)
        }
    }
    return offsetTime
}

function isObject(value: any) {
    const type = typeof value
    return value !== null && (type === 'object' || type === 'function')
}

function debounce(func: any, wait: number, options: any) {
    let lastArgs: any,
        lastThis: any,
        maxWait: any,
        result: any,
        timerId: any,
        lastCallTime: any

    let lastInvokeTime = 0
    let leading = false
    let maxing = false
    let trailing = true

    // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
    const useRAF = (!wait && wait !== 0 && typeof window.requestAnimationFrame === 'function')

    if (typeof func !== 'function') {
        throw new TypeError('Expected a function')
    }
    wait = +wait || 0
    if (isObject(options)) {
        leading = !!options.leading
        maxing = 'maxWait' in options
        maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait
        trailing = 'trailing' in options ? !!options.trailing : trailing
    }

    function invokeFunc(time: number) {
        const args = lastArgs
        const thisArg = lastThis

        lastArgs = lastThis = undefined
        lastInvokeTime = time
        result = func.apply(thisArg, args)
        return result
    }

    function startTimer(pendingFunc: FrameRequestCallback, wait: number | undefined) {
        if (useRAF) {
            window.cancelAnimationFrame(timerId)
            return window.requestAnimationFrame(pendingFunc)
        }
        return setTimeout(pendingFunc, wait)
    }

    function cancelTimer(id: any) {
        if (useRAF) {
            return window.cancelAnimationFrame(id)
        }
        clearTimeout(id)
    }

    function leadingEdge(time: number) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time
        // Start the timer for the trailing edge.
        timerId = startTimer(timerExpired, wait)
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result
    }

    function remainingWait(time: number) {
        const timeSinceLastCall = time - lastCallTime
        const timeSinceLastInvoke = time - lastInvokeTime
        const timeWaiting = wait - timeSinceLastCall

        return maxing
            ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
            : timeWaiting
    }

    function shouldInvoke(time: number) {
        const timeSinceLastCall = time - lastCallTime
        const timeSinceLastInvoke = time - lastInvokeTime

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
            (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait))
    }

    function timerExpired() {
        const time = Date.now()
        if (shouldInvoke(time)) {
            return trailingEdge(time)
        }
        // Restart the timer.
        timerId = startTimer(timerExpired, remainingWait(time))
    }

    function trailingEdge(time: number) {
        timerId = undefined

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
            return invokeFunc(time)
        }
        lastArgs = lastThis = undefined
        return result
    }

    function cancel() {
        if (timerId !== undefined) {
            cancelTimer(timerId)
        }
        lastInvokeTime = 0
        lastArgs = lastCallTime = lastThis = timerId = undefined
    }

    function flush() {
        return timerId === undefined ? result : trailingEdge(Date.now())
    }

    function pending() {
        return timerId !== undefined
    }

    function debounced(this: any, ...args: any[]) {
        const time = Date.now()
        const isInvoking = shouldInvoke(time)

        lastArgs = args
        lastThis = this
        lastCallTime = time

        if (isInvoking) {
            if (timerId === undefined) {
                return leadingEdge(lastCallTime)
            }
            if (maxing) {
                // Handle invocations in a tight loop.
                timerId = startTimer(timerExpired, wait)
                return invokeFunc(lastCallTime)
            }
        }
        if (timerId === undefined) {
            timerId = startTimer(timerExpired, wait)
        }
        return result
    }
    debounced.cancel = cancel
    debounced.flush = flush
    debounced.pending = pending
    return debounced
}

function throttle(func: any, wait: any, options: { leading?: any; trailing?: boolean }) {
    let leading = true
    let trailing = true

    if (typeof func !== 'function') {
        throw new TypeError('Expected a function')
    }
    if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading
        trailing = 'trailing' in options ? !!options.trailing : trailing
    }
    return debounce(func, wait, {
        leading,
        trailing,
        maxWait: wait
    })
}

/**
 * @returns { string }
 */
function getLang() {
    let lang = (document.documentElement.getAttribute('lang') || navigator.language || 'zh-cn').toLocaleLowerCase()
    if (lang === 'zh-cn') {
        lang = 'zh'
    }
    return lang
}

function checkIsCurrentVideo(element: { getAttribute: (arg0: any) => any; tagName: string }, playerId: any, key: any) {
    if (!element) {
        return
    }
    const pid = element.getAttribute(key)
    if (pid && pid === playerId && (element.tagName === 'VIDEO' || element.tagName === 'AUDIO')) {
        return true
    }
    return false
}

export {
    util as default,
    checkIsCurrentVideo,
    debounce,
    throttle,
    getLang
}
