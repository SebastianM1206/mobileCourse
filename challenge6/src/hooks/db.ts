import Dexie, { Table } from 'dexie'

export interface FruitRecord {
  id?: number
  nombre: string
  proveedor: string
  fechaCosecha: string
  createdAt?: string
}

class AppDexie extends Dexie {
  fruits!: Table<FruitRecord, number>

  constructor() {
    super('challenge6DB')
    this.version(1).stores({
      fruits: '++id, nombre, proveedor, fechaCosecha, createdAt'
    })
  }
}

const db = new AppDexie()

export default db
