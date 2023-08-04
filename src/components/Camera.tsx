import { useEffect, useRef, useState } from "react"
import CameraService from "../services/camera.service";
import { Card, Select } from "antd";
import ServerService, { SendAction } from "../services/server.service";

const server = new ServerService();
let mediaRecorder: MediaRecorder

function Camera() {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [currentDevice, setCurrentDevice] = useState<string>();

    const videoLive = useRef<HTMLVideoElement>(null);

    const startRecord = () => {
        mediaRecorder?.start()
    }

    const stopRecord = () => {
        mediaRecorder?.stop()
    }


    const initLiveCam = async () => {
        if (videoLive.current && currentDevice) {
            const stream = await CameraService.getStream(currentDevice);

            server.deviceId = currentDevice;
            server.connectToServer(stream);
            videoLive.current.srcObject = stream

            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
            mediaRecorder.addEventListener('dataavailable', async event => {
                server.sendBlob(event.data)
            })
        }
    }

    const loadDevices = async () => {
        const deviceList = await CameraService.listCamera();
        if (deviceList) setDevices(deviceList)
    }

    const handleMessages = (message: SendAction) => {
        console.log(message);
        switch (message.action) {
            case "start-record":
                startRecord();
                break;
            case "stop-record":
                stopRecord();
                break;
        }
    }

    useEffect(() => {
        if (currentDevice)
            initLiveCam()
    }, [currentDevice])

    useEffect(() => {
        loadDevices();
        server.attach(handleMessages)
        return () => {
            server.detach(handleMessages)
        }
    }, [])

    const camSelect = () => {
        return <Select
            className="w-60"
            value={currentDevice}
            options={devices.map(device => ({
                value: device.deviceId,
                label: `${device.label} (${device.deviceId})`,
            }))}
            onChange={(deviceId) => setCurrentDevice(deviceId)}
        />
    }

    return (
        <>
            <Card
                size="small"
                extra={
                    camSelect()
                }
            >
                <div className="bg-black w-full h-device">
                    {
                        currentDevice
                            ? <video
                                ref={videoLive}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full"
                            />
                            : <div className="w-full h-full text-white flex justify-center items-center flex-col">
                                <h3>Select camera</h3>
                                {camSelect()}
                            </div>
                    }

                </div>
            </Card>
        </>
    )
}

export default Camera
