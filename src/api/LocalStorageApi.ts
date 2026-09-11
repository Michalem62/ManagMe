import type { IApiClient } from './IApiClient'

export class LocalStorageApi<T extends { id: number }> implements IApiClient<T> {
  private readonly nextIdKey: string

  constructor(private readonly storageKey: string) {
    this.nextIdKey = `${storageKey}:nextId`
  }

  async getAll(): Promise<T[]> {
    const raw = localStorage.getItem(this.storageKey)

    if (!raw) return []

    return JSON.parse(raw) as T[]
  }

  async getById(id: number): Promise<T | null> {
    const items = await this.getAll()

    return items.find((item) => item.id === id) ?? null
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const items = await this.getAll()
    const created = { ...data, id: this.getNextId(items) } as T

    items.push(created)
    this.save(items)

    return created
  }

  async update(item: T): Promise<T> {
    const items = await this.getAll()
    const index = items.findIndex((existing) => existing.id === item.id)

    if (index === -1) {
      throw new Error(`[${this.storageKey}] Nie znaleziono elementu o id ${item.id}`)
    }

    items[index] = item
    this.save(items)

    return item
  }

  async delete(id: number): Promise<void> {
    const items = await this.getAll()

    this.save(items.filter((item) => item.id !== id))
  }

  private save(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items))
  }

  private getNextId(items: T[]): number {
    const storedId = Number(localStorage.getItem(this.nextIdKey)) || 0
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0)
    const nextId = Math.max(storedId, maxId) + 1

    localStorage.setItem(this.nextIdKey, String(nextId))

    return nextId
  }
}
