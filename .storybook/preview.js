import { addDecorator } from '@storybook/vue'
import { withA11y } from '@storybook/addon-a11y'
import { addParameters } from '@storybook/vue'

addParameters({
  docs: {
    inlineStories: true,
  },
})
addDecorator(withA11y)
