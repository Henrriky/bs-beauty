import { Provider } from 'react-redux'
import { store } from './store'
import { Flip, ToastContainer } from 'react-toastify'

import BSBeautyRouter from './routes'

import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div className="bg-[#1E1E1E] min-h-[100vh] flex justify-center">
      <Provider store={store}>
        <BSBeautyRouter />
        <ToastContainer
          transition={Flip}
          position="top-right"
          toastClassName={
            'bg-[#595149] text-[#D9D9D9] font-sans text-bold rounded-full font-medium pt-2'
          }
          closeButton={({ closeToast }) => (
            <button
              className="text-[#B19B86] text-lg focus:outline-none hover:text-[#D9D9D9] transition duration-300 ease-in-out right-5 top-1 absolute"
              onClick={closeToast}
            >
              ✖
            </button>
          )}
        />
      </Provider>
    </div>
  )
}

export default App
