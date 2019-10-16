import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import mergewith from 'lodash.mergewith'
import ItemList from '../ItemList.vue'
import Item from '../../components/Item.vue'
import flushPromises from 'flush-promises'

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
        }
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

  test('dispatch fetchListData with top', async () => {
    expect.assertions(1)
    const store = createStore()
    store.dispatch = jest.fn(() => Promise.resolve())
    createWrapper({ store })
    await flushPromises()
    expect(store.dispatch).toHaveBeenCalledWith('fetchListData', {
      type: 'top'
    })
  })
})
