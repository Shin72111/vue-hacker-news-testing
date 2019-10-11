import { shallowMount } from '@vue/test-utils'
import ItemList from '../ItemList.vue'
import Item from '../../components/Item.vue'
import { fetchListData } from '../../api/api'
import flushPromises from 'flush-promises'

jest.mock('../../api/api.js')

describe('ItemList.vue', () => {
  test('renders an Item with data for each item', async () => {
    expect.assertions(4)
    const $bar = {
      start: () => {},
      finish: () => {}
    }
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }]
    fetchListData.mockResolvedValueOnce(items)
    const wrapper = shallowMount(ItemList, { mocks: { $bar }})
    await flushPromises()
    const Items = wrapper.findAll(Item)
    expect(Items).toHaveLength(items.length)
    Items.wrappers.forEach((wrapper, i) => {
      expect(wrapper.props().item).toBe(items[i])
    })
  })

  test('call $bar start on load', () => {
    const $bar = {
      start: jest.fn(),
      finish: () => {}
    }
    shallowMount(ItemList, {
      mocks: { $bar }
    })
    expect($bar.start).toHaveBeenCalledTimes(1)
  })

  test('calls $bar.finish when load is successful', async () => {
    expect.assertions(1)
    const $bar = {
      start: () => {},
      finish: jest.fn()
    }
    shallowMount(ItemList, { mocks: {$bar}})
    await flushPromises()

    expect($bar.finish).toHaveBeenCalled()
  })

  test('calls $bar.fail when load unsuccessful', async () => {
    expect.assertions(1)
    const $bar = {
      start: () => {},
      fail: jest.fn()
    }
    fetchListData.mockRejectedValueOnce()
    shallowMount(ItemList, { mocks: {$bar}})
    await flushPromises()

    expect($bar.fail).toHaveBeenCalled()
  })
})
