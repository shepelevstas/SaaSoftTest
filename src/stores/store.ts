import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { ItemType } from '../components/ItemType'
import { TypeEnum } from '../components/ItemType'

interface MarkItem {
  text: string,
}

interface ItemStored {
  id: number,
  marks: MarkItem[],
  type: TypeEnum,
  login: string,
  password: string | null,
}

export const useStore = defineStore('store', () => {

  let data = []

  try {
    data = JSON.parse(localStorage.getItem('SaaSoftStore') || '[]') || []
  } catch (e) {
    data = []
  }

  //const data = raw ? JSON.parse(raw) : []

  const load = data.map((item:ItemStored) => ({...item, marks: item.marks.map(m => m.text)}))

  const items = reactive<ItemType[]>(load)

  // TODO add validation on save and on load

  const save = () => {
    localStorage.setItem('SaaSoftStore', JSON.stringify(items.filter(validItem).map(i => ({...i, marks: i.marks.map(m => ({text:m}))}))))
  }

  return {
    items,
    addEmptyItem(){
      items.push({
        id: Date.now(),
        marks: [],
        type: TypeEnum.local,
        login: '',
        password: '',
      })
    },
    remItem(item:ItemType){
      const index = items.findIndex(i => i == item)
      if (~index) {
        items.splice(index, 1)
        save()
      }
    },
    save,
  }
})
