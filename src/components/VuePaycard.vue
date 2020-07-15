<template>
  <div
    class="card-item"
    :class="{ '-active': isCardFlipped }"
    v-if="labels && inputFields"
  >
    <div class="card-item__side -front">
      <div
        :class="{ '-active': focusElementStyle }"
        :style="focusElementStyle"
        class="card-item__focus"
        ref="focusElement"
      ></div>
      <div class="card-item__cover">
        <img
          v-if="currentCardBackground"
          :src="currentCardBackground"
          class="card-item__bg"
        />
      </div>
      <div class="card-item__wrapper">
        <div class="card-item__top">
          <img src="../assets/images/chip.png" class="card-item__chip" />
          <div class="card-item__type">
            <transition name="slide-fade-up">
              <img
                v-if="cardType"
                :src="getCreditCardImage"
                :key="cardType"
                alt
                class="card-item__typeImg"
              />
            </transition>
          </div>
        </div>
        <label
          :for="inputFields.cardNumber"
          :ref="inputFields.cardNumber"
          class="card-item__number"
        >
          <template>
            <span v-for="(n, $index) in currentPlaceholder" :key="$index">
              <transition name="slide-fade-up">
                <div
                  v-if="getIsNumberMasked($index, n)"
                  class="card-item__numberItem"
                >
                  *
                </div>
                <div
                  v-else-if="valueFields.cardNumber.length > $index"
                  :class="{ '-active': n.trim() === '' }"
                  :key="currentPlaceholder"
                  class="card-item__numberItem"
                >
                  {{ valueFields.cardNumber[$index] }}
                </div>
                <div
                  v-else
                  :class="{ '-active': n.trim() === '' }"
                  :key="currentPlaceholder + 1"
                  class="card-item__numberItem"
                >
                  {{ n }}
                </div>
              </transition>
            </span>
          </template>
        </label>
        <div class="card-item__content">
          <label
            :for="inputFields.cardName"
            :ref="inputFields.cardName"
            class="card-item__info"
          >
            <div class="card-item__holder">
              {{ labels.cardHolder || "Card Holder" }}
            </div>
            <transition name="slide-fade-up">
              <div
                v-if="valueFields.cardName.length"
                class="card-item__name"
                key="1"
              >
                <transition-group name="slide-fade-right">
                  <span
                    v-for="(n, key) in valueFields.cardName.replace(
                      /\s\s+/g,
                      ' '
                    )"
                    :key="key + 1"
                    class="card-item__nameItem"
                    >{{ n }}</span
                  >
                </transition-group>
              </div>
              <div class="card-item__name" v-else key="2">
                {{ labels.cardName || "Full Name" }}
              </div>
            </transition>
          </label>
          <div class="card-item__date" ref="cardDate">
            <label :for="inputFields.cardMonth" class="card-item__dateTitle">{{
              labels.cardExpires || "Expires"
            }}</label>
            <label :for="inputFields.cardMonth" class="card-item__dateItem">
              <transition name="slide-fade-up">
                <span
                  v-if="valueFields.cardMonth"
                  :key="valueFields.cardMonth"
                  >{{ valueFields.cardMonth }}</span
                >
                <span v-else key="2">{{ labels.cardMonth || "MM" }}</span>
              </transition>
            </label>
            /
            <label for="cardYear" class="card-item__dateItem">
              <transition name="slide-fade-up">
                <span v-if="valueFields.cardYear" :key="valueFields.cardYear">{{
                  String(valueFields.cardYear).slice(2, 4)
                }}</span>
                <span v-else key="2">{{ labels.cardYear || "YY" }}</span>
              </transition>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="card-item__side -back">
      <div class="card-item__cover">
        <img
          v-if="currentCardBackground"
          :src="currentCardBackground"
          class="card-item__bg"
        />
      </div>
      <div class="card-item__band"></div>
      <div class="card-item__cvv">
        <div class="card-item__cvvTitle">CVV</div>
        <div class="card-item__cvvBand">
          <!-- <span v-for="(n, key) in valueFields.cardCvv" :key="key">*</span> -->
          <span>{{ valueFields.cardCvv }}</span>
        </div>
        <div class="card-item__type">
          <img
            v-if="cardType"
            :src="getCreditCardImage"
            class="card-item__typeImg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VuePaycard",
  props: {
    valueFields: {
      type: Object,
      required: true,
    },
    inputFields: {
      type: Object,
      required: true,
    },
    labels: {
      type: Object,
      required: true,
    },
    isCardNumberMasked: {
      type: Boolean,
      default: true,
    },
    randomBackgrounds: {
      type: Boolean,
      default: true,
    },
    backgroundImage: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    focusElementStyle: null,
    currentFocus: null,
    isFocused: false,
    isCardFlipped: false,
    amexCardPlaceholder: "#### ###### #####",
    dinersCardPlaceholder: "#### ###### ####",
    defaultCardPlaceholder: "#### #### #### ####",
    currentPlaceholder: "#### #### #### ####",
  }),
  watch: {
    currentFocus() {
      if (this.currentFocus) {
        this.changeFocus();
      } else {
        this.focusElementStyle = null;
      }
    },
    cardType() {
      this.changePlaceholder();
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.destroy();
  },
  computed: {
    getCreditCardImage() {
      return require(`../assets/images/${this.cardType}.png`);
    },
    cardType() {
      const number = this.valueFields.cardNumber;
      let re = new RegExp("^4");

      if (number.match(re)) return "visa";

      re = new RegExp("^(34|37)");
      if (number.match(re)) return "amex";

      re = new RegExp("^5[1-5]");
      if (number.match(re)) return "mastercard";

      re = new RegExp("^6011");
      if (number.match(re)) return "discover";

      re = new RegExp("^62");
      if (number.match(re)) return "unionpay";

      re = new RegExp("^9792");
      if (number.match(re)) return "troy";

      re = new RegExp("^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}");
      if (number.match(re)) return "dinersclub";

      re = new RegExp("^35(2[89]|[3-8])");
      if (number.match(re)) return "jcb";

      return "";
    },
    currentCardBackground() {
      if (this.backgroundImage) {
        return this.backgroundImage;
      }

      if (this.randomBackgrounds) {
        const random = Math.floor(Math.random() * 25 + 1);

        return require(`../assets/images/${random}.jpg`);
      }

      return null;
    },
  },
  methods: {
    addOrRemoveFieldListeners(event = "addEventListener") {
      const inputFields = document.querySelectorAll("[data-card-field]");
      inputFields.forEach((element) => {
        element[event]("focus", this.setFocus);
        element[event]("blur", this.setBlur);
      });
    },
    destroy() {
      this.addOrRemoveFieldListeners("removeEventListener");
    },
    init() {
      this.addOrRemoveFieldListeners();
    },
    setFocus() {
      this.isFocused = true;
      if (
        element.id === this.inputFields.cardYear ||
        element.id === this.inputFields.cardMonth
      ) {
        this.currentFocus = "cardDate";
      } else {
        this.currentFocus = element.id;
      }
      this.isCardFlipped = element.id === this.inputFields.cardCvv;
    },
    setBlur(evt) {
      this.isCardFlipped = !element.id === this.inputFields.cardCvv;
      const timeout = setTimeout(() => {
        if (!this.isFocused) {
          this.currentFocus = null;
          clearTimeout(timeout);
        }
      }, 300);
      this.isFocused = false;
    },
    changeFocus() {
      const target = this.$refs[this.currentFocus];
      this.focusElementStyle = target
        ? {
            width: `${target.offsetWidth}px`,
            height: `${target.offsetHeight}px`,
            transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`,
          }
        : null;
    },
    getIsNumberMasked(index, n) {
      return (
        index > 4 &&
        index < 14 &&
        this.valueFields.cardNumber.length > index &&
        n.trim() !== "" &&
        this.isCardNumberMasked
      );
    },
    changePlaceholder() {
      if (this.cardType === "amex") {
        this.currentPlaceholder = this.amexCardPlaceholder;
      } else if (this.cardType === "dinersclub") {
        this.currentPlaceholder = this.dinersCardPlaceholder;
      } else {
        this.currentPlaceholder = this.defaultCardPlaceholder;
      }
      this.$nextTick(() => {
        this.changeFocus();
      });
    },
  },
};
</script>

<style src="../assets/css/style.min.css" scoped></style>
