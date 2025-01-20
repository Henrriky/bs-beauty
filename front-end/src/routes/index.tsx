import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import SideBar from '../components/sidebar/SideBar'
import Layout from '../layouts/Layout'
import Callback from '../pages/callback'
import CompleteRegister from '../pages/complete-register'
import RegistrationCompleted from '../pages/complete-register/components/RegistrationCompleted'
import Customers from '../pages/customers'
import EmployeeShifts from "../pages/employee-shifts"
import EmployeesManagement from "../pages/employees-management"
import Login from '../pages/login'
import ManagerHome from '../pages/manager-home'
import NotFound from '../pages/not-found'
import PrivateRoute from '../pages/private-route'
import Profile from '../pages/profile'
import { ServiceDashboard } from '../pages/services'
import ServicesPage from '../pages/services-page'
import { Role } from '../store/auth/types'
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
            <Route path="/manager/home" element={<ManagerHome />} />
            <Route
              path="/employees-management"
              element={<EmployeesManagement />}
            />
            <Route path="/employee-shifts" element={<EmployeeShifts />} />
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
  );
}

export default BSBeautyRouter
