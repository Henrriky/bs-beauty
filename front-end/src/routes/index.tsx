import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import SideBar from '../components/sidebar/SideBar'
import Layout from '../layouts/Layout'
import Callback from '../pages/callback'
import CompleteRegister from '../pages/complete-register'
import RegistrationCompleted from '../pages/complete-register/components/RegistrationCompleted'
import Customers from '../pages/customers'
import EmployeeShifts from '../pages/employee-shifts'
import EmployeesManagement from '../pages/employees-management'
import Login from '../pages/login'
import ManagerHome from '../pages/manager-home'
import NotFound from '../pages/not-found'
import PrivateRoute from '../pages/private-route'
import Profile from '../pages/profile'
import { ServiceDashboard } from '../pages/services'
import { Role } from '../store/auth/types'
import CustomerHome from '../pages/home/customer-home'
import Appointments from '../pages/appointments'
import AppointmentDetails from '../pages/appointments/components/AppointmentsDetails'

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
              {/* CUSTOMER ROUTES */}
              <Route element={<PrivateRoute allowedRoles={[Role.CUSTOMER]} />}>
                <Route path="/customer/home" element={<CustomerHome />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route
                  path="/appointments/:appointmentId"
                  element={<AppointmentDetails />}
                />
              </Route>

              {/* EMPLOYEE ROUTES */}
              <Route element={<PrivateRoute allowedRoles={[Role.EMPLOYEE]} />}>
                <Route path="/employee/home" element={<ManagerHome />} />
              </Route>

              {/* MANAGER ROUTES */}
              <Route element={<PrivateRoute allowedRoles={[Role.MANAGER]} />}>
                <Route path="/manager/home" element={<ManagerHome />} />
                <Route path="/customers" element={<Customers />} />
                <Route
                  path="/employees-management"
                  element={<EmployeesManagement />}
                />
              </Route>

              {/* EMPLOYEE/MANAGER ROUTES */}
              <Route
                element={
                  <PrivateRoute allowedRoles={[Role.MANAGER, Role.EMPLOYEE]} />
                }
              >
                <Route
                  path="/management/services"
                  element={<ServiceDashboard />}
                />
                <Route path="/employee-shifts" element={<EmployeeShifts />} />
              </Route>

              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* COMPLETE REGISTER ROUTES */}
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
