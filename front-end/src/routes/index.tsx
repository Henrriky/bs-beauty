import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Login from '../pages/login'
import Callback from '../pages/callback'
import PrivateRoute from '../pages/private-route'
import Profile from '../pages/profile'
import CompleteRegister from '../pages/complete-register'
import NotFound from '../pages/not-found'
import RegistrationCompleted from '../pages/complete-register/components/RegistrationCompleted'
import MenuLayout from '../layouts/MenuLayout'

function BSBeautyRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/google/callback" element={<Callback />} />
          <Route element={<PrivateRoute />}>
            <Route element={<MenuLayout />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/complete-register" element={<CompleteRegister />} />
            <Route
              path="/register-completed"
              element={<RegistrationCompleted />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default BSBeautyRouter
