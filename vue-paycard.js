import VuePaycard from "./src/components/VuePaycard.vue";

const VuePaycardPlugin = {
  install(Vue) {
    Vue.component(name, VuePaycard);
  }
};

// Export as a plugin
export default VuePaycardPlugin;

// Export as individual components
export { VuePaycard };
