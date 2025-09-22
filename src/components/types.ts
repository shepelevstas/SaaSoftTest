export enum TypeEnum {
  local = "Локальная",
  LDAP = "LDAP",
}

export type TypeKeys = keyof typeof TypeEnum;

export interface ItemType {
  id: number;
  marks: string[];
  type: TypeEnum;
  login: string;
  password: string | null;
}

interface MarkItem {
  text: string;
}

export interface ItemStored {
  marks: MarkItem[];
  type: TypeEnum;
  login: string;
  password: string | null;
}
