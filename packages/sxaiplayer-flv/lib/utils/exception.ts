export class RuntimeException {
    _message: any;

    constructor(message: any) {
        this._message = message;
    }

    get name() {
        return 'RuntimeException';
    }

    get message() {
        return this._message;
    }

    toString() {
        return this.name + ': ' + this.message;
    }

}

export class IllegalStateException extends RuntimeException {

    constructor(message: any) {
        super(message);
    }

    get name() {
        return 'IllegalStateException';
    }

}

export class InvalidArgumentException extends RuntimeException {

    constructor(message: any) {
        super(message);
    }

    get name() {
        return 'InvalidArgumentException';
    }

}

export class NotImplementedException extends RuntimeException {

    constructor(message: any) {
        super(message);
    }

    get name() {
        return 'NotImplementedException';
    }

}