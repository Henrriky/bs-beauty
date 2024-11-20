import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { ToastContainer } from 'react-toastify'

import Layout from './layouts/Layout'
import Callback from './pages/callback'
import PrivateRoute from './pages/private-route'

import 'react-toastify/dist/ReactToastify.css'
import Profile from './pages/profile'
import Login from './pages/login'
import CompleteRegister from './pages/complete-register'

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index path="/login" element={<Login />} />
              <Route path="/auth/google/callback" element={<Callback />} />
              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/complete-register"
                  element={<CompleteRegister />}
                />
              </Route>
            </Route>
          </Routes>
        </Router>
        <ToastContainer />
      </Provider>
    </>
  )
}

export default App
