import {
  Mail,
  MailBadge,
  MapPin,
  MessageSquare,
  Phone,
  PhoneCall,
  SendHorizonal,
  Stethoscope,
  User,
} from "lucide-react";
import { useState } from "react";
import { contactPageStyle } from "../assets/styles/style";

const ContactPage = () => {
  const initial = {
    name: "",
    email: "",
    phone: "",
    department: "",
    service: "",
    message: "",
  };

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const departments = [
    "General Physician",
    "Cardiology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
    "Gynecology",
  ];

  const servicesMapping = {
    "General Physician": [
      "General Consultation",
      "Adult Checkup",
      "Vaccination",
      "Health Screening",
    ],
    Cardiology: [
      "ECG",
      "Echocardiography",
      "Stress Test",
      "Heart Consultation",
    ],
    Orthopedics: ["Fracture Care", "Joint Pain Consultation", "Physiotherapy"],
    Dermatology: ["Skin Consultation", "Allergy Test", "Acne Treatment"],
    Pediatrics: ["Child Checkup", "Vaccination (Child)", "Growth Monitoring"],
    Gynecology: ["Antenatal Care", "Pap Smear", "Ultrasound"],
  };

  const genericServices = [
    "General Consultation",
    "ECG",
    "Blood Test",
    "X-Ray",
    "Ultrasound",
    "Physiotherapy",
    "Vaccination",
  ];

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(form.phone))
      e.phone = "Phone number must be exactly 10 digits";

    if (!form.department && !form.service) {
      e.department = "Please choose a department or service";
      e.service = "Please choose a department or service";
    }

    if (!form.message.trim()) e.message = "Please write a short message";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "department") {
      setForm((prev) => ({ ...prev, department: value, service: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: undefined }));

    if (name === "department" || name === "service") {
      setErrors((prev) => {
        const copy = { ...prev };
        if (
          (name === "department" && value) ||
          (name === "service" && value) ||
          form.department ||
          form.service
        ) {
          delete copy.department;
          delete copy.service;
        }
        return copy;
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const text = `*Contact Request*\nName: ${form.name}\nEmail: ${
      form.email
    }\nPhone: ${form.phone}\nDepartment: ${
      form.department || "N/A"
    }\nService: ${form.service || "N/A"}\nMessage: ${form.message}`;

    const url = `https://wa.me/918303163911?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");

    setForm(initial);
    setErrors({});
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  const availableServices = form.department
    ? servicesMapping[form.department] || []
    : genericServices;
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-100 via-white to-emerald-50 py-12 px-4 sm:px-6 md:px-8 lg:px-20 font-serif relative overflow-hidden">
      <div className="hidden md:block absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full blur-3xl opacity-18 animate-pulse"></div>
      <div className="hidden lg:block absolute bottom-0 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-10 animate-spin-slow"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
        <div className="relative bg-white/60 backdrop-blur-sm shadow-2xl rounded-3xl border border-emerald-200 p-6 sm:p-8 md:p-10 transition-all">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-800 mb-2">
            Contact Our Clinic
          </h2>

          <p className="text-sm sm:text-md text-emerald-700 mb-6 italic">
            Fill the form - we'll open WhatsApp so you can connect with us
            instantly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name  */}
              <div>
                <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2">
                  <User size={16} /> Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 mt-1 border border-emerald-300 bg-emerald-50/40 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-shadow text-sm sm:text-base"
                />
                {errors.name && (
                  <p className="text-xs text-rose-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email  */}
              <div>
                <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2">
                  <Mail size={16} /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 mt-1 border border-emerald-300 bg-emerald-50/40 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-shadow text-sm sm:text-base"
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/*Phone + Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2">
                  <Phone size={16} /> Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className="w-full px-4 py-2 mt-1 border border-emerald-300 bg-emerald-50/40 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-shadow text-sm sm:text-base"
                  maxLength="10"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2">
                  <MapPin size={16} /> Department
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border border-emerald-300 bg-emerald-50/40 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-shadow text-sm sm:text-base"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-xs text-rose-500 mt-1">
                    {errors.department}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2">
                <Stethoscope size={16} /> Service
              </label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border border-emerald-300 bg-emerald-50/40 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-shadow text-sm sm:text-base"
              >
                <option value="">
                  Select Service (or choose Department above)
                </option>
                {availableServices.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {errors.service && (
                <p className="text-xs text-rose-500 mt-1">{errors.service}</p>
              )}
            </div>
            <div>
              <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2">
                <MessageSquare size={16} /> Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Describe your concern briefly..."
                rows={4}
                className="w-full px-4 py-2 mt-1 border border-emerald-300 bg-emerald-50/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-shadow text-sm sm:text-base"
              />

              {errors.message && (
                <p className="text-xs text-rose-500 mt-1">{errors.message}</p>
              )}
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <button
                type="submit"
                className="w-full md:w-auto flex items-center gap-2 justify-center bg-emerald-600 text-white px-5 py-2 rounded-full shadow-lg transition-transform active:scale-95"
              >
                <SendHorizonal size={18} /> <span>Send via WhatsApp</span>
              </button>
              {sent && (
                <p className="text-emerald-700 italic text-sm animate-pulse">
                  Opening WhatsApp and clearing form...
                </p>
              )}
            </div>
          </form>
        </div>

        {/* right side */}

        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-4 sm:p-6 shadow-xl border border-emerald-100">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Visit Our Clinic
            </h3>
            <p className="text-sm sm:text-md">
              GomtiNagar, Locknow, Uttar Pradesh
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm sm:text-md">
              <PhoneCall size={16} /> 8399421358
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm sm:text-md">
              <MailBadge size={16} /> info@ourclinic.com
            </p>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.460792853461!2d80.98709187529213!3d26.870382662861033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2ae3cea2421%3A0x6c0de12e8a77818f!2sGomti%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1731769000000!5m2!1sen!2sin"
            className="w-full h-56 sm:h-64 md:h-72 lg:h-72 rounded-3xl shadow-2xl border-2 border-emerald-200 hover:shadow-emerald-400 transition-all duration-500"
            title="Gomti Nagar Map"
            loading="lazy"
            allowFullScreen
          ></iframe>

          <div className="bg-linear-to-br from-emerald-200 to-emerald-100 rounded-2xl p-4 shadow-inner border border-emerald-300">
            <h4 className="text-lg sm:text-xl font-semibold mb-1">Clinic</h4>
            <p className="text-gray-700 text-sm sm:text-md"> Mon - Sat: 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>
      <style>{contactPageStyle.animationKeyframes}</style>
    </div>
  );
};

export default ContactPage;
