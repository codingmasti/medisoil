import { useAuth, useUser } from "@clerk/react";
import axios from "axios";
import {
  Bell,
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  Wallet,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GiToaster } from "react-icons/gi";

const API_BASE = "http://localhost:4000";
const API = axios.create({ baseURL: API_BASE });

//Helper functions
function pad(n) {
  return String(n ?? 0).padStart(2, "0");
}

function parseDateTime(dateStr, timeStr) {
  const fast = new Date(`${dateStr} ${timeStr}`);
  if (!isNaN(fast)) return fast;

  const parts = (dateStr || "").split(" ");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const months = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };
    const month = months[m];
    let [t, ampm] = (timeStr || "").split(" ");
    let [hh, mm] = (t || "0:00").split(":");
    hh = Number(hh || 0);
    mm = Number(mm || 0);

    if (ampm === "PM" && hh !== 12) hh += 12;
    if (ampm === "AM" && hh === 12) hh = 0;

    return new Date(Number(y), month, Number(d), hh, mm);
  }

  const iso = new Date(dateStr);
  if (!isNaN(iso)) return iso;
  return new Date();
}

function computeStatus(item) {
  const now = new Date();
  if (!item) return "Pending";

  if (item.status === "Canceled") return "Canceled";
  if (item.status === "Rescheduled") {
    if (
      item.rescheduledTo &&
      item.rescheduledTo.date &&
      item.rescheduledTo.time
    ) {
      const dt = parseDateTime(
        item.rescheduledTo.date,
        item.rescheduledTo.time,
      );
      if (now >= dt) return "Completed";
    }
    return "Rescheduled";
  }
  if (item.status === "Completed") return "Completed";
  if (item.status === "Confirmed") {
    const dtConfirmed = parseDateTime(item.date, item.time);
    if (now >= dtConfirmed) return "Completed";
    return "Confirmed";
  }
  if (item.status === "Pending") {
    const dtPending = parseDateTime(item.date, item.time);
    if (now >= dtPending) return "Completed";
    return "Pending";
  }

  const dt = parseDateTime(item.date, item.time);
  if (now >= dt) return "Completed";
  return item.confirmed ? "Confirmed" : "Pending";
}

const PaymentBadge = ({ payment }) => {
  return payment === "Online" ? (
    <span className="px-3 py-1 rounded-full font-semibold text-xs bg-green-100 text-green-700 border border-green-300 flex items-center gap-1">
      <CreditCard className="w-3" /> Online
    </span>
  ) : (
    <span className="px-3 py-1 rounded-full font-semibold text-xs bg-yellow-100 text-yellow-700 border border-yellow-300 flex items-center gap-1">
      <Wallet className="w-3" /> Cash
    </span>
  );
};

const StatusBadge = ({ itemStatus }) => {
  if (itemStatus === "Completed")
    return (
      <span className="px-3 py-1 rounded-full font-semibold text-xs bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
        <CheckCircle className="w-3" /> Completed
      </span>
    );

  if (itemStatus === "Confirmed")
    return (
      <span className="px-3 py-1 rounded-full font-semibold text-xs bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
        <Bell className="w-3" /> Confirmed
      </span>
    );

  if (itemStatus === "Pending")
    return (
      <span className="px-3 py-1 rounded-full font-semibold text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center gap-1">
        <Clock className="w-3" /> Pending
      </span>
    );

  if (itemStatus === "Canceled")
    return (
      <span className="px-3 py-1 rounded-full font-semibold text-xs bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
        <XCircle className="w-3" /> Canceled
      </span>
    );

  return (
    <span className="px-3 py-1 rounded-full font-semibold text-xs bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
      <CalendarDays className="w-3" /> Rescheduled
    </span>
  );
};

