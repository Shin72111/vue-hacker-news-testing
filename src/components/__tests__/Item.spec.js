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
})
