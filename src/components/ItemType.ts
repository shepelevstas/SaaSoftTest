export const enum TypeEnum {
  local = 'local',
  LDAP = 'LDAP',
}

export interface ItemType {
  id: number,
  marks: string[],
  type: TypeEnum,
  login: string,
  password: string | null,
}
