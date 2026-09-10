import {NavLink, useNavigate } from "react-router-dom";
import { Home, UserPlus, Users, Calendar, Grid, PlusSquare, List, LogOut } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/react";


const Sidebar = () => {
    const {user} = useUser()
    const clerk = useClerk()
    const navigate = useNavigate()

    // to signout
    const handleSignOut = async ()=>{
        if(!clerk || !clerk.signOut){
            console.warn("Clerk is not available")
            return
        }
        try {
            await clerk.signOut();
        } catch (e) {
            console.error("SignOut Failed", e)
        }finally{
            localStorage.removeItem("clerk_token");
            navigate('/')
        }
    }
    return (
        <aside className="h-screen bg-white">
            <div
                tabIndex={0}
                style={{ WebkitOverflowScrolling: "touch" }}
                className="flex flex-col mx-2 mt-3">
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

                <hr className="border-t-2 w-[95%] mx-auto text-gray-700 my-4"/>

                <div className="flex p-2 gap-3">
                    <UserButton />
                    <div className="text-sm">
                        Welcome De.
                        <br /> 
                        <span className="font-medium"> {user?.fullName}</span>
                    </div>

                </div>
                
                <button
                onClick={()=> handleSignOut()}
                className="text-red-400 px-4 py-2 border-2 border-rose-300 flex gap-3 items-center justify-start rounded-lg font-medium line-clamp-1">
                    <LogOut />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}

export default Sidebar;

function CenterNavItem({ to, icon, label,onClick }) {
    return (
        <NavLink to={to} end
        onClick={onClick} 
        className={({isActive}) => `flex px-2 py-2 rounded-lg hover:border-2 border-gray-200 hover:bg-gray-100 transition-all duration-300 ease-in mb-2 gap-4 items-center justify-start text-gray-700 ${isActive ? 'text-[#1374b9]' : ''}`}>
            <span className="font-bold">{icon}</span>
            <span className="font-medium font-serif line-clamp-1">{label}</span>
        </NavLink>
    )
}