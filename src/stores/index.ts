import { defineStore } from 'pinia'
import { getApiList } from '../server'
import type { RootObject, Children } from './type'

export const useStore = defineStore({
  id: 'counter',
  state: () => {
    return {
      list: <RootObject>{},
      item: <Children[]>[]
    }
  },
  actions: {
    async getList() {
      const result = await getApiList()
      this.list = result
      console.log(result, 'result')
    }
  }
})
