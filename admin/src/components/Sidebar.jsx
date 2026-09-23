import Logo from "../assets/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  UserPlus,
  Users,
  Calendar,
  Grid,
  PlusSquare,
  List,
  LogOut,
} from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/react";

const Sidebar = () => {
  const { user } = useUser();
  const clerk = useClerk();
  const navigate = useNavigate();

  // Sign out
  const handleSignOut = async () => {
    if (!clerk || !clerk.signOut) {
      console.warn("Clerk is not available");
      return;
    }

    try {
      await clerk.signOut();
    } catch (e) {
      console.error("SignOut Failed", e);
    } finally {
      localStorage.removeItem("clerk_token");
      navigate("/");
    }
  };

  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">

      {/* ================= LOGO / BRAND ================= */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">
              <img src={Logo} alt="" />
            </span>
          </div>

          <div className="leading-tight">
            <h1 className="text-xl font-bold text-[#1976D2]">
              Medi<span className="text-[#14B8A6]">soil</span>
            </h1>

            <p className="text-[10px] font-medium text-gray-400 tracking-wide">
              ADMIN PANEL
            </p>
          </div>
        </div>
      </div>


      {/* ================= NAVIGATION ================= */}
      <div
        tabIndex={0}
        style={{ WebkitOverflowScrolling: "touch" }}
        className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-gray-200"
      >

        {/* Main Navigation */}
        <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Main Menu
        </p>

        <CenterNavItem
          to="/admin"
          label="Dashboard"
          icon={<Home size={18} />}
        />

        <CenterNavItem
          to="/admin/add-doctor"
          label="Add Doctor"
          icon={<UserPlus size={18} />}
        />

        <CenterNavItem
          to="/admin/list"
          label="List Doctor"
          icon={<Users size={18} />}
        />

        <CenterNavItem
          to="/admin/appointments"
          label="Appointments"
          icon={<Calendar size={18} />}
        />


        {/* Services */}
        <p className="px-3 mt-6 mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Services
        </p>

        <CenterNavItem
          to="/admin/service-dashboard"
          label="Service Dashboard"
          icon={<Grid size={18} />}
        />

        <CenterNavItem
          to="/admin/add-service"
          label="Add Service"
          icon={<PlusSquare size={18} />}
        />

        <CenterNavItem
          to="/admin/list-service"
          label="List Services"
          icon={<List size={18} />}
        />

        <CenterNavItem
          to="/admin/service-appointments"
          label="Service Appointments"
          icon={<Calendar size={18} />}
        />

      </div>


      {/* ================= USER SECTION ================= */}
      <div className="border-t border-gray-100 p-4 bg-gray-50/70">

        <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-white border border-gray-100">

          <div className="shrink-0">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </div>

          <div className="min-w-0 leading-tight">
            <p className="text-[11px] text-gray-400 font-medium">
              Welcome Dr.
            </p>

            <p
              className="text-sm font-semibold text-gray-800 truncate"
              title={user?.fullName || ""}
            >
              {user?.fullName || "Doctor"}
            </p>
          </div>

        </div>


        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="
            w-full
            flex items-center justify-center gap-2
            px-4 py-2.5
            rounded-xl
            border border-rose-200
            bg-white
            text-rose-500
            text-sm font-semibold
            hover:bg-rose-50
            hover:border-rose-300
            hover:text-rose-600
            transition-all duration-200
          "
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;


function CenterNavItem({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) => `
        group
        relative
        flex items-center gap-3
        w-full
        px-3 py-2.5
        mb-1
        rounded-xl
        text-sm
        font-medium
        transition-all duration-200

        ${
          isActive
            ? "bg-gradient-to-r from-[#1976D2]/10 to-[#14B8A6]/10 text-[#1374b9]"
            : "text-gray-600 hover:bg-gray-50 hover:text-[#1374b9]"
        }
      `}
    >

      {/* Active Indicator */}
      <span
        className={`
          absolute left-0 top-1/2 -translate-y-1/2
          w-1 h-6
          rounded-r-full
          transition-all duration-200
          ${
            location.pathname === to
              ? "bg-[#14B8A6]"
              : "bg-transparent"
          }
        `}
      />

      <span className="shrink-0 flex items-center justify-center">
        {icon}
      </span>

      <span className="truncate">
        {label}
      </span>

    </NavLink>
  );
}

