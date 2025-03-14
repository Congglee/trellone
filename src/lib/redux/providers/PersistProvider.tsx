import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from '~/lib/redux/store'

export default function PersistProvider({ children }: { children?: React.ReactNode }) {
  return (
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  )
}
