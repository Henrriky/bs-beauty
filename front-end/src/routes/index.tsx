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
import ServicesPage from '../pages/services-page'
import ManagerHome from '../pages/manager-home'
import EmployeesManagement from "../pages/employees-management";
import EmployeeShifts from "../pages/employee-shifts";

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
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/manager/home" element={<ManagerHome />} />
            <Route
              path="/employees-management"
              element={<EmployeesManagement />}
            />
            <Route path="/employee-shifts" element={<EmployeeShifts />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default BSBeautyRouter
