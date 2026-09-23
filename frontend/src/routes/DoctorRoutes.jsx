
import { Route, Routes } from 'react-router-dom'
import DHome from '../doctor/doctor-pages/DHome'
import Login from '../pages/Login'
import ListPage from '../doctor/doctor-pages/ListPage'
import EditProfilePage from '../doctor/doctor-pages/EditProfilePage'

const DoctorRoutes = () => {
  return (
    <Routes> 
        <Route path='/doctor-admin/login' element={<Login />}/>
        <Route path='/doctor-admin/:id' element={<DHome />}/>
        <Route path='/doctor-admin/:id/appointments' element={<ListPage />}/>
        <Route path='/doctor-admin/:id/profile/edit' element={<EditProfilePage />} />
    </Routes>
  )
}

export default DoctorRoutes
