<template>
  <div class="card-item" :class="{ '-active': isCardFlipped }">
    <div class="card-item__side -front">
      <div
        class="card-item__focus"
        :class="{ '-active': focusElementStyle }"
        :style="focusElementStyle"
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
                :src="'../assets/images/' + cardType + '.png'"
                v-if="cardType"
                :key="cardType"
                alt
                class="card-item__typeImg"
              />
            </transition>
          </div>
        </div>
        <label
          :for="fields.cardNumber"
          class="card-item__number"
          :ref="fields.cardNumber"
        >
          <template>
            <span v-for="(number, key) in currentPlaceholder" :key="key">
              <transition name="slide-fade-up">
                <div
                  class="card-item__numberItem"
                  v-if="getIsNumberMasked(key, number)"
                >
                  *
                </div>
                <div
                  class="card-item__numberItem"
                  :class="{ '-active': number.trim() === '' }"
                  :key="currentPlaceholder"
                  v-else-if="labels.cardNumber.length > key"
                >
                  {{ labels.cardNumber[key] }}
                </div>
                <div
                  class="card-item__numberItem"
                  :class="{ '-active': number.trim() === '' }"
                  v-else
                  :key="currentPlaceholder + 1"
                >
                  {{ number }}
                </div>
              </transition>
            </span>
          </template>
        </label>
        <div class="card-item__content">
          <label
            :for="fields.cardName"
            class="card-item__info"
            :ref="fields.cardName"
          >
            <div class="card-item__holder">{{ "Titular do cartão" }}</div>
            <transition name="slide-fade-up">
              <div
                class="card-item__name"
                v-if="labels.cardName.length"
                key="1"
              >
                <transition-group name="slide-fade-right">
                  <span
                    class="card-item__nameItem"
                    v-for="(n, key) in labels.cardName.replace(/\s\s+/g, ' ')"
                    :key="key + 1"
                    >{{ n }}</span
                  >
                </transition-group>
              </div>
              <div class="card-item__name" v-else key="2">
                {{ "Nome Completo" }}
              </div>
            </transition>
          </label>
          <div class="card-item__date" ref="cardDate">
            <label :for="fields.cardMonth" class="card-item__dateTitle">{{
              "Expira"
            }}</label>
            <label :for="fields.cardMonth" class="card-item__dateItem">
              <transition name="slide-fade-up">
                <span v-if="labels.cardMonth" :key="labels.cardMonth">{{
                  labels.cardMonth
                }}</span>
                <span v-else key="2">{{ "MM" }}</span>
              </transition>
            </label>
            /
            <label for="cardYear" class="card-item__dateItem">
              <transition name="slide-fade-up">
                <span v-if="labels.cardYear" :key="labels.cardYear">{{
                  String(labels.cardYear).slice(2, 4)
                }}</span>
                <span v-else key="2">{{ "YY" }}</span>
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
          <!-- <span v-for="(n, key) in labels.cardCvv" :key="key">*</span> -->
          <span>{{ labels.cardCvv }}</span>
        </div>
        <div class="card-item__type">
          <img
            :src="'../assets/images/' + cardType + '.png'"
            v-if="cardType"
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
    labels: {
      type: Object,
      required: true
    },
    fields: {
      type: Object,
      required: true
    },
    isCardNumberMasked: {
      type: Boolean,
      default: true
    },
    randomBackgrounds: {
      type: Boolean,
      default: true
    },
    backgroundImage: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    focusElementStyle: null,
    currentFocus: null,
    isFocused: false,
    isCardFlipped: false,
    amexCardPlaceholder: "#### ###### #####",
    dinersCardPlaceholder: "#### ###### ####",
    defaultCardPlaceholder: "#### #### #### ####",
    currentPlaceholder: ""
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
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.destroy();
  },
  computed: {
    cardType() {
      const number = this.labels.cardNumber;
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
      if (this.randomBackgrounds && !this.backgroundImage) {
        const random = Math.floor(Math.random() * 25 + 1);
        return `../assets/images/${random}.jpeg`;
      }

      if (this.backgroundImage) {
        return this.backgroundImage;
      }

      return null;
    }
  },
  methods: {
    addOrRemoveFieldListeners(event = "addEventListener") {
      const fields = document.querySelectorAll("[data-card-field]");
      fields.forEach(element => {
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
        element.id === this.fields.cardYear ||
        element.id === this.fields.cardMonth
      ) {
        this.currentFocus = "cardDate";
      } else {
        this.currentFocus = element.id;
      }
      this.isCardFlipped = element.id === this.fields.cardCvv;
    },
    setBlur(evt) {
      this.isCardFlipped = !element.id === this.fields.cardCvv;
      setTimeout(() => {
        if (!this.isFocused) {
          this.currentFocus = null;
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
            transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`
          }
        : null;
    },
    getIsNumberMasked(index, n) {
      return (
        index > 4 &&
        index < 14 &&
        this.labels.cardNumber.length > index &&
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
    }
  }
};
</script>

<style src="../assets/style.css" scoped></style>
