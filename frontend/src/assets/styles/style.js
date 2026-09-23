export const certificationStyle = {
  // Animation keyframes and class (to be added via style tag)
  animationStyles: `
    @keyframes marquee-single {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-33.333%);
      }
    }
    .animate-marquee-single {
      animation: marquee-single 60s linear infinite;
    }
  `,
};

export const homeDoctorStyles = {
  customCSS: `
    /* keep your shadow look consistent */
    .shadow-md { box-shadow: 0 6px 18px rgba(14, 30, 37, 0.06); }
    .shadow-2xl { box-shadow: 0 18px 50px rgba(14, 30, 37, 0.12); }

    /* optional: slightly reduce spacing on very small devices for compactness */
    @media (max-width: 420px) {
      .max-w-7xl { padding-left: 12px; padding-right: 12px; }
    }
  `,
};

export const testimonialsStyles = {
  animationStyles: `
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* subtle responsive tweaks */
    @media (max-width: 640px) {
      .min-h-[70vh] { min-height: auto; }
    }
    
    /* Respect reduced motion */
    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; transition: none !important; }
    }
  `,
};

export const serviceDetailStyles = {
  paymentOption: (isSelected) =>
    `px-3 py-1 rounded-full cursor-pointer border ${isSelected ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-100"}`,
  paymentInput: "hidden",

  dateButton: (isSelected) =>
    `px-5 py-2 rounded-full cursor-pointer border transition whitespace-nowrap min-w-[140px] sm:min-w-0 ${isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-100"}`,

  timeButton: (isSelected) =>
    `px-5 py-2 rounded-full cursor-pointer border transition whitespace-nowrap min-w-[140px] sm:min-w-0 flex items-center gap-2 ${isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-100"}`,

  submitButton: (isValid, isSubmitting) =>
    `w-full py-4 md:mb-8 rounded-full cursor-pointer text-lg font-semibold flex items-center justify-center gap-3 transition ${isValid && !isSubmitting ? "bg-linear-to-br from-emerald-500 to-green-500 text-white shadow-lg hover:opacity-90" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`,
};

export const contactPageStyle = {
  animationKeyframes: `
    .animate-spin-slow {
      animation: spin 15s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
};

export const toastStyles = {
  errorToast: {
    borderRadius: "12px",
    background: "#fff",
    color: "#14532d",
    border: "1px solid #86efac",
    boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
  },
  successToast: {
    borderRadius: "12px",
    background: "#ecfdf5",
    color: "#065f46",
    border: "1px solid #6ee7b7",
    boxShadow: "0 4px 15px rgba(16,185,129,0.3)",
    fontWeight: "600",
  },
};

export const navbarStylesDr = {
  mobileMenuContainer: (isOpen) =>
    `lg:hidden fixed top-30 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-white/95 backdrop-blur-md border border-emerald-100 rounded-2xl shadow-lg transform origin-top transition-all duration-200 ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 -translate-y-2 pointer-events-none"}`,
};




export const editProfilePageStyle = {
  imageEditButton: (editing) =>
    `absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer transition-transform ${!editing && "cursor-not-allowed"}`,
  imageEditIcon: (editing) =>
    `w-5 h-5 ${editing ? "text-emerald-600" : "text-gray-400"}`,
  statAmberIcon: (field) => {
    if (field === "star") return "w-5 h-5 text-amber-500 fill-amber-500";
    return "w-4 h-4 text-amber-600";
  },
  availabilityToggle: (isAvailable) =>
    `flex items-center gap-3 px-4 sm:px-5 py-2 rounded-full cursor-pointer border-2 shadow-sm transition-all duration-300 ${isAvailable ? "bg-linear-to-r from-emerald-50 to-emerald-100 border-emerald-300 hover:shadow-emerald-200" : "bg-linear-to-r from-gray-50 to-gray-100 border-gray-300 hover:shadow-gray-200"} hover:shadow-lg w-full sm:w-auto`,
  toggleTrack: (isAvailable) =>
    `relative w-10 h-5 rounded-full transition-colors ${isAvailable ? "bg-emerald-500" : "bg-gray-400"}`,
  toggleThumb: (isAvailable) =>
    `absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isAvailable ? "left-6" : "left-0.5"}`,
  toggleText: (isAvailable) =>
    `font-medium ${isAvailable ? "text-emerald-700" : "text-gray-600"}`,
  fieldIconContainer: (editing) =>
    `p-2 rounded-full ${editing ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`,
  inputBase: (editing) =>
    `w-full rounded-full border-2 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base transition-all duration-200 ${editing ? "border-emerald-200 bg-emerald-50/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 focus:bg-white" : "border-gray-200 bg-gray-50/50 text-gray-600 cursor-not-allowed"}`,

  // About textarea
  aboutTextarea: (editing) =>
    `w-full rounded-xl border-2 px-4 py-3 text-sm sm:text-base transition-all duration-200 ${editing ? "border-emerald-200 bg-emerald-50/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 focus:bg-white" : "border-gray-200 bg-gray-50/50 text-gray-600 cursor-not-allowed"}`,

  dateDeleteButton: (editing) =>
    `p-2 rounded-full cursor-pointer transition-colors ${editing ? "hover:bg-rose-50 text-rose-500 hover:text-rose-600" : "text-gray-400 cursor-not-allowed"}`,

  timeSlotDeleteButton: (editing) =>
    `p-1.5 rounded-full cursor-pointer transition-colors ${editing ? "hover:bg-rose-50 text-rose-500 hover:text-rose-600" : "text-gray-400 cursor-not-allowed"}`,

  saveMessage: (type) =>
    `px-4 py-2 rounded-lg ${type === "saving" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`,

  customCSS: `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
  `,
};
