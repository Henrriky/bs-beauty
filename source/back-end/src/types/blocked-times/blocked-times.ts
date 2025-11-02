export interface BlockedTimesUseCaseFilters {
  reason?: string
}

export interface BlockedTimesRepositoryFilters extends BlockedTimesUseCaseFilters {
  professionalId?: string
}
