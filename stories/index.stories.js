import "../.storybook/styles.css";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { object, boolean, text } from "@storybook/addon-knobs";

import VuePaycard from "../src/components/VuePaycard.vue";

export default {
  title: "VuePaycard",
  component: VuePaycard
};

export const Default = () => ({
  components: { VuePaycard },
  props: {
    valueFields: {
      type: Object,
      default: object("Value fields", {
        cardName: "",
        cardNumber: "",
        cardMonth: "",
        cardYear: "",
        cardCvv: ""
      })
    },
    inputFields: {
      type: Object,
      default: object("Input fields ids", {
        cardNumber: "v-card-number",
        cardName: "v-card-name",
        cardMonth: "v-card-month",
        cardYear: "v-card-year",
        cardCvv: "v-card-cvv"
      })
    },
    labels: {
      type: Object,
      default: object("Labels", {
        cardName: "Full Name",
        cardHolder: "Card Holder",
        cardMonth: "MM",
        cardYear: "YY",
        cardExpires: "Expires"
      })
    },
    isCardNumberMasked: {
      type: Boolean,
      default: boolean("Is credit card number masked", true)
    },
    randomBackgrounds: {
      type: Boolean,
      default: boolean("Random backgrounds", true)
    },
    backgroundImage: {
      type: [String, Object],
      default: text("Background image", "")
    }
  },
  template: `<VuePaycard
    :inputFields="inputFields"
    :valueFields="valueFields"
    :labels="labels"
    :isCardNumberMasked="isCardNumberMasked"
    :randomBackgrounds="randomBackgrounds"
    :backgroundImage="backgroundImage"
  />`
});

Default.story = {
  name: "to Storybook"
};
