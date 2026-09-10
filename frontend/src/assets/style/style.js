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
