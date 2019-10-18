import Item from '../Item.vue'
import { shallowMount } from '@vue/test-utils'

describe('Item.vue', () => {
  test('render item.author and item.score', () => {
    const item = {
      author: 'Tester',
      score: 999
    }
    const wrapper = shallowMount(Item, {
      propsData: { item }
    })

    expect(wrapper.text()).toContain(item.author)
    expect(wrapper.text()).toContain(item.score)
  })

  test('renders a link to the item.url with item.title as text', () => {
    const item = {
      title: 'some title',
      url: 'http://some-url.com'
    }
    const wrapper = shallowMount(Item, {
      propsData: { item }
    })

    const a = wrapper.find('a')
    expect(a.text()).toBe(item.title)
    expect(a.attributes().href).toBe(item.url)
  })

  test('renders the time since the last post', () => {
    const dateNow = jest.spyOn(Date, 'now')
    const dateNowTime = new Date('2019')

    dateNow.mockImplementation(() => dateNowTime)

    const item = {
      time: (dateNowTime / 1000) - 600
    }
    const wrapper = shallowMount(Item, {
      propsData: { item }
    })
    dateNow.mockRestore()
    expect(wrapper.text()).toContain('10 minutes ago')
  })

  test('renders the hostname', () => {
    const item = {
      url: 'https://some-url.com/with-paths'
    }
    const wrapper = shallowMount(Item, {
      propsData: { item }
    })
    expect(wrapper.text()).toContain('(some-url.com)')
  })
})
