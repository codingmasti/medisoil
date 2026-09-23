import React, { useState } from "react";
import Logo from "../assets/logo.png";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { toastStyles } from "../assets/styles/style";

const STORAGE_KEY = "doctorToken_v1";

const Login = () => {
  const API_BASE = "http://localhost:4000";
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((s) => ({
      ...s,
      [e.target.name]: e.target.value,
    }));
  };

  //To Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("All fields are require.", {
        style: toastStyles.errorToast,
      });
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/doctors/login`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(formData),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(json?.message || "Login failed", { duration: 4000 });
        setBusy(false);
        return;
      }

      const token = json?.token || json?.data?.token;
      if (!token) {
        toast.error("Authentication token missing");
        setBusy(false);
        return;
      }

      const doctorId = json?.data?._id || json?.doctor?._id || json?.data?.doctor?._id;

      console.log(doctorId)
      if (!doctorId) {
        toast.error("Doctor ID missing from server response");
        setBusy(false);
        return;
      }

      localStorage.setItem(STORAGE_KEY, token);
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: token }),
      );

      toast.success("Login successful — redirecting...", {
        style: toastStyles.successToast
      });

      setTimeout(() => {
        navigate(`/doctor-admin/${doctorId}`);
      }, 700);
    } catch (err) {
      console.error("login error", err);
      toast.error("Network error during login");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-emerald-100 to-green-200 relative font-serif overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 cursor-pointer flex items-center gap-2 text-green-800 font-semibold hover:text-green-600 transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5" /> Back to home
      </button>

      <div className="relative z-10 bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-[90%] max-w-md border border-green-200 transition-all duration-500 hover:shadow-green-300/50">
        <div className="flex justify-center mb-6">
          <img
            src={Logo}
            alt="logo"
            className="w-28 h-28 object-contain drop-shadow-lg"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-emerald-700 tracking-wide mb-2">
          Doctor Admin
        </h2>
        <p className="text-center text-green-600 mb-6 text-sm">
            Sign in to manage your profile & schedule
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange}
            className="w-full px-5 py-3 rounded-full border border-green-300 bg-white/80" 
            required/>

            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}
            className="w-full px-5 py-3 rounded-full border border-green-300 bg-white/80" 
            required/>

            <button type="submit" disabled={busy} className="w-full py-3 bg-linear-to-r from-emerald-400 to-green-600 text-white font-semibold rounded-full">
                {busy ? "Signing in..." : "Login"}
            </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
