import Log from '../utils/logger.js';
import {BaseLoader, LoaderStatus, LoaderErrors} from './loader.js';
import {RuntimeException} from '../utils/exception.js';

// For FLV over WebSocket live stream
class WebSocketLoader extends BaseLoader {
    TAG: string;
    _ws: any;
    _requestAbort: boolean;
    _receivedLength: number;

    static isSupported() {
        try {
            return (typeof self.WebSocket !== 'undefined');
        } catch (e) {
            return false;
        }
    }

    constructor() {
        super('websocket-loader');
        this.TAG = 'WebSocketLoader';

        this._needStash = true;

        this._ws = null;
        this._requestAbort = false;
        this._receivedLength = 0;
    }

    destroy() {
        if (this._ws) {
            this.abort();
        }
        super.destroy();
    }

    open(url: string | URL) {
        try {
            let ws = this._ws = new self.WebSocket(url);
            ws.binaryType = 'arraybuffer';
            ws.onopen = this._onWebSocketOpen.bind(this);
            ws.onclose = this._onWebSocketClose.bind(this);
            ws.onmessage = this._onWebSocketMessage.bind(this);
            ws.onerror = this._onWebSocketError.bind(this);

            this._status = LoaderStatus.kConnecting;
        } catch (e: any) {
            this._status = LoaderStatus.kError;

            let info = {code: e.code, msg: e.message};

            if (this._onError) {
                this._onError(LoaderErrors.EXCEPTION, info);
            } else {
                throw new RuntimeException(info.msg);
            }
        }
    }

    abort() {
        let ws = this._ws;
        if (ws && (ws.readyState === 0 || ws.readyState === 1)) {  // CONNECTING || OPEN
            this._requestAbort = true;
            ws.close();
        }

        this._ws = null;
        this._status = LoaderStatus.kComplete;
    }

    _onWebSocketOpen() {
        this._status = LoaderStatus.kBuffering;
    }

    _onWebSocketClose() {
        if (this._requestAbort === true) {
            this._requestAbort = false;
            return;
        }

        this._status = LoaderStatus.kComplete;

        if (this._onComplete) {
            this._onComplete(0, this._receivedLength - 1);
        }
    }

    _onWebSocketMessage(e: any) {
        if (e.data instanceof ArrayBuffer) {
            this._dispatchArrayBuffer(e.data);
        } else if (e.data instanceof Blob) {
            let reader = new FileReader();
            reader.onload = (evt) => {
                this._dispatchArrayBuffer(evt.target?.result as ArrayBuffer);
            };
            reader.readAsArrayBuffer(e.data);
        } else {
            this._status = LoaderStatus.kError;
            let info = {code: -1, msg: 'Unsupported WebSocket message type: ' + e.data.constructor.name};

            if (this._onError) {
                this._onError(LoaderErrors.EXCEPTION, info);
            } else {
                throw new RuntimeException(info.msg);
            }
        }
    }

    _dispatchArrayBuffer(arraybuffer: ArrayBuffer) {
        let chunk = arraybuffer;
        let byteStart = this._receivedLength;
        this._receivedLength += chunk?.byteLength;

        if (this._onDataArrival) {
            this._onDataArrival(chunk, byteStart, this._receivedLength);
        }
    }

    _onWebSocketError(e: any) {
        this._status = LoaderStatus.kError;

        let info = {
            code: e.code,
            msg: e.message
        };

        if (this._onError) {
            this._onError(LoaderErrors.EXCEPTION, info);
        } else {
            throw new RuntimeException(info.msg);
        }
    }

}

export default WebSocketLoader;