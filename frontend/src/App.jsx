
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './layout/Layout'
import DoctorsPage from './pages/DoctorsPage'
import DoctorDetailPage from './pages/DoctorDetailPage'
import ServicePage from './pages/ServicePage'
import ServiceDetail from './pages/ServiceDetail'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/doctors' element={<DoctorsPage />}/>
          <Route path='/doctors/:id' element={<DoctorDetailPage />}/>
          <Route path='/services' element={<ServicePage />} />
          <Route path='/services/:id' element={<ServiceDetail />} />
        </Route>

      </Routes>
    </>
  )
}

export default App
