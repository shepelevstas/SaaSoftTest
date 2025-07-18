<script setup lang="ts">
  import { defineProps, ref, computed, nextTick, watch } from 'vue'
  import { useStore } from '../stores/store'
  import type { ItemType } from './ItemType'
  import { TypeEnum } from './ItemType'

  const props = defineProps<{
    item: ItemType,
  }>()

  const store = useStore()

  function auto_grow_textarea(ev:Event) {
    const el = ev.target as HTMLElement
    el.style.height = "5px"
    el.style.height = (el.scrollHeight) + "px"
  }

  const vAutogrow = {
    mounted(el: HTMLElement) {
      nextTick(() => {
        el.style.height = "5px"
        el.style.height = (el.scrollHeight) + "px"
      })

      el.addEventListener('input', auto_grow_textarea)
    },
    beforeUnmount(el: HTMLElement) {
      el.removeEventListener('input', auto_grow_textarea)
    },
  }

  // TODO delete
  const remItem = () => {
    const index = store.items.findIndex(i => i == props.item)
    if (~index) {
      store.items.splice(index, 1)
      //nextTick(save)
      store.save()
    }
  }

  const showPass = ref(false)

  const marks = computed({
    get() {
      return props.item.marks.join(';')
    },
    set(newValue) {
      props.item.marks = newValue.split(';').map(i => i.trim()).filter(Boolean)
    }
  })

  watch(
    () => props.item.type,
    (type) => {
      if (type === TypeEnum.LDAP) {
        props.item.password = null
      }
    }
  )

  // TODO move validation to store
  const validMark = (item:ItemType) => item.marks.join(';').length <= 50
  const validType = (item:ItemType) => Boolean(~[TypeEnum.LDAP, TypeEnum.local].indexOf(item.type))
  const validLogin = (item:ItemType) => item.login.trim().length <= 100 && item.login.trim().length > 0
  const validPass = (item:ItemType) => {
    if (item.password === null) {
      return item.type === TypeEnum.LDAP
    }
    return Boolean(item.password.trim()) && item.password.trim().length <= 100
  }
  const validItem = (item:ItemType) => validMark(item) && validType(item) && validLogin(item) && validPass(item)

  const item = props.item

  const border = ref<string[]>(['','','',''])
  const validationFuncs = [validMark, validType, validLogin, validPass]

  // TODO delete
  const save = () => {
    localStorage.setItem('SaaSoftStore', JSON.stringify(store.items.filter(validItem).map(i => ({...i, marks: i.marks.map(m => ({text:m}))}))))
  }

  const validate = (n:number) => {
    border.value[n] = validationFuncs[n](item) ? '' : 'border-danger'

    if (validItem(item)) {
      //nextTick(save)
      store.save()
    }
  }

</script>


<template>
  <div class="item row pb-2">

    <div class="col-3">
      <textarea v-autogrow v-model="marks" class="form-control col-3 overflow-hidden" :class="border[0]" style="resize:none;" rows="1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" @blur="validate(0)"></textarea>
    </div>

    <div class="col-2">
      <select class="form-control" :class="border[1]" v-model="item.type" @change="validate(1)">
        <option value="local">Локальная</option>
        <option value="LDAP">LDAP</option>
      </select>
    </div>

    <div :class="item.type == TypeEnum.local ? 'col-3' : 'col-6'">
      <input v-model="item.login" type="text" class="form-control" :class="border[2]" @blur="validate(2)">
    </div>

    <div v-if="item.type == TypeEnum.local" class="col-3 position-relative">
      <input v-model="item.password" :type="showPass ? 'text' : 'password'" class="form-control pe-5" :class="border[3]" @blur="validate(3)">

      <i @click='showPass = !showPass' :class="showPass ? 'bi-eye-fill' : 'bi-eye-slash'" class="bi position-absolute end-0 top-0 me-4 mt-2"></i>
    </div>

    <div class="col-1">
      <button @click="store.remItem(props.item)" class="btn">
        <i class="bi bi-trash"></i>
      </button>
    </div>

  </div>



</template>
