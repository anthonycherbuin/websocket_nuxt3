<template>
  <template v-if="scanningStep">
    <h1>room: {{ room }}</h1>
    <div id="uniqueqrcode" class="qrcode"></div>
  </template>
  <div v-else>
    <div class="ball" ref="ball"></div>
    <!-- <h1>connected</h1>
    <td>X: {{ this.x }}</td>
    <td>Y: {{ this.y }}</td>
    <td>Z: {{ this.z }}</td> -->
  </div>
</template>
<script>
import { io } from "socket.io-client";
import qrcode from "/node_modules/qrcode-generator/qrcode.js";

export default {
  data() {
    return {
      socket: null,
      room: null,
      scanningStep: true,
      x: 0,
      y: 0,
      z: 0,
    };
  },
  mounted() {
    this.socket = io("localhost:4000");

    // Connect to socker io server
    this.socket.on("connect", () => {
      console.log(this.socket.id);
    });

    // this.socket.on("disconnect", () => {
    //   console.log("disconnect: ", this.room);
    //   this.socket.emit("disconnect", { room: this.room });
    // });

    // this.socket.on("disconnectRoom", () => {
    //   this.scanningStep = true;
    // });

    this.socket.on("phoneConnected", () => {
      this.scanningStep = false;
    });

    this.socket.on("mobileCoordinates", (data) => {
      this.x = data.coordinate.x;
      this.y = data.coordinate.y;
      this.z = data.coordinate.z;
      console.log("caca", this.$refs["ball"]);
      this.$refs[
        "ball"
      ].style.transform = `translate3d(${this.x}px,${this.y}px,0)`;
    });

    // Join random room
    this.joinRoom();

    // QR CODE
    var typeNumber = 10;
    var errorCorrectionLevel = "L";
    var qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(this.room.toString());
    qr.make();
    document.getElementById("uniqueqrcode").innerHTML = qr.createImgTag();
  },
  methods: {
    joinRoom() {
      this.room = Math.floor(Date.now() * Math.random()) + "js";
      this.socket.emit("join", { room: this.room, isMobile: false });
    },
  },
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
.ball {
  transition: all 0.1s;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: red;
  width: 100px;
  height: 100px;
}
</style>
