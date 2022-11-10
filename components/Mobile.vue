<template>
  <div v-if="scanningStep" id="qr-code-full-region"></div>
  <div v-else>
    <div class="phoneisconnected">Move your phone :)</div>
  </div>
</template>
<script>
import { Html5QrcodeScanner } from "html5-qrcode";
import { io } from "socket.io-client";

export default {
  data() {
    return {
      socket: null,
      room: null,
      html5QrcodeScanner: null,
      scanningStep: true,
      x: 0,
      y: 0,
      z: 0,
    };
  },
  mounted() {
    this.socket = io("https://192.168.1.8:4000");
    // Connect to socker io server
    this.socket.on("connect", () => {
      console.log(this.socket.id);
    });

    // this.socket.on("disconnect", () => {
    //   this.socket.emit("disconnect", { room: this.room });
    // });

    // this.socket.on("disconnectRoom", () => {
    //   this.scanningStep = true;
    //   this.initCamera();
    // });

    this.socket.on("phoneConnected", () => {
      this.html5QrcodeScanner.clear();
      this.scanningStep = false;
    });

    this.initCamera();
  },
  methods: {
    onScanSuccess(decodedText) {
      this.room = decodedText;
      this.socket.emit("join", { room: this.room, isMobile: true });
      this.init();
    },
    initCamera() {
      var config = { fps: this.fps ? this.fps : 10 };
      if (this.qrbox) {
        config["qrbox"] = this.qrbox;
      }

      this.html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-code-full-region",
        config
      );

      this.html5QrcodeScanner.render(this.onScanSuccess);
    },
    init() {
      if (window.DeviceOrientationEvent) {
        window.addEventListener(
          "deviceorientation",
          (event) => {
            this.z = event.alpha.toFixed(0) * 3; // alpha: rotation around z-axis
            this.x = event.gamma.toFixed(0) * 6; // gamma: left to right
            this.y = event.beta.toFixed(0) * 4; // beta: front back motion
            this.sendDeviceOrientationViaSocket();
          },
          true
        );
      }
    },
    sendDeviceOrientationViaSocket() {
      this.socket.emit("mobileCoordinates", {
        room: this.room,
        coordinate: { x: this.x, y: this.y, z: this.z },
      });
    },
  },
};
</script>
<style>
.phoneisconnected {
  /* background: red;
  height: 100vh;
  width: 100vw; */
}
</style>