const AppointmentsPage = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  const [doctorAppts, setDoctorAppts] = useState([]);
  const [serviceAppts, setServiceAppts] = useState([]);

  const [appointmentsRaw, setAppointmentsRaw] = useState({
    doctors: [],
    services: [],
  });

  console.log("set Appointment: ", appointmentsRaw);
  const [error, setError] = useState(null);

  const loadDoctorAppointments = useCallback(async () => {
    if (!isLoaded) return;
    setLoadingDoctors(true);
    setError(null);

    let token = null;
    try {
      token = await getToken();
      console.log(
        "Clerk token (frontend):",
        token ? `${token.slice(0, 20)}...` : null,
      );
    } catch (err) {
      console.error("Failed to get Clerk token (frontend):", err);
    }

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    console.log("Outgoing headers for /api/appointments/me:", headers);

    try {
      const resp = await API.get("/api/appointments/me", { headers });
      console.log("Response from /api/appointments/me:", resp?.data);

      const fetched =
        resp?.data?.appointments ?? resp?.data?.data ?? resp?.data ?? [];
      const arr = Array.isArray(fetched) ? fetched : [];

      const doctors = arr.filter((a) => {
        return (
          (a.doctorId !== undefined && a.doctorId !== null) ||
          !!a.doctorName ||
          !a.serviceId
        );
      });

      setDoctorAppts(doctors);
      setAppointmentsRaw((p) => ({ ...p, doctors: doctors }));
    } catch (err) {
      console.error(
        "Error calling /api/appointments/me:",
        err?.response?.data || err.message || err,
      );

      if (user?.id) {
        try {
          console.log("Attempting debug request with ?createdBy=", user.id);
          const debugResp = await API.get(
            `/api/appointments/me?createdBy=${user.id}`,
            { headers },
          );
          console.log("Debug fallback response:", debugResp?.data);

          const fetched =
            debugResp?.data?.appointments ??
            debugResp?.data?.data ??
            debugResp?.data ??
            [];
          const arr = Array.isArray(fetched) ? fetched : [];
          const doctors = arr.filter(
            (a) =>
              (a.doctorId !== undefined && a.doctorId !== null) ||
              !!a.doctorName ||
              !a.serviceId,
          );
          setDoctorAppts(doctors);
          setAppointmentsRaw((p) => ({ ...p, doctors }));
        } catch (err2) {
          console.error(
            "Debug fallback failed (doctors):",
            err2?.response?.data || err2.message || err2,
          );
          setError((prev) =>
            prev
              ? prev + " | Doctors failed"
              : "Failed to load doctor appointments. Check console.",
          );
          setDoctorAppts([]);
        }
      } else {
        setError((prev) =>
          prev
            ? prev + " | No user id for doctors"
            : "Failed to load doctor appointments and no user id available for debug fallback.",
        );
        setDoctorAppts([]);
      }
    } finally {
      setLoadingDoctors(false);
    }
  }, [isLoaded, getToken, user]);

  const loadServiceAppointments = useCallback(async () => {
    if (!isLoaded) return;
    setLoadingServices(true);
    setError(null);

    let token = null;
    try {
      token = await getToken();
    } catch (err) {
      console.error("Failed to get Clerk token (frontend): err", err);
    }
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    console.log("Outgoing headers for /api/service-appointments/me:", headers);

    try {
      const resp = await API.get("/api/service-appointments/me", { headers });
      console.log("Response from /api/service-appointments/me:", resp?.data);

      const fetched =
        resp?.data?.appointments ?? resp?.data?.data ?? resp?.data ?? [];
      console.log("Feched hua kyaa :", fetched);
      const arr = Array.isArray(fetched) ? fetched : [];
      console.log("Array me kush aya kay", arr);

      setServiceAppts(arr);
      setAppointmentsRaw((p) => ({ ...p, services: arr }));
    } catch (err) {
      console.error(
        "Error calling /api/service-appointments/me:",
        err?.response?.data || err.message || err,
      );

      if (user?.id) {
        try {
          console.log("Attempting debug request with ?createdBy=", user.id);
          const debugResp = await API.get(
            `/api/service-appointments/me?createdBy=${user.id}`,
            { headers },
          );
          console.log("Call ", debugResp);
          console.log("Debug fallback response (services):", debugResp?.data);

          const fetched =
            debugResp?.data?.appointments ??
            debugResp?.data?.data ??
            debugResp?.data ??
            [];
          const arr = Array.isArray(fetched) ? fetched : [];
          setServiceAppts(arr);
          setAppointmentsRaw((p) => ({ ...p, services: arr }));
        } catch (err2) {
          console.error(
            "Debug fallback failed (services):",
            err2?.response?.data || err2.message || err2,
          );
          setError((prev) =>
            prev
              ? prev + " | Services failed"
              : "Failed to load service appointments. Check console.",
          );
          setServiceAppts([]);
        }
      } else {
        setError((prev) =>
          prev
            ? prev + " | No user id for services"
            : "Failed to load service appointments and no user id available for debug fallback.",
        );
        setServiceAppts([]);
      }
    } finally {
      setLoadingServices(false);
    }
  }, [isLoaded, getToken, user]);

  useEffect(() => {
    loadDoctorAppointments();
    loadServiceAppointments();
  }, [
    isLoaded,
    isSignedIn,
    user,
    loadDoctorAppointments,
    loadServiceAppointments,
  ]);

  function normalizeRescheduled(rt) {
    if (!rt) return null;
    if (rt.date && rt.time) return { date: rt.date, time: rt.time };
    if (
      rt.date &&
      (rt.hour !== undefined || rt.minute !== undefined || rt.ampm)
    ) {
      const hour = rt.hour ?? 0;
      const minute = rt.minute ?? 0;
      const ampm = rt.ampm ?? "";
      return { date: rt.date, time: `${hour}:${pad(minute)} ${ampm}` };
    }
    return {
      date: rt.date || rt?.dateString || "",
      time:
        rt.time ||
        (rt.hour
          ? `${rt.hour}:${pad(rt.minute || 0)} ${rt.ampm || ""}`
          : rt?.timeString || ""),
    };
  }

  const appointmentData = useMemo(() => {
    return doctorAppts
      .map((a) => {
        const id = a._id || a.id || String(a._id || "");
        const doctorObj =
          typeof a.doctorId === "object" && a.doctorId ? a.doctorId : {};
        const image =
          doctorObj.imageUrl ||
          doctorObj.image ||
          doctorObj.avatar ||
          a.doctorImage?.url ||
          a.doctorImage ||
          "";
        const doctorName =
          (doctorObj.name && String(doctorObj.name).trim()) ||
          (a.doctorName && String(a.doctorName).trim()) ||
          (a.doctor && String(a.doctor).trim()) ||
          (a.patientName && String(a.patientName).trim()) ||
          "Doctor";

        const patientName = a.patientName || a.patient || "Patient";
        const specialization =
          doctorObj.specialization || a.specialization || a.speciality || "";
        const experience = doctorObj.experience || a.experience || "";
        const date = a.date || "";
        let time = a.time || "";

        if (!time) {
          if (a.hour !== undefined && a.minute !== undefined && a.ampm) {
            time = `${a.hour}:${pad(a.minute)} ${a.ampm}`;
          } else if (a.hour !== undefined && a.ampm) {
            time = `${a.hour}:00 ${a.ampm}`;
          }
        }

        const payment = (a.payment && a.payment.method) || "Cash";
        const status =
          a.status ||
          (a.payment && a.payment.status === "Paid" ? "Confirmed" : "Pending");
        const rescheduledTo = normalizeRescheduled(
          a.rescheduledTo || {
            date: a.rescheduledDate,
            time: a.rescheduledTime,
          },
        );

        return {
          id,
          image,
          doctor: doctorName,
          patientName,
          specialization,
          experience,
          date,
          time,
          payment,
          status,
          rescheduledTo,
        };
      })
      .map((x) => ({ ...x, status: computeStatus(x) }));
  }, [doctorAppts]);

  const serviceData = useMemo(() => {
    return serviceAppts
      .map((s) => {
        const id = s._id || s.id || String(s._id || "");
        const svc =
          typeof s.serviceId === "object" && s.serviceId ? s.serviceId : {};
        const image =
          svc.imageUrl ||
          svc.image ||
          svc.imageSmall ||
          s.serviceImage?.url ||
          s.serviceImage ||
          "";
        const name = s.serviceName || svc.name || svc.title || "Service";
        const patientName = s.patientName || s.patient || "Patient";
        const price = s.fees ?? s.amount ?? s.price ?? 0;
        const date = s.date || "";
        let time = s.time || "";
        if (!time) {
          if (s.hour !== undefined && s.minute !== undefined && s.ampm) {
            time = `${s.hour}:${pad(s.minute)} ${s.ampm}`;
          } else if (s.hour !== undefined && s.ampm) {
            time = `${s.hour}:00 ${s.ampm}`;
          }
        }

        const payment = (s.payment && s.payment.method) || "Cash";
        const status =
          s.status ||
          (s.payment && s.payment.status === "Paid" ? "Confirmed" : "Pending");

        const rescheduledTo = normalizeRescheduled(s.rescheduledTo || null);

        return {
          id,
          image,
          name,
          patientName,
          price,
          date,
          time,
          payment,
          status,
          rescheduledTo,
        };
      })
      .map((x) => ({ ...x, status: computeStatus(x) }));
  }, [serviceAppts]);

  return (
    <div className="min-h-screen font-serif bg-linear-to-br from-green-50 to-emerald-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-700 text-center mb-6">
          {" "}
          Your Doctor Appointments
        </h1>
        {loadingDoctors && (
          <div className="text-center text-emerald-600 py-4">
            Loading Doctors...
          </div>
        )}
        {!loadingDoctors && appointmentData.length === 0 && (
          <div className="text-center text-emerald-600 py-4">
            No doctor appointments found.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {appointmentData.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Doctor Image */}
              <div className="flex justify-center">
                <div className="w-28 h-28 rounded-full border-4 border-emerald-300 shadow-md bg-emerald-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image || "/placeholder-doctor.png"}
                    alt={item.doctor}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Doctor Information */}
              <div className="text-center mt-4">
                <h2 className="text-lg font-bold text-emerald-900 truncate">
                  {item.doctor}
                </h2>

                <p className="text-sm text-emerald-700 mt-1 truncate">
                  {item.specialization || "General Physician"}
                  {item.experience ? ` • ${item.experience}` : ""}
                </p>
              </div>

              {/* Appointment Details */}
              <div className="mt-5 space-y-3">
                {/* Date */}
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5">
                  <CalendarDays className="w-4 h-4 text-emerald-700 shrink-0" />

                  <div className="min-w-0">
                    <p className="text-[11px] text-emerald-600 font-medium">
                      Appointment Date
                    </p>

                    <p className="text-sm font-semibold text-emerald-900 truncate">
                      {item.date || "Date not available"}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0" />

                  <div className="min-w-0">
                    <p className="text-[11px] text-emerald-600 font-medium">
                      Appointment Time
                    </p>

                    <p className="text-sm font-semibold text-emerald-900 truncate">
                      {item.time || "Time not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment + Status */}
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <PaymentBadge payment={item.payment} />
                <StatusBadge itemStatus={item.status} />
              </div>

              {/* Rescheduled Information */}
              {item.status === "Rescheduled" && item.rescheduledTo ? (
                <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 px-3 py-3 text-center">
                  <p className="text-xs text-blue-600 font-medium">
                    Rescheduled To
                  </p>

                  <p className="text-sm font-semibold text-blue-800 mt-1">
                    {item.rescheduledTo.date || "Date not available"}
                  </p>

                  <p className="text-sm font-semibold text-blue-800">
                    {item.rescheduledTo.time || "Time not available"}
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
          {" "}
          Your Booked Services
        </h2>
        {loadingServices && (
          <div className="text-center text-emerald-600 py-4">
            Loading Service Bookings...
          </div>
        )}
        {!loadingServices && serviceData.length === 0 && (
          <div className="text-center text-emerald-600 py-4">
            No Services booking found.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {serviceData.map((srv) => (
            <div
              key={srv.id}
              className="bg-white border border-blue-200 rounded-2xl p-6 shadow-md"
            >
              <div className="w-28 h-28 rounded-full border-4 border-blue-300 mx-auto bg-blue-50 flex items-center justify-center overflow-hidden">
                <img
                  src={srv.image || "/placeholder-service.png"}
                  alt={srv.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <h3 className="text-xl md:text-sm lg:text-md xl:text-lg font-semibold text-center mt-4">
                {srv.name}
              </h3>

              <p className="text-center text-green-700 font-semibold text-lg mt-2">
                ₹{srv.price}
              </p>

              <p className="mt-4 rounded-full border bg-blue-50 border-blue-200 py-1 px-3 flex justify-center gap-2 text-sm">
                <CalendarDays className="w-4" /> {srv.date}
              </p>

              <p className="mt-2 rounded-full border bg-blue-50 border-blue-200 py-1 px-3 flex justify-center gap-2 text-sm">
                <Clock className="w-4" /> {srv.time}
              </p>

              <div className="mt-4 flex justify-center gap-2">
                <PaymentBadge payment={srv.payment} />
                <StatusBadge itemStatus={srv.status} />
              </div>

              {srv.status === "Rescheduled" && srv.rescheduledTo ? (
                <div className="mt-3 text-center xl:text-md xl:whitespace-nowrap text-sm text-blue-700">
                  Rescheduled to{" "}
                  <span className="font-semibold xl:line-clamp-2">
                    {srv.rescheduledTo.date} : {srv.rescheduledTo.time}
                  </span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
