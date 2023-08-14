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
      <div class="card-item__cover" :aria-label="imageCover">
        <img
          v-if="currentCardBackground"
          :src="currentCardBackground"
          class="card-item__bg"
          alt="Background image"
        />
      </div>
      <div class="card-item__wrapper">
        <div class="card-item__top">
          <img
            :src="chip"
            class="card-item__chip"
            alt="Card chip image"
          />
          <div class="card-item__type">
            <transition name="slide-fade-up">
              <img
                v-if="cardType"
                :src="getCreditCardImage"
                :key="cardType"
                :alt="`${cardType} brand image`"
                class="card-item__typeImg"
              />
            </transition>
          </div>
        </div>
        <label
          :for="inputFields.cardNumber"
          :ref="inputFields.cardNumber"
          aria-label="Card number"
          class="card-item__number"
        >
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
        </label>
        <div class="card-item__content">
          <label
            :for="inputFields.cardName"
            :ref="inputFields.cardName"
            aria-label="Card name"
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
                {{ labels.cardName || "Nome Completo" }}
              </div>
            </transition>
          </label>
          <div class="card-item__date" ref="cardDate">
            <label
              :for="inputFields.cardMonth"
              class="card-item__dateTitle"
              aria-label="Expiration date"
              >{{ labels.cardExpires || "Expires" }}</label
            >
            <label
              :for="inputFields.cardMonth"
              class="card-item__dateItem"
              aria-label="Card month"
            >
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
            <label
              :for="inputFields.cardYear"
              class="card-item__dateItem"
              aria-label="Card year"
            >
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
      <div class="card-item__cover" :aria-label="imageCover">
        <img
          v-if="currentCardBackground"
          :src="currentCardBackground"
          class="card-item__bg"
          alt="Background image"
        />
      </div>
      <div class="card-item__band"></div>
      <div class="card-item__cvv">
        <label :for="inputFields.cardCvv" aria-label="Card CVV">
          <div class="card-item__cvvTitle">{{ labels.cardCvv }}</div>
          <div class="card-item__cvvBand">
            <span>{{ valueFields.cardCvv }}</span>
          </div>
        </label>
        <div class="card-item__type">
          <img
            v-if="cardType"
            :src="getCreditCardImage"
            class="card-item__typeImg"
            alt="Dark bar image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VuePaycard',
  props: {
    valueFields: {
      type: Object,
      required: true
    },
    inputFields: {
      type: Object,
      default: () => ({
        cardNumber: 'v-card-number',
        cardName: 'v-card-name',
        cardMonth: 'v-card-month',
        cardYear: 'v-card-year',
        cardCvv: 'v-card-cvv'
      })
    },
    labels: {
      type: Object,
      default: () => ({
        cardName: 'Full Name',
        cardHolder: 'NOME',
        cardMonth: 'MM',
        cardYear: 'AA',
        cardExpires: 'DATA EXP',
        cardCvv: 'CVV'
      })
    },
    isCardNumberMasked: {
      type: Boolean,
      default: true
    },
    hasRandomBackgrounds: {
      type: Boolean,
      default: true
    },
    backgroundImage: {
      type: [String, Number],
      default: ''
    },
    setType: {
      type: String,
      default: ''
    }
  },
  emits: ['get-type'],
  setup() {
    let chip = require("../assets/images/chip.png")
    return { chip }
  },
  data () {
    const defaultPlaceholder = '#### #### #### ####'

    return {
      focusElementStyle: null,
      currentFocus: null,
      isFocused: false,
      isCardFlipped: false,
      amexCardPlaceholder: '#### ###### #####',
      fifteenCardPlaceholder: '#### #### #### ###',
      dinersCardPlaceholder: '#### ###### ####',
      unionPayCardPlaceholder: '###### ####### ######',
      defaultCardPlaceholder: defaultPlaceholder,
      currentPlaceholder: defaultPlaceholder
    }
  },
  watch: {
    currentFocus () {
      if (this.currentFocus) {
        this.changeFocus()
      } else {
        this.focusElementStyle = null
      }
    },
    cardType (val) {
      this.$emit('get-type', val)
      this.changePlaceholder()
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    this.destroy()
  },
  // * This can't be tested since the project runs in Vue 2
  /* istanbul ignore next */
  beforeUnmount () {
    /* istanbul ignore next */
    this.destroy()
  },
  computed: {
    jcbCardPlaceholder () {
      const number = this.valueFields.cardNumber.replace(/\s+/g, '')

      return number.startsWith('2131') || number.startsWith('1800')
        ? this.fifteenCardPlaceholder
        : this.defaultPlaceholder
    },
    getCreditCardImage () {
      const path = require(`../assets/images/${this.cardType}.png`)
      return path.default || path
    },
    cardType () {
      const acceptedTypes = [
        'visaelectron',
        'visa',
        'elo',
        'amex',
        'mastercard',
        'discover',
        'unionpay',
        'troy',
        'dinersclub',
        'jcb',
        'laser',
        'dankort',
        'uatp',
        'mir',
        'hipercard',
        'aura',
        'maestro'
      ]
      const setType = this.setType?.toLowerCase()?.replace(/ /g, '')
      if (setType?.length && acceptedTypes.includes(setType)) return setType

      const number = this.valueFields.cardNumber.replace(/\s+/g, '')

      if (number.match(/^4(026|17500|405|508|844|91[37])/)) {
        return 'visaelectron'
      }
      if (number.match(/^4\d{12}(\d{3})?$/)) return 'visa'
      if (
        number.match(
          /^((509091)|(636368)|(636297)|(504175)|(438935)|(40117[8-9])|(45763[1-2])|(457393)|(431274)|(50990[0-2])|(5099[7-9][0-9])|(50996[4-9])|(509[1-8][0-9][0-9])|(5090(0[0-2]|0[4-9]|1[2-9]|[24589][0-9]|3[1-9]|6[0-46-9]|7[0-24-9]))|(5067(0[0-24-8]|1[0-24-9]|2[014-9]|3[0-379]|4[0-9]|5[0-3]|6[0-5]|7[0-8]))|(6504(0[5-9]|1[0-9]|2[0-9]|3[0-9]))|(6504(8[5-9]|9[0-9])|6505(0[0-9]|1[0-9]|2[0-9]|3[0-8]))|(6505(4[1-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-8]))|(6507(0[0-9]|1[0-8]))|(65072[0-7])|(6509(0[1-9]|1[0-9]|20))|(6516(5[2-9]|6[0-9]|7[0-9]))|(6550(0[0-9]|1[0-9]))|(6550(2[1-9]|3[0-9]|4[0-9]|5[0-8])))/
        )
      ) {
        return 'elo'
      }
      if (number.match(/^3[47]\d{13}$/)) return 'amex'
      if (number.match(/^(5[1-5]\d{4}|677189)\d{10}$/)) return 'mastercard'
      if (number.match(/^6(?:011|5[0-9]{2})[0-9]{12}$/)) return 'discover'
      if (number.match(/^62[0-9]\d{14,17}$/)) return 'unionpay'
      if (number.match(/^9792\d{12}$/)) return 'troy'
      if (number.match(/^3(0[0-5]|[68]\d)\d{11,16}/)) return 'dinersclub'
      if (number.match(/(?:2131|1800|35[0-9]{3})[0-9]{11}$/)) return 'jcb'
      if (number.match(/^(6304|6706|6709|6771)[0-9]{12,15}$/)) return 'laser'
      if (number.match(/^5019\d{12}$/)) return 'dankort'
      if (number.match(/^1\d{14}$/)) return 'uatp'
      if (number.match(/^220[0-4]\d{12}$/)) return 'mir'
      if (number.match(/^(606282\d{10}(\d{3})?)|(3841\d{15})$/)) {
        return 'hipercard'
      }
      if (number.match(/^((?!504175))^((?!5067))(^50[0-9])/)) return 'aura'
      if (number.match(/(?:5[0678]\d\d|6304|6390|67\d\d)\d{8,15}$/)) {
        return 'maestro'
      }

      return ''
    },
    imageCover () {
      return !this.hasRandomBackgrounds && parseInt(this.backgroundImage)
        ? 'Image cover'
        : ''
    },
    isBackgroundImageFromAssets () {
      const numberImage = parseInt(this.backgroundImage)

      return (
        Number.isFinite(numberImage) &&
        parseInt(numberImage) < 26 &&
        parseInt(numberImage) > 0
      )
    },
    currentCardBackground () {
      const numberImage = parseInt(this.backgroundImage)

      if (this.isBackgroundImageFromAssets) {
        const path = require(`../assets/images/${numberImage}.jpg`)
        return path.default || path
      }

      if (this.backgroundImage && !Number.isFinite(numberImage)) {
        return this.backgroundImage
      }

      if (this.hasRandomBackgrounds) {
        const random = Math.floor(Math.random() * 25 + 1)

        const path = require(`../assets/images/${random}.jpg`)
        return path.default || path
      }

      return null
    }
  },
  methods: {
    addOrRemoveFieldListeners (event = 'addEventListener') {
      const self = this
      const fields = document.querySelectorAll('[data-card-field]')
      fields.forEach((element) => {
        element[event]('focus', () => {
          this.isFocused = true
          if (
            element.id === this.inputFields.cardYear ||
            element.id === this.inputFields.cardMonth
          ) {
            this.currentFocus = 'cardDate'
          } else {
            this.currentFocus = element.id
          }
          this.isCardFlipped = element.id === this.inputFields.cardCvv
        })
        element[event]('blur', () => {
          this.isCardFlipped = !element.id === this.inputFields.cardCvv
          const timeout = setTimeout(() => {
            if (!self.isFocused) {
              self.currentFocus = null
            }
            clearTimeout(timeout)
          }, 300)
          self.isFocused = false
        })
      })
    },
    init () {
      this.addOrRemoveFieldListeners()
    },
    destroy () {
      this.addOrRemoveFieldListeners('removeEventListener')
    },
    changeFocus () {
      const target = this.$refs[this.currentFocus]
      this.focusElementStyle = target
        ? {
            width: `${target.offsetWidth}px`,
            height: `${target.offsetHeight}px`,
            transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`
          }
        : null
    },
    getIsNumberMasked (index, n) {
      const numbers = this.cardType === 'amex' ? 13 : 14

      return (
        index < numbers &&
        this.valueFields.cardNumber.length > index &&
        n.trim() !== '' &&
        this.isCardNumberMasked
      )
    },
    changePlaceholder () {
      const cardsPlaceholder = {
        amex: this.amexCardPlaceholder,
        dinersclub: this.dinersCardPlaceholder,
        jcb: this.jcbCardPlaceholder,
        uatp: this.fifteenCardPlaceholder,
        unionpay: this.unionPayCardPlaceholder
      }

      this.currentPlaceholder =
        cardsPlaceholder[this.cardType] || this.defaultCardPlaceholder
      this.$nextTick(() => {
        this.changeFocus()
      })
    }
  }
}
</script>

<style src="../assets/css/style.min.css" scoped></style>
