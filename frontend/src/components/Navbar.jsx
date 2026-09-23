import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Logo from "../assets/logo.png";
import { useClerk, SignOutButton, useAuth, UserButton } from "@clerk/react";
import { LogIn, Menu, User, X } from "lucide-react";

const STORAGE_KEY = "doctorToken_v1";

const Navbar = () => {
  const { isSignedIn } = useAuth()
  const [isOpen, setIsOpen] = useState();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0)

  const location = useLocation();
  //const navRef = useRef();
  const clerk = useClerk();
  // const navigate = useNavigate();

  // const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(() => {
  //   try {
  //     return Boolean(localStorage.getItem(STORAGE_KEY))
  //   } catch {
  //     return false
  //   }
  // })



  const navItems = [
    { label: "Home", href: "/" },
    { label: "Doctors", href: "/doctors" },
    { label: "Services", href: "/Services" },
    { label: "Appointments", href: "/appointments" },
    { label: "Contacts", href: "/contact" },
  ];



  ///Hide and show navbar

  ///Duration 39 min

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false)
      } else {
        setShowNavbar(true)
      }

      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])
  return (

<nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="h-20 flex items-center justify-between">

      {/* ================= LOGO ================= */}
      <Link
        to="/"
        className="flex items-center gap-2 shrink-0"
      >
        <img
          src={Logo}
          alt="MediSoil logo"
          className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
        />

        <div className="leading-tight">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1976D2]">
            Medi<span className="text-[#14B8A6]">soil</span>
          </span>

          <p className="text-[10px] sm:text-xs font-medium text-gray-500 tracking-wide">
            Healthcare Solutions
          </p>
        </div>
      </Link>


      {/* ================= DESKTOP NAV ================= */}
      <div className="hidden lg:flex items-center gap-1 border border-[#14B8A6]/30 bg-white rounded-full px-2 py-2 shadow-sm">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`
                relative px-4 py-2 rounded-full text-sm font-semibold
                transition-all duration-200
                ${
                  isActive
                    ? "bg-[#14B8A6]/10 text-[#14B8A6]"
                    : "text-gray-600 hover:text-[#14B8A6] hover:bg-gray-50"
                }
              `}
            >
              {item.label}

              {isActive && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#14B8A6]" />
              )}
            </Link>
          );
        })}
      </div>


      {/* ================= RIGHT SIDE ================= */}
      <div className="flex items-center gap-3">

        {/* Desktop Authentication */}
        <div className="hidden lg:flex items-center gap-3">

          {isSignedIn ? (
            <div className="flex items-center">
              <UserButton />
            </div>
          ) : (
            <>
              {/* Doctor Admin */}
              <Link
                to="/doctor-admin/login"
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  rounded-full
                  border border-[#1976D2]/20
                  text-[#1976D2]
                  text-sm font-semibold
                  hover:bg-[#1976D2]/5
                  transition-all duration-200
                "
              >
                <User size={18} />
                <span>Doctor Admin</span>
              </Link>

              {/* Patient Login */}
              <button
                onClick={() => clerk.openSignIn()}
                className="
                  flex items-center gap-2
                  px-5 py-2.5
                  rounded-full
                  bg-[#14B8A6]
                  text-white
                  text-sm font-semibold
                  shadow-sm
                  hover:bg-[#0f9f91]
                  hover:shadow-md
                  transition-all duration-200
                "
              >
                <LogIn size={18} />
                <span>Login</span>
              </button>
            </>
          )}

        </div>


        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            lg:hidden
            w-10 h-10
            flex items-center justify-center
            rounded-full
            border border-gray-200
            text-gray-700
            hover:bg-gray-50
            transition
          "
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>
    </div>


    {/* ================= MOBILE MENU ================= */}
    <div
      className={`
        lg:hidden
        overflow-hidden
        transition-all duration-300 ease-in-out
        ${
          isOpen
            ? "max-h-[500px] opacity-100 pb-5"
            : "max-h-0 opacity-0"
        }
      `}
    >
      <div className="border-t border-gray-100 pt-4">

        {/* Mobile Nav Links */}
        <div className="flex flex-col gap-1">

          {navItems.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  px-4 py-3 rounded-xl
                  text-sm font-semibold
                  transition
                  ${
                    isActive
                      ? "bg-[#14B8A6]/10 text-[#14B8A6]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#14B8A6]"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}

        </div>


        {/* Mobile Auth */}
        {!isSignedIn && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">

            {/* Doctor Admin */}
            <Link
              to="/doctor-admin/login"
              onClick={() => setIsOpen(false)}
              className="
                w-full
                flex items-center justify-center gap-2
                px-4 py-3
                rounded-xl
                border border-[#1976D2]/20
                text-[#1976D2]
                font-semibold
                hover:bg-[#1976D2]/5
                transition
              "
            >
              <User size={18} />
              <span>Doctor Admin</span>
            </Link>


            {/* Patient Login */}
            <button
              onClick={() => {
                setIsOpen(false);
                clerk.openSignIn();
              }}
              className="
                w-full
                flex items-center justify-center gap-2
                px-4 py-3
                rounded-xl
                bg-[#14B8A6]
                text-white
                font-semibold
                shadow-sm
                hover:bg-[#0f9f91]
                transition
              "
            >
              <LogIn size={18} />
              <span>Patient Login</span>
            </button>

          </div>
        )}

      </div>
    </div>

  </div>
</nav>

  );
};

export default Navbar;
