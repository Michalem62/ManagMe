// Pojedyncza wartość w storage (np. id aktywnego projektu) — to nie jest kolekcja encji,
// więc nie pasuje do IApiClient i dostaje własną, prostszą klasę.
export class StorageValue<T> {
  constructor(private readonly storageKey: string) {}

  async get(): Promise<T | null> {
    const raw = localStorage.getItem(this.storageKey)

    if (!raw) return null

    return JSON.parse(raw) as T
  }

  async set(value: T): Promise<void> {
    localStorage.setItem(this.storageKey, JSON.stringify(value))
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.storageKey)
  }
}
