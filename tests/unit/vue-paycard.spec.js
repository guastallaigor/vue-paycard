import { mount } from '@vue/test-utils'
import VuePaycard from '../../src/components/VuePaycard'

describe('When I create the VuePaycard component', () => {
  const transitionStub = () => ({
    render: function(h) {
      return this.$options._renderChildren
    }
  })
  const createPaycard = (propsData = {}) => {
    return mount(VuePaycard, {
      propsData,
      stubs: {
        transition: transitionStub()
      }
    })
  }

  it('should be able to mask numbers if the isCardNumberMasked prop is true', () => {
    // * for now, only the last four digits will be shown
    const valueFields = { cardName: '', cardNumber: '9999 9999 9999 9999', cardMonth: '', cardYear: '', cardCvv: '' }
    const wrapper = createPaycard({ valueFields, isCardNumberMasked: true })
    const elements = wrapper.findAll('.card-item__numberItem')
    expect(elements.exists()).toBe(true)
    const numbers = elements.wrappers.map(it => it.text())
    expect(numbers.length).toBe(19)
    const maskedNumbers = numbers.filter(it => it === '*')
    expect(maskedNumbers.length).toBe(12)
    const unmaskedNumbers = numbers.filter(it => it === '9')
    expect(unmaskedNumbers.length).toBe(4)
    const spaces = numbers.filter(it => it === '')
    expect(spaces.length).toBe(3)
  })

  it('should be able to show all the numbers if the isCardNumberMasked prop is false', () => {
    const valueFields = { cardName: '', cardNumber: '9999 9999 9999 9999', cardMonth: '', cardYear: '', cardCvv: '' }
    const wrapper = createPaycard({ valueFields, isCardNumberMasked: false })
    const elements = wrapper.findAll('.card-item__numberItem')
    expect(elements.exists()).toBe(true)
    const numbers = elements.wrappers.map(it => it.text())
    expect(numbers.length).toBe(19)
    const maskedNumbers = numbers.filter(it => it === '*')
    expect(maskedNumbers.length).toBe(0)
    const unmaskedNumbers = numbers.filter(it => it === '9')
    expect(unmaskedNumbers.length).toBe(16)
    const spaces = numbers.filter(it => it === '')
    expect(spaces.length).toBe(3)
  })

  it('should be able to set a background-image with a link', async () => {
    const valueFields = { cardName: '', cardNumber: '', cardMonth: '', cardYear: '', cardCvv: '' }
    const payload = { valueFields }
    const wrapper = createPaycard({ ...payload })
    expect(wrapper.exists()).toBeTruthy()
    const image = 'https://ik.imagekit.io/6xhf1gnexgdgk/lion_BllLvaqVn.jpg'
    await wrapper.setProps({ backgroundImage: image })
    const cover = wrapper.findAll('.card-item__cover')
    expect(cover.exists()).toBe(true)
    const bg = wrapper.find('.card-item__bg')
    expect(bg.exists()).toBe(true)
    expect(bg.attributes().src).toBe(image)
  })

  it('should be able to remove the random background images', () => {
    const valueFields = { cardName: '', cardNumber: '', cardMonth: '', cardYear: '', cardCvv: '' }
    const payload = { valueFields, hasRandomBackgrounds: false, backgroundImage: '' }
    const wrapper = createPaycard({ ...payload })
    expect(wrapper.exists()).toBeTruthy()
    const cover = wrapper.findAll('.card-item__cover')
    expect(cover.exists()).toBe(true)
    const bg = wrapper.find('.card-item__bg')
    expect(bg.exists()).toBe(false)
  })

  it('should be able to change all the labels', () => {
    const valueFields = { cardName: '', cardNumber: '', cardMonth: '', cardYear: '', cardCvv: '' }
    const labels = { cardName: 'A', cardHolder: 'B', cardMonth: 'XX', cardYear: 'WW', cardExpires: 'C', cardCvv: 'V' }
    const payload = { valueFields, labels }
    const wrapper = createPaycard({ ...payload })
    expect(wrapper.exists()).toBeTruthy()
    const name = wrapper.find('.card-item__name')
    expect(name.exists()).toBe(true)
    expect(name.text()).toBe('A')
    const holder = wrapper.find('.card-item__holder')
    expect(holder.exists()).toBe(true)
    expect(holder.text()).toBe('B')
    const expires = wrapper.find('.card-item__dateTitle')
    expect(expires.exists()).toBe(true)
    expect(expires.text()).toBe('C')
    const month = wrapper.find('[for=v-card-month] > span')
    expect(month.exists()).toBe(true)
    expect(month.text()).toBe('XX')
    const year = wrapper.find('[for=v-card-year] > span')
    expect(year.exists()).toBe(true)
    expect(year.text()).toBe('WW')
    const cvv = wrapper.find('.card-item__cvvTitle')
    expect(cvv.exists()).toBe(true)
    expect(cvv.text()).toBe('V')
  })

  it('should be able to change all the input field ids', () => {
    const valueFields = { cardName: '', cardNumber: '', cardMonth: '', cardYear: '', cardCvv: '' }
    const inputFields = { cardName: 'a-1', cardNumber: 'a-2', cardMonth: 'a-3', cardYear: 'a-4', cardCvv: 'a-5' }
    const payload = { valueFields, inputFields }
    const wrapper = createPaycard({ ...payload })
    expect(wrapper.exists()).toBeTruthy()
    const name = wrapper.find('[for=a-1]')
    expect(name.exists()).toBe(true)
    expect(name.text()).toContain('Card Holder')
    const number = wrapper.find('[for=a-2]')
    expect(number.exists()).toBe(true)
    expect(number.text()).toContain('#')
    const month = wrapper.findAll('[for=a-3]')
    expect(month.length).toBe(2)
    expect(month.at(0).exists()).toBe(true)
    expect(month.at(0).text()).toBe('Expires')
    expect(month.at(1).exists()).toBe(true)
    expect(month.at(1).text()).toBe('MM')
    const year = wrapper.find('[for=a-4]')
    expect(year.exists()).toBe(true)
    expect(year.text()).toBe('YY')
    const cvv = wrapper.find('[for=a-5]')
    expect(cvv.exists()).toBe(true)
    expect(cvv.text()).toContain('CVV')
  })

  it('should be able to set all the value fields', async () => {
    const valueFields = { cardName: '', cardNumber: '', cardMonth: '', cardYear: '', cardCvv: '' }
    const payload = { valueFields }
    const wrapper = createPaycard({ ...payload })
    expect(wrapper.exists()).toBeTruthy()
    const valueFieldsAfter = { cardName: 'qwerty', cardNumber: '9999 9999 9999 9999', cardMonth: '01', cardYear: '2021', cardCvv: 'ASD' }
    await wrapper.setProps({ valueFields: valueFieldsAfter, isCardNumberMasked: false })
    // * card number
    const elements = wrapper.findAll('.card-item__numberItem')
    expect(elements.exists()).toBe(true)
    const numbers = elements.wrappers.map(it => it.text())
    expect(numbers.length).toBe(19)
    const maskedNumbers = numbers.filter(it => it === '*')
    expect(maskedNumbers.length).toBe(0)
    const unmaskedNumbers = numbers.filter(it => it === '9')
    expect(unmaskedNumbers.length).toBe(16)
    const spaces = numbers.filter(it => it === '')
    expect(spaces.length).toBe(3)
    // * card name
    const elementsNamedItem = wrapper.findAll('.card-item__nameItem')
    expect(elementsNamedItem.exists()).toBe(true)
    const elementsNamedItemText = elementsNamedItem.wrappers.map(it => it.text())
    expect(elementsNamedItemText.length).toBe(6)
    // * card month
    const monthValue = wrapper.find('[for=v-card-month] > span')
    expect(monthValue.exists()).toBe(true)
    expect(monthValue.text()).toBe('01')
    // * card year
    const yearValue = wrapper.find('[for=v-card-year] > span')
    expect(yearValue.exists()).toBe(true)
    expect(yearValue.text()).toBe('21')
    // * card cvv
    const cvvValue = wrapper.find('.card-item__cvvBand > span')
    expect(cvvValue.exists()).toBe(true)
    expect(cvvValue.text()).toBe('ASD')
    // * labels
    const name = wrapper.find('[for=v-card-name]')
    expect(name.exists()).toBe(true)
    expect(name.text()).toContain('Card Holder')
    const number = wrapper.find('[for=v-card-number]')
    expect(number.exists()).toBe(true)
    expect(number.text()).toContain('9')
    const month = wrapper.findAll('[for=v-card-month]')
    expect(month.length).toBe(2)
    expect(month.at(0).exists()).toBe(true)
    expect(month.at(0).text()).toBe('Expires')
    expect(month.at(1).exists()).toBe(true)
    expect(month.at(1).text()).toContain('01')
    const year = wrapper.find('[for=v-card-year]')
    expect(year.exists()).toBe(true)
    expect(year.text()).toContain('21')
    const cvv = wrapper.find('[for=v-card-cvv]')
    expect(cvv.exists()).toBe(true)
    expect(cvv.text()).toContain('CVV')
  })

  it('should be able to change the cards placeholder', async () => {
    const valueFields = { cardName: '', cardNumber: '', cardMonth: '', cardYear: '', cardCvv: '' }
    const payload = { valueFields, isCardNumberMasked: true }
    const wrapper = createPaycard({ ...payload })
    expect(wrapper.exists()).toBeTruthy()
    // * card number masked
    let elements = wrapper.findAll('.card-item__numberItem')
    expect(elements.exists()).toBe(true)
    let numbers = elements.wrappers.map(it => it.text())
    expect(numbers.length).toBe(19)
    let maskedNumbers = numbers.filter(it => it === '*')
    expect(maskedNumbers.length).toBe(0)
    let hashNumbers = numbers.filter(it => it === '#')
    expect(hashNumbers.length).toBe(16)
    let unmaskedNumbers = numbers.filter(it => it === '9')
    expect(unmaskedNumbers.length).toBe(0)
    let spaces = numbers.filter(it => it === '')
    expect(spaces.length).toBe(3)
    const valueFieldsAfter = { cardName: 'qwerty', cardNumber: '3437 651651 59999', cardMonth: '01', cardYear: '2021', cardCvv: 'ASD' }
    await wrapper.setProps({ valueFields: valueFieldsAfter, isCardNumberMasked: false })
    // * card number
    elements = wrapper.findAll('.card-item__numberItem')
    expect(elements.exists()).toBe(true)
    numbers = elements.wrappers.map(it => it.text())
    expect(numbers.length).toBe(17)
    maskedNumbers = numbers.filter(it => it === '*')
    expect(maskedNumbers.length).toBe(0)
    hashNumbers = numbers.filter(it => it === '#')
    expect(hashNumbers.length).toBe(0)
    unmaskedNumbers = numbers.filter(it => it === '9')
    expect(unmaskedNumbers.length).toBe(4)
    spaces = numbers.filter(it => it === '')
    expect(spaces.length).toBe(2)
  })

  it('should be able to change the cards placeholder', async () => {
    const valueFields = { cardName: '', cardNumber: '', cardMonth: '', cardYear: '', cardCvv: '' }
    const payload = { valueFields, isCardNumberMasked: true }
    const wrapper = createPaycard({ ...payload })
    expect(wrapper.exists()).toBeTruthy()
    // * card number masked with empty values
    let elements = wrapper.findAll('.card-item__numberItem')
    expect(elements.exists()).toBe(true)
    let numbers = elements.wrappers.map(it => it.text())
    expect(numbers.length).toBe(19)
    let maskedNumbers = numbers.filter(it => it === '*')
    expect(maskedNumbers.length).toBe(0)
    let hashNumbers = numbers.filter(it => it === '#')
    expect(hashNumbers.length).toBe(16)
    let unmaskedNumbers = numbers.filter(it => it === '9')
    expect(unmaskedNumbers.length).toBe(0)
    let spaces = numbers.filter(it => it === '')
    expect(spaces.length).toBe(3)
    const valueFieldsAfter = { cardName: 'qwerty', cardNumber: '3437 651651 59999', cardMonth: '01', cardYear: '2021', cardCvv: 'ASD' }
    await wrapper.setProps({ valueFields: valueFieldsAfter, isCardNumberMasked: false })
    // * card number unmasked with values
    elements = wrapper.findAll('.card-item__numberItem')
    expect(elements.exists()).toBe(true)
    numbers = elements.wrappers.map(it => it.text())
    expect(numbers.length).toBe(17)
    maskedNumbers = numbers.filter(it => it === '*')
    expect(maskedNumbers.length).toBe(0)
    hashNumbers = numbers.filter(it => it === '#')
    expect(hashNumbers.length).toBe(0)
    unmaskedNumbers = numbers.filter(it => it === '9')
    expect(unmaskedNumbers.length).toBe(4)
    spaces = numbers.filter(it => it === '')
    expect(spaces.length).toBe(2)
  })

  it('should be remove all input events', () => {
    // * this test needs improvement since it doesn't have any form
    const valueFields = { cardName: '', cardNumber: '', cardMonth: '', cardYear: '', cardCvv: '' }
    const wrapper = mount(VuePaycard, {
      propsData: {
        valueFields
      },
      stubs: {
        transition: transitionStub()
      },
      attachTo: document.body
    })
    expect(wrapper.exists()).toBeTruthy()
    const fields = document.querySelectorAll('[data-card-field]')
    expect(fields).toMatchObject({})
    wrapper.destroy()
    expect(wrapper.exists()).toBeFalsy()
  })

  it('should match default component snapshot', () => {
    const valueFields = { cardName: '', cardNumber: '', cardMonth: '', cardYear: '', cardCvv: '' }
    const wrapper = createPaycard({ valueFields })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
