import { Route, Routes } from "react-router-dom"

import AdminLayout from "./components/AdminLayout"
import DashboardPage from "./pages/DashboardPage"
import AddDoctorPage from "./pages/AddDoctorPage"
import ListPage from "./pages/ListPage"
import AppointmentsPage from "./pages/AppointmentsPage"
import ServiceDashboardPage from "./pages/ServiceDashboardPage"
import AddServicePage from "./pages/AddServicePage"
import ListServicesPage from "./pages/ListServicesPage"
import ServiceAppointmentPage from "./pages/ServiceAppointmentPage"

const App = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="add-doctor" element={<AddDoctorPage />} />
        <Route path="list" element={<ListPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="service-dashboard" element={<ServiceDashboardPage />} />
        <Route path="add-service" element={<AddServicePage />} />
        <Route path="list-service" element={<ListServicesPage />} />
        <Route path="service-appointments" element={<ServiceAppointmentPage />} />
      </Route>
    </Routes>
  )
}

export default App