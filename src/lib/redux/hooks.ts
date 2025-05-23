import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import { AppDispatch, RootState } from '~/lib/redux/store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
