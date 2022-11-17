<template>
  <ClientOnly>
    <a-scene background="color: #DADADA">
      <a-entity
        id="bulletTemplate"
        bullet
        geometry="primitive: sphere; radius: 0.03"
        material="color: white"
      ></a-entity>

      <a-entity
        class="target"
        target="healthPoints: 10"
        geometry="primitive: box"
        material="color: teal"
        position="-5 1 -10"
        hit-handler
      ></a-entity>

      <a-entity
        class="target"
        target="healthPoints: 10"
        geometry="primitive: sphere"
        material="color: orange"
        scale="0.5 0.5 0.5"
        position="-10 1 -4"
        hit-handler
      ></a-entity>

      <a-entity
        class="target"
        target="healthPoints: 10"
        geometry="primitive: sphere"
        material="color: orange"
        scale="0.5 0.5 0.5"
        position="3 1.5 -10"
        hit-handler
      ></a-entity>

      <a-entity
        class="target"
        target="healthPoints: 10"
        geometry="primitive: box"
        material="color: teal"
        position="0 3 -20"
        hit-handler
      ></a-entity>

      <a-entity
        class="target"
        target="healthPoints: 10"
        geometry="primitive: box"
        material="color: teal"
        position="5 0.5 -6"
        hit-handler
      ></a-entity>

      <!-- <a-entity
        class="clickable"
        rotation="0 0"
        scale="0.05 0.05 0.05"
        position="0 0 0"
        gltf-model="totoro.glb"
      ></a-entity> -->

      <!-- <a-entity
      id="gun"
      vive-controls="hand: right;"
      oculus-touch-controls="hand: right; model: false;"
      daydream-controls="hand: right; model: false"
      shooter="bulletTypes: normal; activeBulletType: normal"
    > -->
      <!-- </a-entity> -->

      <a-entity ref="rig" position="0 0 0">
        <a-camera id="camera">
          <a-entity
            ref="gun"
            shooter
            geometry="primitive: box; width: 0.1; height: 0.1; depth: 0.3"
            material="color: black"
            click-to-shoot
            position="0.1 -0.2 -0.2"
          ></a-entity>
        </a-camera>
      </a-entity>

      <a-entity
        environment="skyType: gradient; skyColor: white; horizonColor: #7ae0e0; groundTexture: squares; groundColor: green; groundColor2: green; dressing: torii; dressingAmount: 0; dressingColor: #7c5c45; dressingScale:1;"
      ></a-entity>
    </a-scene>
  </ClientOnly>
</template>

<script>
import * as AFRAME from "../node_modules/aframe";
import "aframe-super-shooter-kit";
import TweenMax from "/node_modules/gsap";
import "/aframe-environment-component.min.js";

export default {
  props: {
    socket: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      rig: null,
      gun: null,
      x: null,
      y: null,
      z: null,
      xposition: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.gun = this.$refs.gun;
      this.rig = this.$refs.rig;
    });

    let tween = { x: 0, y: 0, z: 0 };

    this.socket.on("mobileCoordinates", (data) => {
      this.x = data.coordinate.x;
      this.y = data.coordinate.y;
      this.z = data.coordinate.z;

      // Tween this values
      TweenMax.to(tween, 1, {
        x: data.coordinate.x,
        y: data.coordinate.y,
        z: data.coordinate.z,
      });

      //   console.log(this.x, this.y, this.z, tween, tween.x, tween.y);
      this.gun.setAttribute(
        "rotation",
        `${tween.y / 6} ${tween.x / 6} ${tween.z}`
      );
      this.rig.setAttribute("rotation", `${tween.y} ${tween.x} 0`);
      //   this.gun.setAttribute("position", `${tween.x} ${tween.y} -1`);
    });

    this.socket.on("fire", () => {
      this.gun.emit("shoot");
    });

    // this.socket.on("mobileAcceleration", (acceleration) => {
    //   this.xposition = parseFloat(this.xposition) + parseFloat(acceleration.x);
    //   console.log(this.xposition);
    //   this.gun.object3D.position.set(this.xposition, 0, -1);
    // });

    /**
     * Change color when hit.
     */
    AFRAME.registerComponent("hit-handler", {
      dependencies: ["material"],

      init: function () {
        var color;
        var el = this.el;

        color = new THREE.Color();
        color.set("#666");
        el.components.material.material.color.copy(color);
        el.addEventListener("hit", () => {
          color.addScalar(0.05);
          el.components.material.material.color.copy(color);
        });

        el.addEventListener("die", () => {
          color.setRGB(1, 0, 0);
          el.components.material.material.color.copy(color);
        });
      },
    });
  },
  created() {},
};
</script>

<style>
.fullscreen {
  height: 100vh;
  position: relative;
}

/* #video {
  z-index: 999;
  pointer-events: none;
  position: absolute;
  bottom: 0;
  right: 0;
} */

#handsfree-canvas-weboji-1 {
  z-index: 999;
  pointer-events: none;
  position: fixed;
  bottom: 0 !important;
  margin-top: auto !important;
  right: 0 !important;
  height: 240px !important;
  width: 320px !important;
  margin-left: auto !important;
  display: flex !important;
  transform: scale(-1, 1) !important;
}

#handsfree-canvas-video-1 {
  z-index: 999;
  pointer-events: none;
  position: absolute;
  bottom: 0 !important;
  right: 0 !important;
  height: 240px !important;
  width: 320px !important;
}

#handsfree-canvas-video-1 {
  display: none;
}
</style>
