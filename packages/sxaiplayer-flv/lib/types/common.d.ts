interface playerConfig {
    accurateSeek?: any
    url: string, // 播放链接
    type?: String, // 媒体类型
    width?: Number, // 播放器宽度
    height?: Number, // 播放器高度
    auto_play?: Boolean, // 是否自动播放
    disable_full_screen?: Boolean, // 是否禁用全屏功能
    disable_drag?: Boolean, // 是否禁用拖动进度条
    playbackRate?: Number, // 倍速播放
    hide_controls?: Boolean, // 是否隐藏控制工具栏
    isLive?: boolean, // 是否是直播

    enableWorker?: boolean,
    enableStashBuffer?: boolean,
    stashInitialSize?: any,

    lazyLoad?: boolean,
    lazyLoadMaxDuration?: number,
    lazyLoadRecoverDuration?: number,
    deferLoadAfterSourceOpen?: boolean,

    // autoCleanupSourceBuffer: default as false, leave unspecified
    autoCleanupMaxBackwardDuration?: number,
    autoCleanupMinBackwardDuration?: number,

    statisticsInfoReportInterval?: number,

    fixAudioTimestampGap?: boolean,

    accurateSeek?: boolean,
    seekType?: string,  // [range, param, custom]
    seekParamStart?: string,
    seekParamEnd?: string,
    rangeLoadZeroStart?: boolean,
    customSeekHandler?: any,
    reuseRedirectedURL?: boolean,
    referrerPolicy?: any;
    // referrerPolicy: leave as unspecified

    headers?: any,
    customLoader?: any
}

interface fetchParams {
    method: string,
    headers: headers,
    mode: RequestMode,
    cache: RequestCache,
    // The default policy of Fetch API in the whatwg standard
    // Safari incorrectly indicates 'no-referrer' as default policy, fuck it
    referrerPolicy: ReferrerPolicy,
    credentials?: RequestCredentials,
    signal?: any,
}

interface statisticsInfo {
    url?: string,
    hasRedirect?: boolean,
    redirectedURL?: string,
    speed?: number,
    loaderType?: string
    currentSegmentIndex?: number,
    totalSegmentCount?: number
}

interface MediaDataSource {
    url: string,
    cors?: boolean,
    hasAudio?: boolean,
    hasVideo?: boolean,
    isLive?: boolean,
    type?: string,
    withCredentials?: boolean,
    segments?: Array<any>,
    duration?: any,
    filesize?: any
}

interface ProbeData {
    match: boolean,
    consumed?: number,
    dataOffset?: number,
    hasAudioTrack?: boolean,
    hasVideoTrack?: boolean
}

interface ParserObject {
    data: any,
    size: number,
    objectEnd: boolean
}

interface Track {
    type: string,
    id: number,
    sequenceNumber: number,
    samples: Sample[];
    length: number,
};

interface Sample {
    unit?: any,
    length?: number,
    isKeyframe?: boolean;
    dts?: number;
    cts?: number;
    pts?: number;
    fileposition?: any
}

interface MP3ParserData {
    bitRate: number;
    samplingRate: number;
    channelCount: number;
    codec: string;
    originalCodec: string;
}

interface AvcSample {
    units: {
        type: number;
        data: Uint8Array;
    }[];
    length: number;
    isKeyframe: boolean;
    dts: number;
    cts: number;
    pts: number;
    fileposition: any
}