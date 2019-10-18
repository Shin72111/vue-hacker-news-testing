import { mount } from '@vue/test-utils'
import { titleMixin } from '../mixins'

describe('titleMixin', () => {
  test('sets document.title using component title property', () => {
    const Component = {
      render () {},
      title: 'dummy title',
      mixins: [titleMixin]
    }
    mount(Component)
    expect(document.title).toBe('Vue HN | dummy title')
  })

  test('does not set document.title if title property does not exist', () => {
    const Component = {
      render () {},
      mixins: [titleMixin]
    }
    document.title = 'another dummy title'
    mount(Component)
    expect(document.title).toBe('another dummy title')
  })

  test('sets document.title using result of title if it is a function', () => {
    const Component = {
      render () {},
      title () {
        return 'some title'
      },
      mixins: [titleMixin]
    }
    mount(Component)
    expect(document.title).toBe('Vue HN | some title')
  })
})
