<template>
  <div v-if="scanningStep" id="qr-code-full-region"></div>
  <div v-else>
    <!-- <div class="phoneisconnected">Move your phone :)</div> -->
    <button class="firebtn" @click="fire()">FIRE</button>
  </div>
</template>
<script>
import { Html5QrcodeScanner } from "html5-qrcode";
import { io } from "socket.io-client";

export default {
  props: {
    isGun: {
      type: Boolean,
      default: null,
    },
  },
  data() {
    return {
      socket: null,
      room: null,
      html5QrcodeScanner: null,
      scanningStep: true,
      x: 0,
      y: 0,
      z: 0,
      acceleration: { x: null },
    };
  },
  mounted() {
    this.socket = io("https://gentle-depths-65980.herokuapp.com:6051");

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
      navigator.vibrate(100);
    });

    this.initCamera();
  },
  methods: {
    fire() {
      navigator.vibrate(50);
      this.socket.emit("fire", {
        room: this.room,
      });
    },
    onScanSuccess(decodedText) {
      this.room = decodedText;
      this.socket.emit("join", { room: this.room, isGun: this.isGun });
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
    // limit number of event fired to not kill our server
    throttle(callback, limit) {
      var wait = false;
      return function () {
        if (!wait) {
          callback.apply(null, arguments);
          wait = true;
          setTimeout(function () {
            wait = false;
          }, limit);
        }
      };
    },
    init() {
      if (window.DeviceOrientationEvent) {
        window.addEventListener(
          "deviceorientation",
          this.throttle((event) => {
            this.x = event.alpha.toFixed(0); // alpha: rotation around z-axis
            this.z = -event.gamma.toFixed(0); // gamma: left to right
            this.y = event.beta.toFixed(0); // beta: front back motion

            this.sendDeviceOrientationViaSocket();
          }, 30),
          true
        );

        // window.addEventListener(
        //   "devicemotion",
        //   (event) => {
        //     this.acceleration.x = event.accelerationIncludingGravity.x;
        //     this.sendDeviceAccelerationViaSocket();
        //   },
        //   true
        // );
      }
    },
    sendDeviceOrientationViaSocket() {
      this.socket.emit("mobileCoordinates", {
        room: this.room,
        coordinate: { x: this.x, y: this.y, z: this.z },
      });
    },
    // sendDeviceAccelerationViaSocket() {
    //   this.socket.emit("mobileAcceleration", {
    //     room: this.room,
    //     acceleration: { x: this.acceleration.x },
    //   });
    // },
  },
};
</script>
<style>
.phoneisconnected {
  /* background: red;
  height: 100vh;
  width: 100vw; */
}

.firebtn {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background-color: red; /* Green */
  border: none;
  color: white;
  border-radius: 100%;
  height: 200px;
  width: 200px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
.firebtn:active {
  background-color: yellow;
}
</style>
