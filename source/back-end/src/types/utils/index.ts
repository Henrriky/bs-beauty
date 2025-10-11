export type ValueOf<T> = T extends Record<string, infer U> ? U : never
