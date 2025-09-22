import { reactive } from "vue";
import { defineStore } from "pinia";
import type { ItemType, ItemStored } from "../components/types";
import { TypeEnum } from "../components/types";
import Ajv from "ajv";
import type { JSONSchemaType } from "ajv";

export const useStore = defineStore("store", () => {
  let data = [];

  try {
    data = JSON.parse(localStorage.getItem("SaaSoftStore") || "[]") || [];
  } catch (e) {
    data = [];
  }

  const ajv = new Ajv();
  const marksSchema = {
    type: "array",
    items: {
      type: "object",
      properties: { text: { type: "string" } },
      required: ["text"],
    },
  };
  const schema: JSONSchemaType<ItemStored> = {
    oneOf: [
      {
        type: "object",
        properties: {
          marks: marksSchema,
          login: { type: "string", minLength: 1, maxLength: 100 },
          type: { const: TypeEnum.local },
          password: { type: "string", minLength: 1, maxLength: 100 },
        },
        required: ["marks", "type", "login", "password"],
      },
      {
        type: "object",
        properties: {
          marks: marksSchema,
          login: { type: "string", minLength: 1, maxLength: 100 },
          type: { const: TypeEnum.LDAP },
          password: { type: "null" },
        },
        required: ["marks", "type", "login", "password"],
      },
    ],
  };
  const validate = ajv.compile<ItemStored>(schema);

  const load: ItemType[] = data
    .filter(validate)
    .map((item: ItemStored, index: number) => ({
      marks: item.marks.map((m) => m.text),
      id: index,
      login: item.login,
      password: item.password,
      type: item.type,
    }));

  const items = reactive<ItemType[]>(load);

  const save = () => {
    localStorage.setItem(
      "SaaSoftStore",
      JSON.stringify(
        items
          .map((i) => ({
            marks: i.marks.map((m) => ({ text: m })),
            type: i.type,
            login: i.login,
            password: i.type === TypeEnum.LDAP ? null : i.password,
          }))
          .filter((i) => validate(i)),
      ),
    );
  };

  return {
    items,

    addEmptyItem() {
      items.push({
        id: Date.now(),
        marks: [],
        type: TypeEnum.local,
        login: "",
        password: "",
      });
    },

    remItem(item: ItemType) {
      const index = items.findIndex((i) => i == item);
      if (~index) {
        items.splice(index, 1);
        save();
      }
    },

    save,
  };
});
