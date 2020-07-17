import VuePaycard from './src/components/VuePaycard'

const VuePaycardPlugin = {
  install (Vue) {
    Vue.component('VuePaycard', VuePaycard)
  }
}

// Export as a plugin
export default VuePaycardPlugin

// Export as individual components
export { VuePaycard }
