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
  //const navigate = useNavigate();

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
    { label: "Contacts", href: "/contacts" },
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
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}


        <div className="flex gap-5">
          <div className="hidden lg:flex">
            {
              isSignedIn ? (
                <UserButton />
              ) : (
                <>
                  <SignOutButton>

                    <Link
                      to="/doctor-admin/login"
                      className="items-center justify-center gap-3"
                    >
                      <User />
                      <span>Doctor admin</span>
                    </Link>
                  </SignOutButton>
                  {/* Patient login */}
                  <button onClick={() => clerk.openSignIn()} className="px-4 py-2 rounded-full bg-[#14B8A6]">
                    <Link to="/login" className="flex items-center gap-2 text-white">
                      <LogIn className="font-bold" />
                      <span>Login</span>
                    </Link>
                  </button>
                </>
              )
            }
          </div>
          {/* <SignIn>
            <UserButton afterSignInUrl='/' />
          </SignIn> */}



          {/* Toggle  */}

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu  */}
        <div className={`absolute bg-white transition-all duration-300 w-70 border mt-100 ${isOpen ? ('ml-1/2') : ('-ml-200')}`}>
          {isOpen && (
            <div className="flex flex-col">
              {navItems.map((item, idx) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={idx} to={item.href} onClick={() => setIsOpen(!isOpen)} className={`px-3 font-medium ${isActive ? "text-[#14B8A6]" : ""} `}>
                    {item.label}
                  </Link>
                );
              })}

              <button onClick={() => setIsOpen(false)}>
                <Link
                  to="/doctor-admin/login"
                  className="flex items-center justify-center gap-3"
                >
                  <User />
                  <span>Doctor admin</span>
                </Link>
              </button>
              {/* Patient login */}
              <button className="px-4 py-2 flex rounded-full bg-[#14B8A6]" onClick={() => {
                setIsOpen(false);
                clerk.openSignIn()
              }}>
                <Link to="/login" className="flex items-center gap-2 text-white">
                  <LogIn className="font-bold" />
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
