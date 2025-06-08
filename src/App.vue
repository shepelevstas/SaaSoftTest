<script setup lang="ts">
  import Item from './components/Item.vue'
  import { useStore } from './stores/store'
  import type { ItemType } from './components/ItemType'

  const store = useStore()

  const addItem = () => {
    store.items.push({
      id: Date.now(),
      marks: [],
      type: 'local',
      login: '',
      password: '',
    })
  }

</script>

<template>

  <div class="container pt-4">

    <h1 class="pb-4">
      <span class="me-4">Учетные записи</span>
      <button @click="addItem" class="btn btn-lg btn-outline-success">
        <i class="bi bi-plus-lg"></i>
      </button>
    </h1>

    <div class="alert alert-light mb-4" role="alert">
      <i class="bi bi-question-circle"></i>
      Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
    </div>

    <div class="row text-black-50 mb-2">
      <div class="col-3">Метки</div>
      <div class="col-2">Тип записи</div>
      <div class="col-3">Логин</div>
      <div class="col-3">Пароль</div>
    </div>

    <Item v-for="item in store.items" :key="item.id" :item="item" />

  </div>




</template>
