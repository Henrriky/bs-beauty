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
import Notifications from '../pages/notifications'
import UserRegistration from '../pages/user-registration'
import PasswordReset from '../pages/password-reset'
import PasswordResetCompleted from '../pages/password-reset/components/PasswordResetCompleted'
import LandingPage from '../pages/landing-page'
import Roles from '../pages/roles'
import NotificationTemplates from '../pages/notification-templates'
import BlockedTimes from '../pages/blocked-times'

function BSBeautyRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/google/callback" element={<Callback />} />
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route
            path="/password-reset-completed"
            element={<PasswordResetCompleted />}
          />
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
              <Route path="/notifications" element={<Notifications />} />
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
                <Route
                  path="/manager/notification-templates"
                  element={<NotificationTemplates />}
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
                <Route path="/blocked-times" element={<BlockedTimes />} />
              </Route>

              {/* PERMISSIONS BASED ROUTES */}
              {/* Customers */}
              <Route
                element={
                  <PrivateRoute
                    strategy={'ANY'}
                    allowedPermissions={['customer.read', 'customer.delete']}
                    allowedUserTypes={[UserType.MANAGER]}
                  />
                }
              >
                <Route path="/manager/customers" element={<Customers />} />
              </Route>
              {/* Professionals */}
              <Route
                element={
                  <PrivateRoute
                    strategy={'ANY'}
                    allowedPermissions={[
                      'professional.read',
                      'professional.create',
                      'professional.delete',
                      'professional.edit',
                      'professional.manage_roles',
                    ]}
                    allowedUserTypes={[UserType.MANAGER]}
                  />
                }
              >
                <Route
                  path="/manager/professionals"
                  element={<Professionals />}
                />
              </Route>
              {/* ROLES */}
              <Route
                element={
                  <PrivateRoute
                    strategy={'ANY'}
                    allowedPermissions={[
                      'roles.read',
                      'roles.create',
                      'roles.edit',
                      'roles.delete',
                      'roles.change_permissions',
                    ]}
                    allowedUserTypes={[UserType.MANAGER]}
                  />
                }
              >
                <Route path="/manager/roles" element={<Roles />} />
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
