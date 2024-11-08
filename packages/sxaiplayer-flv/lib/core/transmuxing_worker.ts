import Log from '../utils/logger.js';
import LoggingControl from '../utils/logging_control.js';
import Polyfill from '../utils/polyfill.js';
import TransmuxingController from './transmuxing_controller.ts';
import TransmuxingEvents from './transmuxing_events.ts';

/* post message to worker:
   data: {
       cmd: string
       param: any
   }

   receive message from worker:
   data: {
       msg: string,
       data: any
   }
 */

const TransmuxingWorker = (self: any) => {

    let TAG = 'TransmuxingWorker';
    let controller: TransmuxingController | null = null;
    let logcatListener = onLogcatCallback.bind(this);

    Polyfill.install();

    self.addEventListener('message',  (e: { data: { cmd: any; param: any[]; }; }) => {
        switch (e.data.cmd) {
            case 'init':
                controller = new TransmuxingController(e.data.param[0], e.data.param[1]);
                controller.on(TransmuxingEvents.IO_ERROR, onIOError.bind(this));
                controller.on(TransmuxingEvents.DEMUX_ERROR, onDemuxError.bind(this));
                controller.on(TransmuxingEvents.INIT_SEGMENT, onInitSegment.bind(this));
                controller.on(TransmuxingEvents.MEDIA_SEGMENT, onMediaSegment.bind(this));
                controller.on(TransmuxingEvents.LOADING_COMPLETE, onLoadingComplete.bind(this));
                controller.on(TransmuxingEvents.RECOVERED_EARLY_EOF, onRecoveredEarlyEof.bind(this));
                controller.on(TransmuxingEvents.MEDIA_INFO, onMediaInfo.bind(this));
                controller.on(TransmuxingEvents.METADATA_ARRIVED, onMetaDataArrived.bind(this));
                controller.on(TransmuxingEvents.SCRIPTDATA_ARRIVED, onScriptDataArrived.bind(this));
                controller.on(TransmuxingEvents.STATISTICS_INFO, onStatisticsInfo.bind(this));
                controller.on(TransmuxingEvents.RECOMMEND_SEEKPOINT, onRecommendSeekpoint.bind(this));
                break;
            case 'destroy':
                if (controller) {
                    controller.destroy();
                    controller = null;
                }
                self.postMessage({msg: 'destroyed'});
                break;
            case 'start':
                controller.start();
                break;
            case 'stop':
                controller.stop();
                break;
            case 'seek':
                controller.seek(e.data.param);
                break;
            case 'pause':
                controller.pause();
                break;
            case 'resume':
                controller.resume();
                break;
            case 'logging_config': {
                let config = e.data.param;
                LoggingControl.applyConfig(config);

                if (config.enableCallback === true) {
                    LoggingControl.addLogListener(logcatListener);
                } else {
                    LoggingControl.removeLogListener(logcatListener);
                }
                break;
            }
        }
    });

    function onInitSegment(type: any, initSegment: { data: any; }) {
        let obj = {
            msg: TransmuxingEvents.INIT_SEGMENT,
            data: {
                type: type,
                data: initSegment
            }
        };
        self.postMessage(obj, [initSegment.data]);  // data: ArrayBuffer
    }

    function onMediaSegment(type: any, mediaSegment: { data: any; }) {
        let obj = {
            msg: TransmuxingEvents.MEDIA_SEGMENT,
            data: {
                type: type,
                data: mediaSegment
            }
        };
        self.postMessage(obj, [mediaSegment.data]);  // data: ArrayBuffer
    }

    function onLoadingComplete() {
        let obj = {
            msg: TransmuxingEvents.LOADING_COMPLETE
        };
        self.postMessage(obj);
    }

    function onRecoveredEarlyEof() {
        let obj = {
            msg: TransmuxingEvents.RECOVERED_EARLY_EOF
        };
        self.postMessage(obj);
    }

    function onMediaInfo(mediaInfo: any) {
        let obj = {
            msg: TransmuxingEvents.MEDIA_INFO,
            data: mediaInfo
        };
        self.postMessage(obj);
    }

    function onMetaDataArrived(metadata: any) {
        let obj = {
            msg: TransmuxingEvents.METADATA_ARRIVED,
            data: metadata
        };
        self.postMessage(obj);
    }

    function onScriptDataArrived(data: any) {
        let obj = {
            msg: TransmuxingEvents.SCRIPTDATA_ARRIVED,
            data: data
        };
        self.postMessage(obj);
    }

    function onStatisticsInfo(statInfo: any) {
        let obj = {
            msg: TransmuxingEvents.STATISTICS_INFO,
            data: statInfo
        };
        self.postMessage(obj);
    }

    function onIOError(type: any, info: any) {
        self.postMessage({
            msg: TransmuxingEvents.IO_ERROR,
            data: {
                type: type,
                info: info
            }
        });
    }

    function onDemuxError(type: any, info: any) {
        self.postMessage({
            msg: TransmuxingEvents.DEMUX_ERROR,
            data: {
                type: type,
                info: info
            }
        });
    }

    function onRecommendSeekpoint(milliseconds: any) {
        self.postMessage({
            msg: TransmuxingEvents.RECOMMEND_SEEKPOINT,
            data: milliseconds
        });
    }

    function onLogcatCallback(type: any, str: any) {
        self.postMessage({
            msg: 'logcat_callback',
            data: {
                type: type,
                logcat: str
            }
        });
    }

};

export default TransmuxingWorker;