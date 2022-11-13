// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    vite: false,
    builder: 'webpack',
    ssr: false,
    modules: [
        // Using package name (recommended usage)
        // 'aframe-super-shooter-kit',
        // Load a local module
        // './aframe-environment-component.min.js',
      ]
})
