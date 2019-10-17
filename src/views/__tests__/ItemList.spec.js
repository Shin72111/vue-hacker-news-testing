import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuex from 'vuex'
import mergewith from 'lodash.mergewith'
import ItemList from '../ItemList.vue'
import Item from '../../components/Item.vue'
import flushPromises from 'flush-promises'
import { async } from 'q'

const customizer = (objValue, srcValue) => {
  if (Array.isArray(srcValue))
    return srcValue
  if (srcValue instanceof Object && Object.keys(srcValue).length === 0)
    return srcValue
}

const localVue = createLocalVue()
localVue.use(Vuex)

describe('ItemList.vue', () => {
  const createStore = (overrides) => {
    const defaultStoreConfig = {
      getters: {
        displayItems: jest.fn()
      },
      actions: {
        fetchListData: jest.fn(() => Promise.resolve())
      }
    }
    return new Vuex.Store(
      mergewith(defaultStoreConfig, overrides, customizer)
    )
  }

  const createWrapper = overrides => {
    const defaultMountingOptions = {
      mocks: {
        $bar: {
          start: jest.fn(),
          finish: jest.fn(),
          fail: jest.fn()
        },
        $route: {
          params: { type: 'top' }
        }
      },
      stubs: {
        RouterLink: RouterLinkStub
      },
      localVue,
      store: createStore()
    }
    return shallowMount(
      ItemList,
      mergewith(
        defaultMountingOptions,
        overrides,
        customizer
      )  
    )
  }

  test('renders an Item with data for each item in displayItems', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const store = createStore({
      getters: {
        displayItems: () => items
      }
    })
    const wrapper = createWrapper({ store })
    const Items = wrapper.findAll(Item)
    expect(Items).toHaveLength(items.length)
    Items.wrappers.forEach((wrapper, i) => {
      expect(wrapper.props().item).toBe(items[i])
    })
  })

  test('call $bar start on render', () => {
    const $bar = {
      start: jest.fn(),
    }
    createWrapper({
      mocks: { $bar },
    })
    expect($bar.start).toHaveBeenCalledTimes(1)
  })

  test('calls $bar.finish when load successful', async () => {
    expect.assertions(1)
    const $bar = {
      finish: jest.fn()
    }
    createWrapper({ mocks: { $bar }})
    await flushPromises()

    expect($bar.finish).toHaveBeenCalled()
  })

  test('calls $bar.fail when fetchListData throws', async () => {
    expect.assertions(1)
    const store = createStore({
      actions: {
        fetchListData: jest.fn(() => Promise.reject())
      }
    })
    const mocks = {
      $bar: {
        fail: jest.fn()
      }
    }
    createWrapper({ mocks, store })
    await flushPromises()

    expect(mocks.$bar.fail).toHaveBeenCalled()
  })

  test('dispatch fetchListData with $route.params.type', async () => {
    expect.assertions(1)
    const store = createStore()
    store.dispatch = jest.fn(() => Promise.resolve())
    const type = 'a type'
    const mocks = {
      $route: {
        params: {
          type
        }
      }
    }
    createWrapper({ store, mocks })
    await flushPromises()
    expect(store.dispatch).toHaveBeenCalledWith('fetchListData', {
      type
    })
  })

  test('renders 1/5 when on page 1 of 5', () => {
    const store = createStore({
      getters: {
        maxPage: () => 5
      }
    })
    const wrapper = createWrapper({ store })
    expect(wrapper.text()).toContain('1/5')
  })

  test('renders 2/5 when on page 2 of 5', () => {
    const store = createStore({
      getters: {
        maxPage: () => 5
      }
    })
    const mocks = {
      $route: {
        params: {
          page: '2'
        }
      }
    }
    const wrapper = createWrapper({ store, mocks })
    expect(wrapper.text()).toContain('2/5')
  })

  test('calls $router.replace when the page parameter is greater than the max' +
      'page count', async () => {
    expect.assertions(1)
    const store = createStore({
      getters: {
        maxPage: () => 5
      }
      
    })
    const mocks = {
      $router: {
        replace: jest.fn()
      },
      $route: {
        params: {
          page: '1000'
        }
      }
    }

    createWrapper({ mocks, store })
    await flushPromises()
    expect(mocks.$router.replace).toHaveBeenCalledWith('/top/1')
  })

  test('renders a RouterLink with the previous page if one exists', () => {
    const mocks = {
      $route: {
        params: { page: '2' }
      }
    }
    const wrapper = createWrapper({ mocks })
    expect(wrapper.find(RouterLinkStub).props().to).toBe('/top/1')
    expect(wrapper.find(RouterLinkStub).text()).toBe('< prev')
  })

  test('renders a RouterLink with the next page if one exists', () => {
    const mocks = {
      $route: {
        params: { page: '1' }
      }
    }
    const store = createStore({
      getters: {
        maxPage: () => 3
      }
    })

    const wrapper = createWrapper({ store, mocks })
    expect(wrapper.find(RouterLinkStub).props().to).toBe('/top/2')
    expect(wrapper.find(RouterLinkStub).text()).toBe('more >')
  })

  test('renders a RouterLink with the next page when no page param exists', () => {
    const store = createStore({
      getters: {
        maxPage: () => 3
      }
    })

    const wrapper = createWrapper({ store })
    expect(wrapper.find(RouterLinkStub).props().to).toBe('/top/2')
    expect(wrapper.find(RouterLinkStub).text()).toBe('more >')
  })

  test('renders a <a> element without an href if there are no previous pages',
      () => {
    const wrapper = createWrapper()
    expect(wrapper.find('a').attributes().href).toBe(undefined)
    expect(wrapper.find('a').text()).toBe('< prev')
  })

  test('renders a <a> element without an href if there are no next pages',
      () => {
    const store = createStore({
      getters: {
        maxPage: () => 1
      }
    })
    const wrapper = createWrapper({ store })
    expect(wrapper.findAll('a').at(1).attributes().href).toBe(undefined)
    expect(wrapper.findAll('a').at(1).text()).toBe('more >')
  })
})
