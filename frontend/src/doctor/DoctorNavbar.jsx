import { Calendar, Edit, Home, LogOut, X, Menu } from "lucide-react";
import React, { useMemo, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import Logo from "../assets/logo.png";
import { navbarStylesDr } from "../assets/styles/style";

const DoctorNavbar = () => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const location = useLocation();

  //use params first else extract from the pathname
  const doctorId = useMemo(() => {
    if (params?.id) return params.id;
    const m = location.pathname.match(/\/doctor-admin\/([^/]+)/);
    if (m) return m[1];
    return null;
  }, [params, location.pathname]);

  const basePath = doctorId
    ? `/doctor-admin/${doctorId}`
    : "/doctor-admin/login";

  const navItems = [
    { name: "Dashboard", to: `${basePath}`, Icon: Home },
    { name: "Appointments", to: `${basePath}/appointments`, Icon: Calendar },
    { name: "Edit Profile", to: `${basePath}/profile/edit`, Icon: Edit },
  ];
  return (
    <>
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-100 w-full md:max-w-2xl lg:max-w-4xl px-4 py-0 rounded-full bg-white/80 backdrop-blur-md border border-emerald-100 shadow-2xl flex items-center justify-between gap-3 font-serif transition-all duration-300 hover:shadow-emerald-200/80 hover:-translate-y-0.5">
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 flex items-center justify-center rounded-full transform transition-all duration-300 hover:rotate-1 overflow-hidden">
            <img
              src={Logo}
              alt="logo"
              className="w-full h-full object-contain p-1"
            />
          </div>

          <div className="md:block">
            <div className="text-3xl text-emerald-700 font-semibold tracking-wide">
              Medisoil
            </div>
            <div className="text-xs text-emerald-600">Healthcare Solutions</div>
          </div>
        </div>

        {/* Desktop Navigations  */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-2 px-2">
            {navItems.map(({ name, to, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === basePath}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 transform ${isActive ? "bg-emerald-600 text-white shadow-lg scale-105 ring-2 ring-emerald-200" : "text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 hover:-translate-y-0.5 hover:shadow"}`
                }
                onClick={() => setOpen(false)}
              >
                <span className="relative flex items-center gap-2">
                  <Icon size={16} className="opacity-90" />
                </span>
                <span className="text-[13px]">{name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              window.location.href = "/doctor-admin/login";
            }}
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white text-emerald-700 border border-emerald-200 shadow-sm text-sm font-semibold transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5"
          >
            <LogOut size={16} /> Logout
          </button>

          {/* to toggle  */}
          <button className="flex lg:hidden" onClick={() => setOpen((s) => !s)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div className={navbarStylesDr.mobileMenuContainer(open)}>
        <div className="flex flex-col p-3 gap-2">
          {navItems.map(({ name, to, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === basePath}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${isActive ? "bg-emerald-50 text-emerald-900" : "text-emerald-800 hover:bg-emerald-50"}`
              }
              onClick={() => setOpen(false)}
            >
              <span className="relative flex items-center gap-2">
                <Icon size={1} className="text-emerald-400" />
              </span>
              <span className="text-[13px]">{name}</span>
            </NavLink>
          ))}

          <button
            onClick={() => {
              window.location.href = "/doctor-admin/login";
            }}
            className="mt-2 px-4 py-2 rounded-full text-center bg-emerald-500 text-white font-semibold text-sm shadow-sm transition-transform duration-150 hover:scale-105 w-full"
          >
            <div className="flex items-center justify-center gap-2">
              <LogOut size={18} /> Logout
            </div>
          </button>
        </div>
      </div>

      <div className="h-20 lg:h-20"></div>
    </>
  );
};

export default DoctorNavbar;
