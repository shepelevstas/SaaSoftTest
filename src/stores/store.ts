import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { ItemType } from '../components/ItemType'

interface MarkItem {
  text: string,
}

interface ItemStored {
   id: number,
   marks: MarkItem[],
   type: 'local' | 'LDAP',
   login: string,
   password: string | null,
}

export const useStore = defineStore('store', () => {
  const raw = localStorage.getItem('SaaSoftStore')

  const data = raw ? JSON.parse(raw) : []

  const load = data.map((item:ItemStored) => ({...item, marks: item.marks.map(m => m.text)}))

  const items = reactive<ItemType[]>(load)

  return {items}
})
