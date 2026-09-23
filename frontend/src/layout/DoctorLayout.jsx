import React from 'react'
import DoctorNavbar from '../doctor/DoctorNavbar'
import { Outlet } from 'react-router-dom'

const DoctorLayout = () => {
  return (
    <div>
      <DoctorNavbar/>
      <Outlet />
    </div>
  )
}

export default DoctorLayout
