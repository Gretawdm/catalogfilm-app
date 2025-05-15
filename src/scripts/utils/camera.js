export default class SimpleCamera {
  constructor(videoElement, canvasElement) {
    this.video = videoElement;
    this.canvas = canvasElement;
    this.stream = null;
    this.devices = [];
    this.deviceId = null;
  }

  async init() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.devices = devices.filter((d) => d.kind === 'videoinput');
    return this.devices;
  }

  async start(deviceId = null) {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
    }

    const constraints = {
      video: deviceId ? { deviceId: { exact: deviceId } } : true,
    };

    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.video.srcObject = this.stream;
    this.video.style.display = 'block';
    this.deviceId = deviceId;
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
    }
    this.video.style.display = 'none';
  }

  capture() {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    const context = this.canvas.getContext('2d');
    context.drawImage(this.video, 0, 0);
    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  }
}
