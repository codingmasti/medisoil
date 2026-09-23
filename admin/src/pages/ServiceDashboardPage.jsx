import { useEffect, useMemo, useRef, useState } from "react";
import { serviceDashboardStyle } from "../assets/style";
import {
  BadgeIndianRupee,
  Calendar,
  CheckCircle,
  ClipboardList,
  Search,
  XCircle,
} from "lucide-react";
import StatsCard from "../components/StatsCard";

//Normalize the backend data that is coming  from the DB
function normalizeService(doc) {
  if (!doc) return null;
  const id = doc._id || doc.id || String(Math.random()).slice(2);
  const name = doc.name || doc.title || doc.serviceName || "Untitled Service";
  const price =
    Number(doc.price ?? doc.fee ?? doc.fees ?? doc.cost ?? doc.amount) || 0;
  const image =
    doc.imageUrl ||
    doc.image ||
    doc.avatar ||
    `https://i.pravatar.cc/150?u=${id}`;
  // various possible stat shapes
  const totalAppointments =
    doc.totalAppointments ??
    doc.appointments?.total ??
    doc.count ??
    doc.stats?.total ??
    doc.bookings ??
    0;
  const completed =
    doc.completed ??
    doc.appointments?.completed ??
    doc.stats?.completed ??
    doc.completedAppointments ??
    0;
  const canceled =
    doc.canceled ??
    doc.appointments?.canceled ??
    doc.stats?.canceled ??
    doc.canceledAppointments ??
    0;

  return {
    id,
    name,
    price,
    image,
    totalAppointments: Number(totalAppointments) || 0,
    completed: Number(completed) || 0,
    canceled: Number(canceled) || 0,
    raw: doc,
  };
}

