
import { useAuth } from "@clerk/react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Hero from "./Hero";
import { Outlet } from "react-router-dom";




const AdminLayout = () => {
    const { isSignedIn } = useAuth()
    return (
        <section className="bg-gray-100">
            <Navbar />

            <div className="max-w-6xl h-screen overflow-hidden mx-auto">

                {
                    isSignedIn ? (<div className="flex justify-between mt-2">
                        <div className="w-[20%] hidden lg:flex bg-white rounded-lg overflow-hidden border-2 border-gray-100">
                            <Sidebar />
                        </div>

                        {/* Main body  */}
                        <div className="w-full h-screen overflow-scroll lg:w-[79%] bg-white shadow-2xl rounded-lg overflow-hidden">
                            <Outlet />
                        </div>
                    </div>
                    ) : (
                        <div className="w-full h-[85vh] mt-20 md:mt-10 lg:mt-0 flex items-center justify-center">
                            <Hero />
                        </div>
                    )
                }
            </div>
        </section>
    )
};

export default AdminLayout;

