import { Provider } from 'react-redux'
import { store } from './store'
import { ToastContainer } from 'react-toastify'

import BSBeautyRouter from './routes'

import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <Provider store={store}>
        <BSBeautyRouter />
        <ToastContainer />
      </Provider>
    </>
  )
}

export default App
