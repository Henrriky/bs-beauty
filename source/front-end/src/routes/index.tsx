import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import SideBar from '../components/sidebar/SideBar'
import Layout from '../layouts/Layout'
import Callback from '../pages/callback'
import CompleteRegister from '../pages/complete-register'
import RegistrationCompleted from '../pages/complete-register/components/RegistrationCompleted'
import Customers from '../pages/customers'
import Shifts from '../pages/shifts'
import Professionals from '../pages/professionals'
import Login from '../pages/login'
import ManagerHome from '../pages/home/manager-professional-home'
import NotFound from '../pages/not-found'
import PrivateRoute from '../pages/private-route'
import Profile from '../pages/profile'
import { ServiceDashboard } from '../pages/services'
import { UserType } from '../store/auth/types'
import CustomerHome from '../pages/home/customer-home'
import Appointments from '../pages/appointments'
import AppointmentDetails from '../pages/appointments/components/AppointmentsDetails'
import PaymentRecords from '../pages/payments'
import PaymentRecordDetails from '../pages/payments/components/PaymentRecordDetails'

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
                allowedUserTypes={[
                  UserType.MANAGER,
                  UserType.PROFESSIONAL,
                  UserType.CUSTOMER,
                ]}
              />
            }
          >
            <Route element={<SideBar />}>
              {/* ALL ROLES ROUTES */}
              <Route path="/appointments" element={<Appointments />} />
              <Route
                path="/appointments/:appointmentId"
                element={<AppointmentDetails />}
              />

              {/* CUSTOMER ROUTES */}
              <Route
                element={
                  <PrivateRoute allowedUserTypes={[UserType.CUSTOMER]} />
                }
              >
                <Route path="/customer/home" element={<CustomerHome />} />
              </Route>

              {/* PROFESSIONAL ROUTES */}
              <Route
                element={
                  <PrivateRoute allowedUserTypes={[UserType.PROFESSIONAL]} />
                }
              >
                <Route path="/professional/home" element={<ManagerHome />} />
              </Route>

              {/* MANAGER ROUTES */}
              <Route
                element={<PrivateRoute allowedUserTypes={[UserType.MANAGER]} />}
              >
                <Route path="/manager/home" element={<ManagerHome />} />
                <Route path="/manager/customers" element={<Customers />} />
                <Route
                  path="/manager/professionals"
                  element={<Professionals />}
                />
              </Route>

              {/* PROFESSIONAL/MANAGER ROUTES */}
              <Route
                element={
                  <PrivateRoute
                    allowedUserTypes={[UserType.MANAGER, UserType.PROFESSIONAL]}
                  />
                }
              >
                <Route path="/services" element={<ServiceDashboard />} />
                <Route path="/shifts" element={<Shifts />} />
                <Route path="/payments" element={<PaymentRecords />} />
                <Route
                  path="/payments/:paymentRecordId"
                  element={<PaymentRecordDetails />}
                />
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
