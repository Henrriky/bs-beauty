import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Login from '../pages/login'
import Callback from '../pages/callback'
import PrivateRoute from '../pages/private-route'
import Profile from '../pages/profile'
import CompleteRegister from '../pages/complete-register'

function BSBeautyRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/google/callback" element={<Callback />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/complete-register" element={<CompleteRegister />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default BSBeautyRouter
