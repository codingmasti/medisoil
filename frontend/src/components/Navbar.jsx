import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import Logo from "../assets/logo.png";
import { CiLogin } from "react-icons/ci";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState()
  const navItems = [
    { lable: "Home", href: "/" },
    { lable: "Doctors", href: "/doctors" },
    { lable: "Services", href: "/Services" },
    { lable: "Appointments", href: "/appointments" },
    { lable: "Contacts", href: "/contacts" },
  ];



  ///Hide and show navbar

  ///Duration 39 min

  useEffect(()=>{
    const handleScroll = ()=>{
      const currentScrollY = window.scrollY;
      if(currentScrollY > lastScrollY && currentScrollY > 80){
             setShowNavbar(false)
      }else{
        setShowNavbar(true)
      }

      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, {passive: true})
    return ()=> window.removeEventListener("scroll", handleScroll)
  },[lastScrollY])
  return (
    <nav className="border-b border-gray-200 drop-shadow-sm">
      <div className="max-w-6xl h-22 flex items-center justify-between mx-auto relative">
        <div className="flex items-center justify-center">
          <img src={Logo} alt="logo" width={100} height={100} />
          <div>
            <span className="text-3xl font-bold text-[#1976D2]">
              Medi<span className="text-[#14B8A6]">soil</span>
            </span>
            <p>Healthcare Solutions</p>
          </div>
        </div>

        {/* Ceneter NavLinks  */}
        <div className="border border-[#14B8A6] rounded-full px-6 h-12 hidden lg:flex items-center shadow-xl">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 font-medium ${isActive ? "text-[#14B8A6]" : ""}`}
              >
                {item.lable}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex gap-5">
          <button className="hidden lg:flex">
            <Link
              to="/doctor-admin/login"
              className="flex items-center justify-center gap-3"
            >
              <FaRegUser />
              <span>Doctor admin</span>
            </Link>
          </button>
          <button className="px-4 py-2 hidden lg:flex rounded-full bg-[#14B8A6]">
            <Link to="/login" className="flex items-center gap-2 text-white">
              <CiLogin className="font-bold" />
              <span>Login</span>
            </Link>
          </button>

          {/* Toggle  */}

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
            {isOpen ? <RxCross2 /> : <RxHamburgerMenu />}
          </button>
        </div>

        {/* Mobile Menu  */}
        <div className={`absolute bg-white transition-all duration-300 w-70 border mt-100 ${isOpen ? ('ml-1/2'):('-ml-200')}`}>
          {isOpen && (
            <div className="flex flex-col">
              {navItems.map((item, idx) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={idx} to={item.href} onClick={()=> setIsOpen(!isOpen)} className={`px-3 font-medium ${isActive ? "text-[#14B8A6]" : ""} `}>
                    {item.lable}
                  </Link>
                );
              })}

              <button onClick={()=> setIsOpen(false)}>
            <Link
              to="/doctor-admin/login"
              className="flex items-center justify-center gap-3"
            >
              <FaRegUser />
              <span>Doctor admin</span>
            </Link>
          </button>
          <button className="px-4 py-2 flex rounded-full bg-[#14B8A6]" onClick={()=> setIsOpen(false)}>
            <Link to="/login" className="flex items-center gap-2 text-white">
              <CiLogin className="font-bold" />
              <span>Login</span>
            </Link>
          </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
