import { Routes,Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { CircleChevronUp } from "lucide-react";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorDetailPage from "./pages/DoctorDetailPage";
import ServicePage from "./pages/ServicePage";
import ServiceDetail from "./pages/ServiceDetail";
import AppointmentsPage from "./pages/AppointmentsPage";
import ContactPage from "./pages/ContactPage";
import DoctorLayout from "./layout/DoctorLayout";
import DHome from "./doctor/doctor-pages/DHome";
import ListPage from "./doctor/doctor-pages/ListPage";
import EditProfilePage from "./doctor/doctor-pages/EditProfilePage";
import Login from "./pages/Login";
import VerifyPaymentPage from "../VerifyPaymentPage";
import VerifyServicePaymentPage from "../VerifyServicePaymentPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
};

//scroll button
const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollTop}
      className={`fixed right-4 buttom-6 z-50 w-11 h-11 rounded-full flex items-center justify-center bg-emerald-600 text-white shadow-lg transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 "} hover:scale-110 hover:shadow-xl`}
      title="Go To Top"
    >
      <CircleChevronUp size={22} />
    </button>
  );
};

const App = () => {
  //to lock horizontal overflow for all pages

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
      document.documentElement.style.overflowX = "auto";
    };
  }, []);
  return (
    <div>
      <ScrollToTop />
      <div className="overflow-x-hidden bg-white text-gray-900">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/:id" element={<DoctorDetailPage />} />
            <Route path="/services" element={<ServicePage />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Doctor Login Route  */}
          <Route path="/doctor-admin/login" element={<Login />} />

          {/* For Doctor role  */}
          <Route path="/doctor-admin/:id" element={<DoctorLayout />}>
            <Route index element={<DHome />} />
            <Route
              path="/doctor-admin/:id/appointments"
              element={<ListPage />}
            />
            <Route
              path="/doctor-admin/:id/profile/edit"
              element={<EditProfilePage />}
            />
          </Route>

          {/* For the payment veryfication  */}
          <Route path="/appointment/success" element={<VerifyPaymentPage />} />
          <Route path="/appointment/cancel" element={<VerifyPaymentPage />} />

          <Route
            path="/service-appointment/success"
            element={<VerifyServicePaymentPage />}
          />
          <Route
            path="/service-appointment/cancel"
            element={<VerifyServicePaymentPage />}
          />
        </Routes>
      </div>
      <ScrollButton />
    </div>
  );
};

export default App;
