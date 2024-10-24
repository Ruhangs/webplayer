import Transmuxer from "../../core/transmuxer";
import TransmuxingEvents from "../../core/transmuxing_events";
import { IllegalStateException } from "../../utils/exception";
import PlayerEvents from "../player_event";

/**
 * 该文件中，主要用于处理flv封装格式的视频
 * 会调用解封装的函数、解码的函数、最后渲染的函数
 */
class flvPlayerCore {
    _config: playerConfig
    _transmuxer: any;
    _mediaInfo: any;
    _type: any
    _hasPendingLoad: boolean;
    _msectl: any;
    _emitter: any;
    _statisticsInfo: any;
    _mediaElement: any;
    _requestSetTime: any;
    _mseSourceOpened: boolean;
    constructor(config: playerConfig) {
        this._config = config
        this._transmuxer = null;
        this._mediaInfo = null

        this._hasPendingLoad = false;
        this._mseSourceOpened = false;

        this._mediaElement = null;
        this._requestSetTime = null
    }

    destory(){

    }

    install(){
        
        // if (!this._mediaElement) {
        //     throw new IllegalStateException('HTMLMediaElement must be attached before load()!');
        // }
        if (this._transmuxer) {
            throw new IllegalStateException('FlvPlayer.load() has been called, please call unload() first!');
        }

        if (this._hasPendingLoad) {
            return;
        }
        // && this._mseSourceOpened === false
        // console.log(this._config.deferLoadAfterSourceOpen)
        if (this._config.deferLoadAfterSourceOpen && this._mseSourceOpened === false) {
            this._hasPendingLoad = true;
            return;
        }
        // if (this._mediaElement.readyState > 0) {
        //     this._requestSetTime = true;
        //     // IE11 may throw InvalidStateError if readyState === 0
        //     this._mediaElement.currentTime = 0;
        // }

        this._transmuxer = new Transmuxer(this._config);

        this._transmuxer.on(TransmuxingEvents.INIT_SEGMENT, (type: any, is: any) => {
            this._msectl.appendInitSegment(is);
        });
        this._transmuxer.on(TransmuxingEvents.MEDIA_SEGMENT, (type: any, ms: any) => {
            this._msectl.appendMediaSegment(ms);

            // lazyLoad check
            // if (this._config.lazyLoad && !this._config.isLive) {
            //     let currentTime = this._mediaElement.currentTime;
            //     if (ms.info.endDts >= (currentTime + this._config.lazyLoadMaxDuration) * 1000) {
            //         if (this._progressChecker == null) {
            //             Log.v(this.TAG, 'Maximum buffering duration exceeded, suspend transmuxing task');
            //             this._suspendTransmuxer();
            //         }
            //     }
            // }
        });
        // this._transmuxer.on(TransmuxingEvents.LOADING_COMPLETE, () => {
        //     this._msectl.endOfStream();
        //     this._emitter.emit(PlayerEvents.LOADING_COMPLETE);
        // });
        // this._transmuxer.on(TransmuxingEvents.RECOVERED_EARLY_EOF, () => {
        //     this._emitter.emit(PlayerEvents.RECOVERED_EARLY_EOF);
        // });
        this._transmuxer.on(TransmuxingEvents.IO_ERROR, (detail: any, info: any) => {
            console.log("TransmuxingEvents.IO_ERROR", detail, info)
            // this._emitter.emit(PlayerEvents.ERROR, ErrorTypes.NETWORK_ERROR, detail, info);
        });
        // this._transmuxer.on(TransmuxingEvents.DEMUX_ERROR, (detail, info) => {
        //     this._emitter.emit(PlayerEvents.ERROR, ErrorTypes.MEDIA_ERROR, detail, {code: -1, msg: info});
        // });
        this._transmuxer.on(TransmuxingEvents.MEDIA_INFO, (mediaInfo: any) => {
            this._mediaInfo = mediaInfo;
            console.log("TransmuxingEvents.MEDIA_INFO", mediaInfo)
            // this._emitter.emit(PlayerEvents.MEDIA_INFO, Object.assign({}, mediaInfo));
        });
        this._transmuxer.on(TransmuxingEvents.METADATA_ARRIVED, (metadata: any) => {
            // this._emitter.emit(PlayerEvents.METADATA_ARRIVED, metadata);
            console.log("TransmuxingEvents.METADATA_ARRIVED", metadata)
        });
        this._transmuxer.on(TransmuxingEvents.SCRIPTDATA_ARRIVED, (data: any) => {
            // this._emitter.emit(PlayerEvents.SCRIPTDATA_ARRIVED, data);
            console.log("TransmuxingEvents.SCRIPTDATA_ARRIVED", data)
        });
        this._transmuxer.on(TransmuxingEvents.STATISTICS_INFO, (statInfo: any) => {
            // this._statisticsInfo = this._fillStatisticsInfo(statInfo);
            // console.log("TransmuxingEvents.STATISTICS_INFO", statInfo)
            // this._emitter.emit(PlayerEvents.STATISTICS_INFO, Object.assign({}, this._statisticsInfo));
        });
        // this._transmuxer.on(TransmuxingEvents.RECOMMEND_SEEKPOINT, (milliseconds) => {
        //     if (this._mediaElement && !this._config.accurateSeek) {
        //         this._requestSetTime = true;
        //         this._mediaElement.currentTime = milliseconds / 1000;
        //     }
        // });

        this._transmuxer.open();
    }
    _fillStatisticsInfo(statInfo: any): any {
        throw new Error("Method not implemented.");
    }

    get type() {
        return this._type;
    }

    // get buffered() {
    //     return this._mediaElement.buffered;
    // }

    // get duration() {
    //     return this._mediaElement.duration;
    // }

    // get volume() {
    //     return this._mediaElement.volume;
    // }

    // set volume(value) {
    //     this._mediaElement.volume = value;
    // }

    // get muted() {
    //     return this._mediaElement.muted;
    // }

    // set muted(muted) {
    //     this._mediaElement.muted = muted;
    // }

    // get currentTime() {
    //     if (this._mediaElement) {
    //         return this._mediaElement.currentTime;
    //     }
    //     return 0;
    // }

    // set currentTime(seconds) {
    //     if (this._mediaElement) {
    //         this._internalSeek(seconds);
    //     } else {
    //         this._pendingSeekTime = seconds;
    //     }
    // }
    
    // 获得当前媒体的信息
    get mediaInfo() {
        return Object.assign({}, this._mediaInfo);
    }

}

export default flvPlayerCore

