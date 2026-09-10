import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Settings, Bell, Menu, X } from "lucide-react";
import { useAuth, useClerk, UserButton, useUser } from "@clerk/react";
import Logo from "../assets/logo.png"
import Sidebar from "./Sidebar"


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [toggleSearch, setToggleSearch] = useState(false)
    const inputToggleRef = useRef(null);
    const inputRef = useRef(null);
    //const location = useLocation();
    const navigate = useNavigate()

    const { isLoaded: authLoaded, isSignedIn, getToken } = useAuth();
    const { isLoaded: userLoaded } = useUser();
    const clerk = useClerk();


    /// when user signed in, fetch a token and save it in localstorage

    useEffect(() => {
        let mounted = true;
        const storeToken = async () => {
            if (!authLoaded || !userLoaded) return;
            if (!isSignedIn) {
                try {
                    localStorage.removeItem("clerk_token")
                } catch {
                    //ignore any error
                }
                return;
            }

            try {
                if (getToken) {
                    const token = await getToken();
                    if (!mounted) return;
                    if (token) {
                        try {
                            localStorage.setItem("clerk_token", token)
                        } catch (er) {
                            console.warn("Failed to write clerk token in localStorage", er)
                        }
                    }
                }
            } catch (e) {
                console.warn("Could not retrieve Clerk Token", e)
            }
        }
        storeToken();
        return () => { mounted = false }

    }, [isSignedIn, authLoaded, userLoaded, getToken]);

    //to open clerk login box
    const handleOpenSignIn = () => {
        if (!clerk || !clerk.openSignIn) {
            console.warn("Clerk is not available");
            return;
        }
        clerk.openSignIn();
        navigate("/admin");
    }

    /// handle search click
    const handleSearchClick = () => {
        inputRef.current?.focus();
    }
    /// handle search click for mobile menu
    const handleSearchClickMobile = () => {
        inputToggleRef.current?.focus();
        setToggleSearch(!toggleSearch)
    }

    return (
        <header className="w-full h-22 bg-white">
            <nav className="max-w-6xl mx-auto flex items-center justify-between relative">
                <div className="flex items-center justify-center">
                    <img src={Logo} alt="logo" width={100} height={100} />
                    <div>
                        <span className=" text-2xl lg:text-3xl font-bold text-[#1976D2]">
                            Medi<span className="text-[#14B8A6]">soil</span>
                        </span>
                        <p className="text-sm font-serif">Healthcare Solutions</p>
                    </div>
                </div>

                {/* center navigation */}

                <div
                    onClick={handleSearchClick}
                    className="w-[50%] hidden h-13 border-2 bg-gray-50 border-gray-200 md:flex items-center rounded-lg gap-2">
                    <span className="p-2 text-gray-700"><Search /></span>
                    <input ref={inputRef} type="text" placeholder="Search hear..." className="w-full h-full outline-none" />

                </div>
                {isSignedIn ? (
                    <div className="w-[12%] border-2 border-gray-200 h-13 rounded-lg items-center text-gray-700 mr-2 flex justify-evenly">
                        <Search onClick={handleSearchClickMobile} className="flex md:hidden" />
                        <Settings className="hidden lg:flex" />
                        <Bell className="hidden md:flex" />
                        <div className="hidden lg:flex"> <UserButton /></div>

                        {/* Toggol mobile menue */}
                        <button
                            className="flex lg:hidden"
                            onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? (<X size={18} />) : (<Menu size={18} />)}
                        </button>
                    </div>
                ) : (
                    <button onClick={() => handleOpenSignIn()} className="px-4 py-2 rounded-full bg-[#14B8A6]">
                        <Link to="/login" className="flex items-center gap-2 text-white">
                            <span>Login</span>
                        </Link>
                    </button>
                )}
                {/* mobile menu  */}
                {isOpen && <div
                    className="w-full absolute -mb-170">
                    <Sidebar />
                </div>}

                {/* Floating search bar */}
                {
                    toggleSearch &&
                    (<div className="w-[70%] border flex flex-col absolute h-30 bg-white mt-50 mx-auto ml-[17%] rounded-lg">
                        <div className="w-full flex justify-end">
                            <div
                                onClick={() => setToggleSearch(!toggleSearch)}
                                className="flex w-10 h-10 mt-2 mr-2 items-center justify-center border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-700">
                                <X />
                            </div>
                        </div>

                        <div className="flex justify-between h-10 w-[90%] mx-auto mb-5 mt-5" >
                            <input
                                ref={inputToggleRef} type="text"
                                placeholder="Search hear..."
                                className="w-[60%] h-full outline-none border-2 border-gray-200 rounded-lg pl-2" />
                            <button className="px-3 py-2 w-[30%] bg-blue-300 rounded-lg">Search</button>
                        </div>
                    </div>)}
            </nav>
        </header>
    )
}

export default Navbar;