const ServiceDashboardPage = ({ services: servicesProp = null }) => {
  const API_BASE = "http://localhost:4000";
  const [services, setServices] = useState(
    Array.isArray(servicesProp) ? servicesProp.map(normalizeService) : [],
  );
  const [loading, setLoading] = useState(!Array.isArray(servicesProp));
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const mountedRef = useRef(true);
  const fetchingRef = useRef(false);
  const pollHandleRef = useRef(null);

  //helper functions to fetch options
  function buildFetchOptions() {
    const opts = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const token = localStorage.getItem("authToken");
    if (token) opts.headers["Authorization"] = `Bearer ${token}`;
    return opts;
  }

  //fetch the service from the server side
  async function fetchServices({ showLoading = true } = {}) {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      if (showLoading) {
        setLoading(true);
        setError(null);
      }

      const url = `${API_BASE}/api/service-appointments/stats/summary`;
      const res = await fetch(url, buildFetchOptions());
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body?.message || `Failed to fetch services (${res.status})`,
        );
      }
      const body = await res.json();

      let list = [];
      if (Array.isArray(body)) list = body;
      else if (Array.isArray(body.services)) list = body.services;
      else if (Array.isArray(body.data)) list = body.data;
      else if (Array.isArray(body.items)) list = body.items;
      else {
        const maybeArray = Object.values(body).find((v) => Array.isArray(v));
        if (maybeArray) list = maybeArray;
      }

      const normalized = (list || []).map(normalizeService).filter(Boolean);
      if (mountedRef.current) {
        setServices(normalized);
        setError(null);
      }
    } catch (err) {
      console.error("Service fetch error:", err);
      if (mountedRef.current) {
        setError(err.message || "Failed to load services");
      }
    } finally {
      if (mountedRef.current && showLoading) setLoading(false);
      fetchingRef.current = false;
    }
  }
  useEffect(() => {
    window.refreshServices = () => fetchServices({ showLoading: true });
    return () => {
      try {
        delete window.refreshServices;
      } catch {
        //ignore any error
      }
    };
  }, []);

  //makes sure that services are present
  useEffect(() => {
    mountedRef.current = true;
    if (Array.isArray(servicesProp)) {
      setServices(servicesProp.map(normalizeService));
      setLoading(false);
      return () => {
        mountedRef.current = false;
      };
    }

    fetchServices({ showLoading: true });

    //a polling while tab is visible
    function startPolling() {
      if (pollHandleRef.current) return;
      pollHandleRef.current = setInterval(() => {
        if (document.visibilityState === "visible")
          fetchServices({ showLoading: false });
      }, 10000);
    }

    function stopPolling() {
      if (pollHandleRef.current) {
        clearInterval(pollHandleRef.current);
        pollHandleRef.current = null;
      }
    }

    startPolling();

    function onFocus() {
      fetchServices({ showLoading: false });
    }
    window.addEventListener("focus", onFocus);

    function onServicesUpdated() {
      fetchServices({ showLoading: false });
    }
    window.addEventListener("services:updated", onServicesUpdated);

    //refres the local storage
    function onStorage(e) {
      if (e?.key === "service_bookings_updated") {
        fetchServices({ showLoading: false });
      }
    }
    window.addEventListener("storage", onStorage);

    //also refresh tha tab when becomes visible
    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        fetchServices({ showLoading: false });
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      mountedRef.current = false;
      stopPolling();
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("services:updated", onServicesUpdated);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [servicesProp]);

  //filtering + searching...
  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return services;
    const qNum = Number(q);
    return services.filter((s) => {
      if (s.name.toLowerCase().includes(q)) return true;
      if (!Number.isNaN(qNum) && s.price <= qNum) return true;
      if (s.price.toString().includes(q)) return true;
      return false;
    });
  }, [services, searchQuery]);

  const INITIAL_COUNT = 8;
  const visibleServices = showAll
    ? filteredServices
    : filteredServices.slice(0, INITIAL_COUNT);

  const totals = useMemo(() => {
    return filteredServices.reduce(
      (acc, s) => {
        acc.totalServices += 1;
        acc.totalAppointments += s.totalAppointments;
        acc.totalCompleted += s.completed;
        acc.totalCanceled += s.canceled;
        acc.totalEarning += s.completed * s.price;
        return acc;
      },
      {
        totalServices: 0,
        totalAppointments: 0,
        totalCompleted: 0,
        totalCanceled: 0,
        totalEarning: 0,
      },
    );
  }, [filteredServices]);

  function formatCurrency(v) {
    return `₹${Number(v || 0).toLocaleString()}`;
  }
  return (
    <div className="min-h-screen font-serif p-4 sm:p-6 bg-linear-to-b from-emerald-50 via-emerald-25 to-white">
      <div className="max-w-7xl mx-auto">
        {/* header  */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center md:items-center justify-between mb-6 gap-3 md:gap-6 lg:gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-emerald-800">
              Service Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              Overview of services, appointments and earnings
            </p>
          </div>

          {/* Refresh  */}
          <div className="mt-3 sm:mt-0 flex items-center gap-3">
            <div className="text-xs text-slate-600">
              {loading
                ? "Loading..."
                : `${filteredServices.length} services${filteredServices.length !== 1 ? "s" : ""}`}
            </div>

            <button
              onClick={() => {
                if (Array.isArray(servicesProp)) return;
                fetchServices({ showLoading: true });
              }}
              className={serviceDashboardStyle.button(
                Array.isArray(servicesProp),
              )}
              title={
                Array.isArray(servicesProp)
                  ? "Service provided by parent component"
                  : "Refresh"
              }
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-wrap gap-4 mb-6">
          <StatsCard
            icon={<ClipboardList size={18} />}
            mainText="Total Services"
            iconColor="#15803D"
            iconBgColor="#DCFCE7"
            value={totals.totalServices}
          />

          <StatsCard
            icon={<Calendar size={18} />}
            mainText="Total Appointments"
            iconColor="#1D4ED8"
            iconBgColor="#DBEAFE"
            value={totals.totalAppointments}
          />

          <StatsCard
            icon={<BadgeIndianRupee size={18} />}
            mainText="Total Earnings"
            iconColor="#B45309"
            iconBgColor="#FEF3C7"
            value={formatCurrency(totals.totalEarning)}
          />

          <StatsCard
            icon={<CheckCircle size={18} />}
            mainText="Completed"
            iconColor="#047857"
            iconBgColor="#D1FAE5"
            value={totals.totalCompleted}
          />

          <StatsCard
            icon={<XCircle size={18} />}
            mainText="Canceled"
            iconColor="#DC2626"
            iconBgColor="#FEE2E2"
            value={totals.totalCanceled}
          />
        </div>

        {/* search bar  */}

        <div className="mb-6 flex justify-start">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-200 w-full sm:w-64">
            <Search size={16} className="text-emerald-700" />
            <input
              type="text "
              placeholder="Search Services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm outline-none"
            />

            {searchQuery.length > 0 && (
              <XCircle
                size={16}
                className="text-red-500 cursor-pointer"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
        </div>

        {/* tablet list view  */}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-b border-transparent">
          <div className="hidden md:grid lg:hidden grid-cols-5 items-center gap-6 px-4 py-3 text-sm text-gray-600 bg-emerald-50">
            <div className="text-center text-xs font-medium">Service</div>
            <div className="text-center text-xs font-medium">Appointments</div>
            <div className="text-center text-xs font-medium">Completed</div>
            <div className="text-center text-xs font-medium">Canceled</div>
            <div className="text-center text-xs font-medium">Earning</div>
          </div>

          {/* Desktop view  */}
          <div className="hidden lg:grid md:text-xs lg:text-xs xl:text-md grid-cols-12 items-center gap-4 px-4 py-3 text-sm text-gray-600 bg-emerald-50">
            <div className="col-span-5">Service</div>
            <div className="col-span-2">Price</div>
            <div className={serviceDashboardStyle.headerTextLg(1)}>
              Appointments
            </div>
            <div className={serviceDashboardStyle.headerTextLg(1)}>
              Completed
            </div>
            <div className={serviceDashboardStyle.headerTextLg(1)}>
              Canceled
            </div>
            <div className="col-span-2 text-right">Earning</div>
          </div>

          <div className="divide-y divide-transparent min-w-full">
            {loading ? (
              <div className="px-4 py-6 text-center text-gray-500">
                Loading services...
              </div>
            ) : error ? (
              <div className="px-4 py-6 text-center text-rose-600">
                Error: {error}
              </div>
            ) : visibleServices.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500">
                No Service found.
              </div>
            ) : (
              visibleServices.map((s) => {
                const earning = s.completed * s.price;
                return (
                  <div
                    key={s.id}
                    className="px-4 py-4 font-serif hover:shadow-md transition bg-white md:bg-transparent"
                  >
                    {/* for tablet  */}

                    <div className="hidden md:grid lg:hidden grid-cols-5 items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 ring-1 ring-emerald-100">
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-emerald-800 whitespace-nowrap">
                            {s.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatCurrency(s.price)}
                          </div>
                        </div>
                      </div>

                      <div className="text-center text-sm">
                        {s.totalAppointments}
                      </div>
                      <div className={"text-center text-sm text-emerald-70"}>
                        {s.completed}
                      </div>
                      <div
                        className={`text-center text-sm text-emerald-70 text-red-500`}
                      >
                        {s.canceled}
                      </div>
                      <div className={`text-center text-sm text-emerald-70`}>
                        {formatCurrency(earning)}
                      </div>
                    </div>

                    {/* for Desktop view */}

                    <div className="hidden lg:grid grid-cols-12 items-center gap-4">
                      <div className="col-span-5 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden ring-1 ring-emerald-100 bg-gray-200">
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-semibold md:text-xs lg:text-lg xl:text-lg text-emerald-800">
                          {s.name}
                        </h3>
                      </div>

                      <div className={serviceDashboardStyle.desktopCell(2)}>
                        {formatCurrency(s.price)}
                      </div>

                      <div
                        className={serviceDashboardStyle.desktopCenterCell(1)}
                      >
                        {s.totalAppointments}
                      </div>

                      <div
                        className={serviceDashboardStyle.desktopCenterCell(1)}
                      >
                        {s.completed}
                      </div>

                      <div
                        className={serviceDashboardStyle.desktopCenterCell(1)}
                      >
                        {s.canceled}
                      </div>

                      <div
                        className={`${serviceDashboardStyle.desktopCell(2)} text-right`}
                      >
                        {formatCurrency(s.earning)}
                      </div>
                    </div>

                    {/* mobile view  */}

                    <div className="md:hidden flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 ring-1 ring-emerald-100">
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-semibold text-xs text-emerald-800">
                              {s.name}
                            </h3>
                            <div className="text-sm font-medium">
                              {formatCurrency(s.price)}
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                            <div
                              className={serviceDashboardStyle.mobileStatItem(
                                "emerald",
                              )}
                            >
                              <Calendar size={14} />
                              <span className="leading-none">
                                {s.totalAppointments} Appointments
                              </span>
                            </div>

                            <div
                              className={serviceDashboardStyle.mobileStatItem(
                                "emerald",
                              )}
                            >
                              <CheckCircle size={14} />
                              <span className="leading-none text-emerald-700">
                                {s.completed} Completed
                              </span>
                            </div>

                            <div
                              className={serviceDashboardStyle.mobileStatItem(
                                "red",
                              )}
                            >
                              <XCircle size={14} />
                              <span className="leading-none text-red-500">
                                {s.canceled} Canceled
                              </span>
                            </div>

                            <div
                              className={serviceDashboardStyle.mobileStatItem(
                                "emerald",
                              )}
                            >
                              <BadgeIndianRupee size={14} />
                              <span className="leading-none">
                                Total Earning : {formatCurrency(earning)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* show more / less */}

        {filteredServices.length > INITIAL_COUNT && (
          <div className="px-6 py-4 border-t border-green-50 flex justify-center">
            <button
              onClick={() => setShowAll((s) => !s)}
              className="px-4 py-2 rounded-full cursor-pointer bg-white border border-green-200 shadow-sm hover:bg-green-50 transition"
            >
              {showAll
                ? "Show less"
                : `Show more (${filteredServices.length - INITIAL_COUNT})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDashboardPage;
