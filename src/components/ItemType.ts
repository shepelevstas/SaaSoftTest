export interface ItemType {
  id: number,
  marks: string[],
  type: 'local' | 'LDAP',
  login: string,
  password: string | null,
}
