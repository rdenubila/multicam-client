
export default class CameraService {

    private static types = [
        "video/webm",
        "video/webm;codecs=vp8",
        "video/webm;codecs=daala",
        "video/webm;codecs=h264",
        "video/mpeg",
        "video/mp4",
    ];

    static async listCamera() {

        await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })

        if (!navigator.mediaDevices?.enumerateDevices) {
            console.log("enumerateDevices() not supported.");
        } else {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices()
                return devices.filter(device => device.kind === "videoinput");
            } catch (err: any) {
                console.error(`${err.name}: ${err.message}`);
                throw err;
            }
        }
    }

    static getStream(deviceId: string) {
        return navigator.mediaDevices.getUserMedia({
            video: {
                deviceId,
                width: 1920,
                height: 1080,
                frameRate: {
                    min: 24,
                    ideal: 30,
                    max: 60,
                },
            },
            audio: true,
        })
    }

    static supportedType() {
        for (const type of this.types) {
            if (MediaRecorder.isTypeSupported(type))
                return type
        }
        return 'video/webm'
    }

}