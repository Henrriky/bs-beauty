import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { store } from '../store'

type RootState = ReturnType<typeof store.getState>

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default useAppSelector
