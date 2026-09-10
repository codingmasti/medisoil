export const doctorStyle = {
  filterButton: (isActive, color) => {
    const base =
      "text-xs px-3 cursor-pointer py-1 rounded-full transition border";
    if (color === "emerald") {
      return isActive
        ? `${base} bg-emerald-600 text-white border-emerald-600`
        : `${base} bg-white text-emerald-700 border-emerald-200`;
    } else if (color === "red") {
      return isActive
        ? `${base} bg-red-600 text-white border-red-600`
        : `${base} bg-white text-red-600 border-red-100`;
    }
    return base;
  },

  availabilityBadge: (isAvailable) =>
    `ml-0 sm:ml-2 mt-2 sm:mt-0 inline-flex items-center gap-2 text-xs font-medium px-2 py-0.5 rounded-full ${
      isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
    }`,
  availabilityDot: (isAvailable) =>
    `w-2 h-2 rounded-full ${isAvailable ? "bg-emerald-600" : "bg-red-600"}`,

  doctorDetails: "text-sm text-emerald-600 truncate mt-2 sm:mt-1",

  ratingContainer: "flex items-center gap-3 mt-3 sm:mt-0 sm:ml-4",
  rating: "text-sm text-emerald-700 flex items-center gap-1",
  toggleButton: (isOpen) =>
    `p-2 rounded-full cursor-pointer bg-white shadow-sm transform transition ${
      isOpen ? "rotate-180" : "rotate-0"
    }`,
};

export const keyframesStyles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px) scale(.995); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

export const statusClasses = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "confirmed")
    return "bg-cyan-50 text-cyan-700 border border-cyan-100";
  if (s === "completed")
    return "bg-emerald-50 text-emerald-700 border border-emerald-100";
  if (s === "rescheduled")
    return "bg-yellow-50 text-yellow-700 border border-yellow-100";
  if (s === "canceled" || s === "cancelled")
    return "bg-rose-50 text-rose-700 border border-rose-100";
  // default: pending
  return "bg-emerald-50 text-emerald-700 border border-emerald-100";
};

export const pageStyle = {
  cancelButton: (isDisabled, isCompleted) =>
    `px-3 py-2 cursor-pointer rounded-full text-sm flex items-center gap-2 transition ${
      isDisabled
        ? "bg-rose-50 text-rose-400 opacity-60 cursor-not-allowed"
        : "bg-rose-50 text-rose-700 hover:scale-105"
    }`,
};

export const serviceDashboardStyle = {
  button: (hasServicesProp) =>
    `px-3 py-1 rounded-full text-sm ${
      hasServicesProp
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : "bg-white text-emerald-600 border border-emerald-200 hover:shadow-sm"
    }`,

  headerTextLg: (span) => `col-span-${span} text-center text-xs font-medium`,
  desktopCell: (span) => `col-span-${span}`,
  desktopCenterCell: (span) => `col-span-${span} text-center`,
  mobileStatItem: (color = "emerald") =>
    `flex items-center gap-2 bg-${color}-50 px-2 py-1 rounded-full ring-1 ring-${color}-100`,
};

export const addServiceStyle = {
  iconContainer: (type) => {
    const styles = {
      error: "bg-linear-to-r from-red-100 to-orange-100 text-red-600",
      info: "bg-linear-to-r from-blue-100 to-cyan-100 text-blue-600",
      success: "bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-600",
    };
    return `flex items-center justify-center w-10 h-10 rounded-full ${styles[type] || styles.success}`;
  },

  container: (hasError) =>
    `w-full rounded-2xl p-4 ${
      hasError
        ? "border-2 border-red-200 bg-linear-to-b from-red-50 to-orange-50"
        : "bg-linear-to-b from-emerald-50 to-teal-50 border border-emerald-100"
    } shadow-inner flex flex-col items-center gap-4`,
  customCSS: `
    @keyframes slideIn {
      from {
        transform: translateX(12px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .animate-slideIn {
      animation: slideIn 300ms ease both;
    }

    .max-h-44::-webkit-scrollbar,
    .max-h-36::-webkit-scrollbar,
    .overflow-auto::-webkit-scrollbar {
      height: 6px;
      width: 6px;
    }
    .max-h-44::-webkit-scrollbar-thumb,
    .max-h-36::-webkit-scrollbar-thumb,
    .overflow-auto::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0.08);
      border-radius: 9999px;
    }
  `,

  slots: {
    container: (hasError) =>
      `bg-linear-to-br from-white to-emerald-50 rounded-2xl p-4 ${
        hasError ? "border-2 border-red-200" : "border border-emerald-50"
      } shadow-sm`,
  },
  instructions: {
    container: (hasError) =>
      `mt-3 space-y-2 ${
        hasError ? "ring-2 ring-red-100 rounded-xl p-2" : ""
      } max-h-44 overflow-auto pr-2`,
  },

  formFields: {
    input: (hasError) =>
      `mt-2 w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 shadow-md transition-all ${
        hasError
          ? "border-2 border-red-200"
          : "border border-emerald-100 focus:ring-emerald-200"
      }`,
    textarea: (hasError) =>
      `mt-2 w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 shadow-md resize-none transition-all ${
        hasError
          ? "border-2 border-red-200"
          : "border border-emerald-100 focus:ring-emerald-200"
      }`,
  },
};

export const serviceAppointmentStyles = {
  cancelButton: (isLocked) =>
    `px-3 py-1 rounded-full text-sm border ${
      isLocked
        ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
        : "bg-white text-rose-600 border-rose-200 hover:shadow-sm"
    }`,

  animatedBorderStyle: `
    .animated-border { position: relative; }
    .animated-border::before {
      content: '';
      position: absolute;
      inset: -1px;
      z-index: 0;
      border-radius: 1rem;
      padding: 1px;
      background: linear-gradient(90deg, rgba(16,185,129,0.12), rgba(236,253,245,0.10), rgba(16,185,129,0.12));
      background-size: 200% 100%;
      filter: blur(8px);
      opacity: 0.95;
      transition: opacity .3s ease;
      animation: shift 6s linear infinite;
    }
    .animated-border .card-inner { position: relative; z-index: 1; }
    @keyframes shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  `,

  // StatusSelect component styles
  statusSelect: (terminal) =>
    `text-sm cursor-pointer px-3 py-1 rounded-full border focus:outline-none transition ${
      terminal
        ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200"
        : "bg-white text-emerald-800 border-emerald-400"
    }`,

  // RescheduleButton component styles
  rescheduleButton: (terminal) =>
    `text-sm px-3 py-1 rounded-full cursor-pointer border transition ${
      terminal
        ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
        : "bg-white text-emerald-800 border-emerald-400 hover:shadow-sm"
    }`,
};
