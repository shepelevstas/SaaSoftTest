<script setup lang="ts">
import { defineProps, ref, computed, nextTick, watch } from "vue";
import { useStore } from "../stores/store";
import type { ItemType, TypeKeys } from "./types";
import { TypeEnum } from "./types";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";

const props = defineProps<{
    item: ItemType;
}>();

const store = useStore();

function auto_grow_textarea(ev: Event) {
    const el = ev.target as HTMLElement;
    el.style.height = "5px";
    el.style.height = `${el.scrollHeight}px`;
}

const vAutogrow = {
    mounted(el: HTMLElement) {
        nextTick(() => {
            el.style.height = "5px";
            el.style.height = `${el.scrollHeight}px`;
        });

        el.addEventListener("input", auto_grow_textarea);
    },
    beforeUnmount(el: HTMLElement) {
        el.removeEventListener("input", auto_grow_textarea);
    },
};

const showPass = ref(false);

const marks = computed({
    get() {
        return props.item.marks.join(";");
    },
    set(newValue) {
        props.item.marks = newValue
            .split(";")
            .map((i) => i.trim())
            .filter(Boolean);
    },
});

watch(
    () => props.item.type,
    (type) => {
        if (type === TypeEnum.LDAP) {
            props.item.password = "";
        }
    },
);

const rules = {
    marks: { maxLength: (value: string[]) => value.join(";").length <= 50 },
    type: {
        required,
        isType: (value: TypeEnum) => Object.values(TypeEnum).includes(value),
    },
    login: { required, maxLength: maxLength(100) },
    password: {
        required: (value: string, item: ItemType) => {
            return item.type === TypeEnum.local ? Boolean(value) : true;
        },
        maxLength: maxLength(100),
    },
};

const v$ = useVuelidate(rules, props.item);

const saveIfValid = async () => {
    const valid = await v$.value.$validate();
    if (valid) {
        store.save();
    }
};
</script>

<template>
    <div class="item row pb-2">
        <div class="col-3">
            <textarea
                v-autogrow
                v-model.trim="marks"
                class="form-control col-3 overflow-hidden"
                :class="{ 'border-danger': v$.marks.$error }"
                style="resize: none"
                rows="1"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                @blur="saveIfValid"
            ></textarea>
        </div>

        <div class="col-2">
            <select
                class="form-control"
                :class="{ 'border-danger': v$.type.$error }"
                v-model="item.type"
                @change="saveIfValid"
            >
                <option
                    v-for="k in Object.keys(TypeEnum) as TypeKeys[]"
                    :value="TypeEnum[k]"
                    :key="k"
                >
                    {{ TypeEnum[k] }}
                </option>
            </select>
        </div>

        <div :class="item.type == TypeEnum.local ? 'col-3' : 'col-6'">
            <input
                v-model.trim="item.login"
                type="text"
                class="form-control"
                :class="{ 'border-danger': v$.login.$error }"
                @blur="saveIfValid"
            />
        </div>

        <div v-if="item.type == TypeEnum.local" class="col-3 position-relative">
            <input
                v-model.trim="item.password"
                :type="showPass ? 'text' : 'password'"
                class="form-control pe-5"
                :class="{ 'border-danger': v$.password.$error }"
                @blur="saveIfValid"
            />

            <i
                @click="showPass = !showPass"
                :class="showPass ? 'bi-eye-fill' : 'bi-eye-slash'"
                class="bi position-absolute end-0 top-0 me-4 mt-2"
            ></i>
        </div>

        <div class="col-1">
            <button @click="store.remItem(props.item)" class="btn">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    </div>
</template>
