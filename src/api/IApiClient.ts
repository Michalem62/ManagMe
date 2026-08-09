// Kontrakt warstwy API. Store zna wyłącznie ten interfejs, nie konkretną implementację,
// więc podmiana localStorage na bazę w chmurze nie dotyka reszty aplikacji.
export interface IApiClient<T extends { id: number }> {
  getAll(): Promise<T[]>
  getById(id: number): Promise<T | null>
  create(data: Omit<T, 'id'>): Promise<T>
  update(item: T): Promise<T>
  delete(id: number): Promise<void>
}
