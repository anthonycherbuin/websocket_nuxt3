<template>
  <div v-if="scanningStep" class="qrcodeview">
    <h3>{{ room }}</h3>
    <div id="uniqueqrcode" class="qrcode"></div>
  </div>
  <div v-else>
    <Game :socket="socket" />
  </div>
</template>
<script>
import { io } from "socket.io-client";
import qrcode from "/node_modules/qrcode-generator/qrcode.js";

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
      scanningStep: true,
      x: 0,
      y: 0,
      z: 0,
    };
  },
  mounted() {
    // TODO: host that server
    this.socket = io("https://gentle-depths-65980.herokuapp.com");

    console.log("init", this.socket.id);
    // Connect to socker io server
    this.socket.on("connect", () => {
      console.log("connected", this.socket.id);
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
      // console.log("caca", this.$refs["ball"]);
      // this.$refs["ball"].style.transform = `translate3d(${this.z + this.x}px,${
      //   this.y
      // }px,0)`;
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
      this.socket.emit("join", { room: this.room, isGun: this.isGun });
    },
  },
};
</script>
<style lang="postcss">
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
.qrcodeview {
  align-items: center;
  display: flex;
  flex-direction: column;
  transition: all 0.1s;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 200px;
  height: 200px;
}

.qrcode > img {
  width: 200px !important;
  height: 200px !important;
  background: red;
}
</style>
