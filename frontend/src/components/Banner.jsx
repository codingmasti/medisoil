import {
  Calendar,
  Clock,
  Phone,
  Ribbon,
  ShieldUser,
  Star,
  Stethoscope,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Hero_img from "../assets/image/heros_img.jpg";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="relative w-full max-w-7xl mx-auto my-10 sm:my-12 px-4">
      {/* Animated Border */}
      <div className="relative rounded-3xl overflow-hidden p-[2px]">
        {/* Rotating Gradient Border */}
        <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_250deg,#22c55e_290deg,#10b981_320deg,#22c55e_350deg,transparent_360deg)] animate-[spin_4s_linear_infinite]" />

        {/* Main Card */}
        <div className="relative z-10 bg-white rounded-[22px] overflow-hidden">
          <div className="px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-12 lg:py-14">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
              {/* ================= LEFT CONTENT ================= */}
              <div className="flex-1 w-full text-center lg:text-left">
                {/* Logo + Icon */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-5">
                  {/* Icon */}
                  <div className="shrink-0 bg-gradient-to-br from-green-400 to-emerald-600 p-3.5 rounded-2xl shadow-lg rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
                    <Stethoscope className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>

                  {/* Logo */}
                  <div>
                    <h1 className="font-[Pacifico] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-800">
                      Medi
                      <span className="text-transparent bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text">
                        soil+
                      </span>
                    </h1>

                    {/* Stars */}
                    <div className="flex justify-center lg:justify-start gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                <div className="mb-6">
                  <p className="text-xl sm:text-2xl md:text-3xl font-light text-gray-700 leading-tight">
                    Premium Healthcare
                  </p>

                  <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-green-600 mt-1">
                    At Your Fingertips
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7 max-w-2xl mx-auto lg:mx-0">
                  {/* Certified Specialists */}
                  <div className="flex items-center justify-center lg:justify-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 px-4 py-3 rounded-xl shadow-sm">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-green-500 flex items-center justify-center">
                      <Ribbon className="w-5 h-5 text-white" />
                    </div>

                    <span className="text-sm sm:text-base text-gray-700 font-semibold">
                      Certified Specialists
                    </span>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-center lg:justify-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 px-4 py-3 rounded-xl shadow-sm">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>

                    <span className="text-sm sm:text-base text-gray-700 font-semibold">
                      24/7 Availability
                    </span>
                  </div>

                  {/* Safe & Secure */}
                  <div className="flex items-center justify-center lg:justify-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 px-4 py-3 rounded-xl shadow-sm">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-green-500 flex items-center justify-center">
                      <ShieldUser className="w-5 h-5 text-white" />
                    </div>

                    <span className="text-sm sm:text-base text-gray-700 font-semibold">
                      Safe & Secure
                    </span>
                  </div>

                  {/* Doctors */}
                  <div className="flex items-center justify-center lg:justify-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 px-4 py-3 rounded-xl shadow-sm">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>

                    <span className="text-sm sm:text-base text-gray-700 font-semibold">
                      500+ Doctors
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  {/* Book Appointment */}
                  <button
                    onClick={() => navigate("/doctors")}
                    className="group relative overflow-hidden inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                  >
                    {/* Shine */}
                    <span className="absolute inset-0 -translate-x-full -skew-x-12 bg-white/20 group-hover:translate-x-full transition-transform duration-700" />

                    <span className="relative z-10 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Book Appointment Now
                    </span>
                  </button>

                  {/* Emergency */}
                  <button
                    onClick={() => (window.location.href = "tel:2899431275")}
                    className="inline-flex items-center justify-center gap-2 border-2 border-red-300 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-lg text-sm sm:text-base"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Emergency Call</span>
                  </button>
                </div>
              </div>

              {/* ================= RIGHT IMAGE ================= */}
              <div className="flex-1 w-full flex justify-center">
                <div className="relative w-full max-w-lg">
                  {/* Decorative Background */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-green-100 via-emerald-50 to-transparent rounded-[2rem] blur-2xl opacity-70" />

                  {/* Image Container */}
                  <div className="relative rounded-3xl overflow-hidden border border-emerald-100 shadow-xl bg-emerald-50">
                    <img
                      src={Hero_img}
                      alt="MediSoil Healthcare"
                      className="w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:bottom-5 bg-white/95 backdrop-blur-md border border-white rounded-2xl shadow-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <ShieldUser className="w-5 h-5 text-green-600" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Trusted Healthcare
                        </p>

                        <p className="text-sm font-bold text-gray-800">
                          Safe & Secure Care
                        </p>
                      </div>
                    </div>
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
