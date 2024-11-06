// @typedef { import ('./player').default } Player
interface ErrorInfo {
    errorType: string,
    errorCode: number,
    errorMessage: string,
    originError: any,
    mediaError: any,
    ext: MapType
}

interface MapType {
    [propName: string]: any;
}

interface UtilType {
    [propName: string]: any;
    typeOf?: (obj: any) => string
}

interface IBasePluginOptions {
    [propName: string]: any;
    index?: number;
    player?: Player;
    pluginName?: string;
    config?: {
        [propName: string]: any;
    };
}

interface IUIPluginOptions {
    index?: number,
    player?: Player,
    pluginName?: string,
    config?: {
        [propName: string]: any
    },
    root?: HTMLElement,
    position?: string,
    [propName: string]: any
}

interface IPlayerOptions {
    id?: string,
    el?: HTMLElement,
    url?: IUrl,
    domEventType?: 'default' | 'touch' | 'mouse',
    nullUrlStart?: boolean,
    width?: number | string,
    height?: number | string,
    fluid?: boolean,
    fitVideoSize?: 'fixWidth' | 'fixHeight' | 'fixed',
    videoFillMode?: 'auto' | 'fillHeight' | 'fillWidth' | 'fill' | 'cover' | 'contain',
    volume?: number | { [propName: string]: any },
    autoplay?: boolean,
    autoplayMuted?: boolean,
    loop?: boolean,
    isLive?: boolean,
    zoom?: number,
    videoInit?: boolean,
    poster?: string | { [propName: string]: any },
    isMobileSimulateMode?: 'mobile' | 'pc',
    defaultPlaybackRate?: number,
    execBeforePluginsCall?: () => any,
    allowSeekAfterEnded?: boolean,
    enableContextmenu?: boolean,
    closeVideoClick?: boolean,
    closeVideoDblclick?: boolean,
    closePlayerBlur?: boolean,
    closeDelayBlur?: boolean,
    leavePlayerTime?: number,
    closePlayVideoFocus?: boolean,
    closePauseVideoFocus?: boolean,
    closeFocusVideoFocus?: boolean,
    closeControlsBlur?: boolean,
    topBarAutoHide?: boolean,
    videoAttributes?: { [propName: string]: any },
    startTime?: number,
    seekedStatus?: 'play' | 'pause' | 'auto',
    miniprogress?: boolean,
    disableSwipeHandler?: () => any,
    enableSwipeHandler?: () => any,
    preProcessUrl?: (url: IUrl, ext?: { [propName: string]: any }) => { url: IUrl, [propName: string]: any },
    ignores?: Array<'cssfullscreen' | 'screenshot' | 'pip' | 'miniscreen' | 'keyboard' | 'download' | 'playbackrate' | 'time' | 'definition' | 'error' | 'fullscreen' | 'loading' | 'mobile' | 'pc' | 'play' | 'poster' | 'progress' | 'replay' | 'start' | 'volume' | string>,
    inactive?: number,
    lang?: string,
    controls?: boolean | { [propName: string]: any },
    marginControls?: boolean,
    fullscreenTarget?: HTMLElement, // 全屏作用的dom元素
    screenShot?: boolean | { [propName: string]: any },
    rotate?: boolean | { [propName: string]: any },
    pip?: boolean | { [propName: string]: any },
    download?: boolean | { [propName: string]: any },
    mini?: boolean | { [propName: string]: any },
    cssFullscreen?: boolean | { [propName: string]: any },
    keyShortcut?: boolean,
    presets?: any[],
    plugins?: any[]
    playbackRate?: boolean | Array<number> | { [propName: string]: any },
    definition?: { list: Array<IDefinition>, defaultDefinition?: IDefinition['definition'], [propName: string]: any },
    playsinline?: boolean,
    customDuration?: number,
    timeOffset?: number,
    icons?: { [propName: string]: string | HTMLElement | (() => HTMLElement) | string },
    i18n?: Array<any>,
    tabindex?: number,
    thumbnail?: {
        urls: Array<string>,
        pic_num: number,
        col: number,
        row: number,
        height?: number,
        width?: number,
    },
    videoConfig?: { [propName: string]: any },
    isHideTips?: boolean,
    minWaitDelay?: number,
    commonStyle?: {
        progressColor?: string,
        playedColor?: string,
        cachedColor?: string,
        sliderBtnStyle?: { [propName: string]: any },
        volumeColor?: string
    },
    [propName: string]: any;
}