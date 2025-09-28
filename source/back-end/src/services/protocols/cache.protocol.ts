export interface Cache {
  get<T = unknown>(key: string): Promise<T | null>

  set<T = unknown>(
    key: string,
    value: T,
    options?: { timeToLiveSeconds?: number; onlyIfNotExists?: boolean }
  ): Promise<boolean>

  delete(key: string): Promise<void>

  incr(key: string): Promise<number>

  ttl(key: string): Promise<number | null>

  withLock<T>(
    lockKey: string,
    lockTimeToLiveSeconds: number,
    task: () => Promise<T>
  ): Promise<T>
}
