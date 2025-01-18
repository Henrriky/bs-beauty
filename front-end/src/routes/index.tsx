import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Login from '../pages/login'
import Callback from '../pages/callback'
import PrivateRoute from '../pages/private-route'
import Profile from '../pages/profile'
import CompleteRegister from '../pages/complete-register'
import NotFound from '../pages/not-found'
import RegistrationCompleted from '../pages/complete-register/components/RegistrationCompleted'
import ServicesPage from '../pages/services-page'
import ManagerHome from '../pages/manager-home'
import { ServiceDashboard } from '../pages/services'
import { Role } from '../store/auth/types'
import SideBar from '../components/sidebar/SideBar'
import Customers from '../pages/customers'
import CustomerHome from '../pages/home/customer-home'

function BSBeautyRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/google/callback" element={<Callback />} />
          <Route
            element={
              <PrivateRoute
                allowedRoles={[Role.MANAGER, Role.EMPLOYEE, Role.CUSTOMER]}
              />
            }
          >
            <Route element={<SideBar />}>
              <Route path="/manager/home" element={<Profile />} />
              <Route path="/customer/home" element={<CustomerHome />} />
              <Route path="/employee/home" element={<Profile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/customers" element={<Customers />} />
            </Route>
            {/* COMPLETE REGISTER ROUTES */}
            <Route path="/complete-register" element={<CompleteRegister />} />
            <Route
              path="/register-completed"
              element={<RegistrationCompleted />}
            />
            {/* MANAGER ROUTES */}
            <Route path="/manager/home" element={<ManagerHome />} />
            {/* SERVICES ROUTES */}
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/management/services" element={<ServiceDashboard />} />
            {/* SERVICES ROUTES */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default BSBeautyRouter
