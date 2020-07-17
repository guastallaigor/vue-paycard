import '../.storybook/storybook.css'
import { object, boolean, text } from '@storybook/addon-knobs'
import { addDecorator, addParameters } from '@storybook/vue'
import { withA11y } from '@storybook/addon-a11y'
import VuePaycard from '../src/components/VuePaycard.vue'

addParameters({
  docs: {
    inlineStories: true
  }
})
addDecorator(withA11y)

export default {
  title: 'VuePaycard',
  component: VuePaycard
};

export const DefaultComponent = () => ({
  components: { VuePaycard },
  directives: {
    'number-only': {
      bind (el) {
        function checkValue (event) {
          event.target.value = event.target.value.replace(/[^0-9]/g, '');
          if (event.charCode >= 48 && event.charCode <= 57) {
            return true
          }
          event.preventDefault()
        }
        el.addEventListener('keypress', checkValue)
      }
    },
    'letter-only': {
      bind (el) {
        function checkValue (event) {
          if (event.charCode >= 48 && event.charCode <= 57) {
            event.preventDefault()
          }
          return true
        }
        el.addEventListener('keypress', checkValue)
      }
    }
  },
  data: () => ({
    minCardYear: new Date().getFullYear(),
    mainCardNumber: '',
    cardNumberMaxLength: 19
  }),
  computed: {
    minCardMonth () {
      if (this.valueFields.cardYear === this.minCardYear) return new Date().getMonth() + 1
      return 1
    }
  },
  watch: {
    cardYear () {
      if (this.valueFields.cardMonth < this.minCardMonth) {
        this.valueFields.cardMonth = '';
      }
    }
  },
  methods: {
    changeName (e) {
      this.valueFields.cardName = e.target.value
      this.$emit('input-card-name', this.valueFields.cardName)
    },
    changeNumber (e) {
      this.valueFields.cardNumber = e.target.value
      let value = this.valueFields.cardNumber.replace(/\D/g, '')
      // american express, 15 digits
      if ((/^3[47]\d{0,13}$/).test(value)) {
        this.valueFields.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        this.cardNumberMaxLength = 17
      } else if ((/^3(?:0[0-5]|[68]\d)\d{0,11}$/).test(value)) { // diner's club, 14 digits
        this.valueFields.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        this.cardNumberMaxLength = 16
      } else if ((/^\d{0,16}$/).test(value)) { // regular cc number, 16 digits
        this.valueFields.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
        this.cardNumberMaxLength = 19
      }
      // eslint-disable-next-line
      if (e.inputType == 'deleteContentBackward') {
        let lastChar = this.valueFields.cardNumber.substring(this.valueFields.cardNumber.length, this.valueFields.cardNumber.length - 1)
        // eslint-disable-next-line
        if (lastChar == ' ') { this.valueFields.cardNumber = this.valueFields.cardNumber.substring(0, this.valueFields.cardNumber.length - 1) }
      }
      this.$emit('input-card-number', this.valueFields.cardNumber)
    },
    changeMonth () {
      this.$emit('input-card-month', this.valueFields.cardMonth)
    },
    changeYear () {
      this.$emit('input-card-year', this.valueFields.cardYear)
    },
    changeCvv (e) {
      this.valueFields.cardCvv = e.target.value
      this.$emit('input-card-cvv', this.valueFields.cardCvv)
    },
    generateMonthValue (n) {
      return n < 10 ? `0${n}` : n
    },
    toggleMask () {
      this.isCardNumberMasked = !this.isCardNumberMasked
      if (this.isCardNumberMasked) {
        this.maskCardNumber()
      } else {
        this.unMaskCardNumber()
      }
    },
    maskCardNumber () {
      this.valueFields.cardNumberNotMask = this.valueFields.cardNumber
      this.mainCardNumber = this.valueFields.cardNumber
      let arr = this.valueFields.cardNumber.split('')
      arr.forEach((element, index) => {
        if (index > 4 && index < 14 && element.trim() !== '') {
          arr[index] = '*'
        }
      });
      this.valueFields.cardNumber = arr.join('')
    },
    unMaskCardNumber () {
      this.valueFields.cardNumber = this.mainCardNumber
    },
  },
  props: {
    valueFields: {
      type: Object,
      default: object('Value fields', {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: ''
      })
    },
    inputFields: {
      type: Object,
      default: object('Input fields ids', {
        cardNumber: 'v-card-number',
        cardName: 'v-card-name',
        cardMonth: 'v-card-month',
        cardYear: 'v-card-year',
        cardCvv: 'v-card-cvv'
      })
    },
    labels: {
      type: Object,
      default: object('Labels', {
        cardName: 'Full Name',
        cardHolder: 'Card Holder',
        cardMonth: 'MM',
        cardYear: 'YY',
        cardExpires: 'Expires'
      })
    },
    isCardNumberMasked: {
      type: Boolean,
      default: boolean('Is credit card number masked', true)
    },
    randomBackgrounds: {
      type: Boolean,
      default: boolean('Random backgrounds', true)
    },
    backgroundImage: {
      type: [String, Number],
      default: text('Background image', '')
    }
  },
  template: `
  <div class="card-form">
    <div class="card-list">
      <VuePaycard
        :inputFields="inputFields"
        :valueFields="valueFields"
        :labels="labels"
        :isCardNumberMasked="isCardNumberMasked"
        :randomBackgrounds="randomBackgrounds"
        :backgroundImage="backgroundImage"
      />
      <div class="card-form__inner">
        <div class="card-input">
          <label for="cardNumber" class="card-input__label">Card Number</label>
          <input
            type="tel"
            :id="inputFields.cardNumber"
            title="Number"
            class="card-input__input"
            :value="valueFields.cardNumber"
            @input="changeNumber"
            data-card-field
            autocomplete="off"
            :maxlength="cardNumberMaxLength"
          />
        </div>
        <div class="card-input">
          <label for="cardName" class="card-input__label">Card Holder</label>
          <input
            type="text"
            :id="inputFields.cardName"
            title="Name"
            v-letter-only
            class="card-input__input"
            :value="valueFields.cardName"
            @input="changeName"
            data-card-field
            autocomplete="off"
          />
        </div>
        <div class="card-form__row">
          <div class="card-form__col">
            <div class="card-form__group">
              <label for="cardMonth" class="card-input__label" aria-label="Expiration Date">Expiration Date (Month / Year)</label>
              <select
                class="card-input__input -select"
                :id="inputFields.cardMonth"
                aria-label="Card Month"
                title="Month"
                v-model="valueFields.cardMonth"
                data-card-field
              >
                <option value disabled selected>Month</option>
                <option
                  v-bind:value="n < 10 ? '0' + n : n"
                  v-for="n in 12"
                  v-bind:disabled="n < minCardMonth"
                  v-bind:key="n"
                >{{generateMonthValue(n)}}</option>
              </select>
              <select
                class="card-input__input -select"
                :id="inputFields.cardYear"
                aria-label="Card year"
                title="Year"
                v-model="valueFields.cardYear"
                data-card-field
              >
                <option value disabled selected>Year</option>
                <option
                  v-bind:value="$index + minCardYear"
                  v-for="(n, $index) in 12"
                  v-bind:key="n"
                >{{$index + minCardYear}}</option>
              </select>
            </div>
          </div>
          <div class="card-form__col -cvv">
            <div class="card-input">
              <label for="cardCvv" class="card-input__label" aria-label="Card CVV">CVV</label>
              <input
                type="tel"
                title="CVV"
                class="card-input__input"
                v-number-only
                :id="inputFields.cardCvv"
                maxlength="4"
                :value="valueFields.cardCvv"
                @input="changeCvv"
                data-card-field
                autocomplete="off"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
});

DefaultComponent.story = {
  name: 'Default'
};
