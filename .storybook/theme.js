import { create } from '@storybook/theming/create'

export default create({
  base: 'light',

  colorPrimary: '#41b883',
  colorSecondary: '#35495e',

  // UI
  appBg: '#F7FAFC',
  appContentBg: '#EDF2F7',
  appBorderColor: '#CBD5E0',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#1A202C',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: 'silver',
  barSelectedColor: '#FFFFFF',
  barBg: '#35495e',

  // Form colors
  inputBg: 'white',
  inputBorder: 'silver',
  inputTextColor: '#1A202C',
  inputBorderRadius: 4,

  brandTitle: 'Vue Paycard',
  brandUrl: 'https://github.com/guastallaigor/vue-paycard',
  brandImage: 'https://ik.imagekit.io/6xhf1gnexgdgk/vue-paycard_dcDoi3dl0.png'
})
