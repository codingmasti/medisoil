import { Calendar, Clock, Phone, Ribbon, ShieldUser, Star, Stethoscope, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Hero_img from '../assets/image/hero_img.jpg'

const Banner = () => {
    const navigate = useNavigate();
    return (
        <div className="relative w-full max-w-7xl mx-auto my-12 px-4">

            {/* Animated Border */}
            <div className="relative rounded-3xl overflow-hidden p-[3px]">

                {/* Rotating gradient */}
                <div className="absolute inset-[-100%] bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 animate-[spin_3s_linear_infinite]" />

                {/* Content */}
                <div className="relative z-10 bg-white rounded-3xl">
                    <div className="p-6 sm:p-8 md:p-10 lg:p-12">

                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

                            <div className="flex-1 text-center lg:text-left">

                                <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start mb-4 lg:mb-6 gap-4">

                                    {/* Icon */}
                                    <div className="bg-gradient-to-br from-green-300 to-emerald-600 p-3 rounded-full shadow-lg -rotate-6 hover:rotate-0 transition-transform duration-300">
                                        <Stethoscope className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Logo */}
                                    <div className="font-[Pacifico]">
                                        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">
                                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-1">
                                                Medi
                                                <span className="text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                                                    soil+
                                                </span>
                                            </h1>

                                            {/* stars */}
                                            <div className="flex items-center justify-center lg:justify-start mt-1">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" key={star} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                </div>
                                {/* tagline */}
                                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-700 mb-5 leading-tight">
                                    Premium Healthcare <span className="block text-green-600 font-semibold">At your Fingertips</span>
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-sm sm:text-base">
                                    <div className="flex items-center justify-center lg:justify-start bg-linear-to-br from-green-500 to-green-200 backdrop-blur-sm p-3 rounded-full shadow-sm border border-green-100">
                                        <Ribbon className="w-5 h-5 text-white mr-3" />
                                        <span className="text-gray-700 font-medium">Certified Specialists</span>
                                    </div>

                                    <div className="flex items-center justify-center lg:justify-start bg-linear-to-br from-green-500 to-green-200 backdrop-blur-sm p-3 rounded-full shadow-sm border border-blue-100">
                                        <Clock className="w-5 h-5 text-white mr-3" />
                                        <span className="text-gray-700 font-medium">24/7 Availability</span>
                                    </div>

                                    <div className="flex items-center justify-center lg:justify-start bg-linear-to-br from-green-500 to-green-200 backdrop-blur-sm p-3 rounded-full shadow-sm border border-emerald-100">
                                        <ShieldUser className="w-5 h-5 text-white mr-3" />
                                        <span className="text-gray-700 font-medium">Safe & Secure</span>
                                    </div>

                                    <div className="flex items-center justify-center lg:justify-start bg-linear-to-br from-green-500 to-green-200 backdrop-blur-sm p-3 rounded-full shadow-sm border border-purple-100">
                                        <Users className="w-5 h-5 text-white mr-3" />
                                        <span className="text-gray-700 font-medium">500+ Doctors</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                                    <button
                                        onClick={() => navigate("/doctors")}
                                        className="group relative lg:whitespace-nowrap bg-gradient-to-r from-green-500 to-emerald-300 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold transition-all duration-300 shadow-2xl hover:shadow-3xl overflow-hidden text-sm sm:text-base"
                                    >
                                        {/* ✨ Only shine animation */}
                                        <div className="absolute inset-0 -translate-x-full -skew-x-12 bg-white/20 transition-transform duration-1000 group-hover:translate-x-full" />

                                        {/* Button Content - DOES NOT MOVE */}
                                        <div className="relative z-10 flex items-center justify-center gap-2">
                                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span>Book Appointment Now</span>
                                        </div>
                                    </button>
                                    <button onClick={() => (window.location.href = "tel:2899431275")} className="group border-2 lg:whitespace-nowrap border-red-400 text-red-600 bg-red-300 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold transform transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:bg-red-400/80 text-sm sm:text-base">
                                        <div className="flex items-center justify-center gap-2">
                                            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span>Emergency Call</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 relative w-full">
                                <div className="relative w-full max-w-md mx-auto">
                                    <div className="relative transform transition-transform duration-500 overflow-hidden rounded-xl">
                                        <img src={Hero_img} alt="hero image" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Banner;