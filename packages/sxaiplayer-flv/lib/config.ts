export const defaultConfig = {
    width:  640, // 播放器宽度
    height:  320, // 播放器高度
    auto_play:  false, // 是否自动播放
    disable_full_screen:  false, // 是否禁用全屏功能
    disable_drag:  false, // 是否禁用拖动进度条
    playbackRate:  1, // 倍速播放
    hide_controls:  false, // 是否隐藏控制工具栏

    enableWorker: false,
    enableStashBuffer: true,
    stashInitialSize: undefined,

    isLive: false,

    lazyLoad: true,
    lazyLoadMaxDuration: 3 * 60,
    lazyLoadRecoverDuration: 30,
    deferLoadAfterSourceOpen: false,

    // autoCleanupSourceBuffer: default as false, leave unspecified
    autoCleanupMaxBackwardDuration: 3 * 60,
    autoCleanupMinBackwardDuration: 2 * 60,

    statisticsInfoReportInterval: 600,

    fixAudioTimestampGap: true,

    accurateSeek: false,
    seekType: 'range',  // [range, param, custom]
    seekParamStart: 'bstart',
    seekParamEnd: 'bend',
    rangeLoadZeroStart: false,
    customSeekHandler: undefined,
    reuseRedirectedURL: false,
    // referrerPolicy: leave as unspecified

    headers: undefined,
    customLoader: undefined
};

export function createDefaultConfig(config: playerConfig) {
    return Object.assign(defaultConfig, config);
}