export type Params = {
  id: number
  title: string
}

export type Data = {
  users: {
    id: number
    name: string
    sex: 'boy' | 'girl'
  }[]
}
