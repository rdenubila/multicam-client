import Peer, { CallOption, DataConnection, MediaConnection, PeerConnectOption } from "peerjs";

export type SendAction = {
    action: "start-record" | "stop-record"
}

export type Observer = (message: SendAction) => void;

export default class ServerService {

    private _peer: Peer;
    private _server!: string | null;
    private _conn?: DataConnection;
    private _call?: MediaConnection;
    private _deviceId?: string;
    private _observers: Array<Observer> = []

    constructor() {
        this._peer = new Peer();
    }

    public attach(observer: Observer): void {
        const isExist = this._observers.includes(observer);
        if (isExist) {
            return console.log('Subject: Observer has been attached already.');
        }

        console.log('Subject: Attached an observer.');
        this._observers.push(observer);
    }

    public detach(observer: Observer): void {
        const observerIndex = this._observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('Subject: Nonexistent observer.');
        }

        this._observers.splice(observerIndex, 1);
        console.log('Subject: Detached an observer.');
    }


    private notify(message: SendAction) {
        for (const obs of this._observers) {
            obs(message)
        }
    }

    set deviceId(value: string) {
        this._deviceId = value;
    }

    openConnection(id?: string) {
        console.info('My peer ID is: ' + id);
    }

    getMetadata(): PeerConnectOption | CallOption {
        return {
            metadata: { deviceId: this._deviceId }
        }
    }

    connectToServer(stream?: MediaStream) {
        this._server = window.prompt("Enter the server id:");
        if (this._server) {
            this._conn = this._peer.connect(this._server, this.getMetadata())
            this._conn.on("data", (data) => this.handleData(data as SendAction))

            if (stream)
                this._call = this._peer.call(this._server, stream, this.getMetadata());
        }
    }

    private sendMessageToServer(message: any) {
        this._conn?.send(message);
    }

    sendBlob(blob: Blob) {
        this.sendMessageToServer({
            type: "blob",
            message: {
                deviceId: this._deviceId,
                blob
            }
        })
    }

    private handleData(data: SendAction) {
        this.notify(data)
    }


}