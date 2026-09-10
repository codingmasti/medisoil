import { useEffect, useMemo, useState } from "react";
import StatsCard from "../components/StatsCard";
import { BadgeIndianRupee, CalendarRange, CheckCircle, Search, UserRoundCheck, Users, XCircle } from "lucide-react";


const API_BASE = 'http://localhost:4000';
const PATIENT_COUNT_API = `${API_BASE}/api/appointments/patents/count`;

//HELPER FUNCTIONS

//it function will return a finite number
const safeNumber = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};

//details of doctor
function normalizeDoctor(doc) {
    const id = doc._id || doc.id || String(Math.random()).slice(2);
    const name =
        doc.name ||
        doc.fullName ||
        `${doc.firstName || ""} ${doc.lastName || ""}`.trim() ||
        "Unknown";
    const specialization =
        doc.specialization ||
        doc.speciality ||
        (Array.isArray(doc.specializations)
            ? doc.specializations.join(", ")
            : "") ||
        "General";
    const fee = safeNumber(
        doc.fee ?? doc.fees ?? doc.consultationFee ?? doc.consultation_fee ?? 0,
        0
    );
    const image =
        doc.imageUrl ||
        doc.image ||
        doc.avatar ||
        `https://i.pravatar.cc/150?u=${id}`;

    const appointments = {
        total:
            doc.appointments?.total ??
            doc.totalAppointments ??
            doc.appointmentsTotal ??
            0,
        completed:
            doc.appointments?.completed ??
            doc.completedAppointments ??
            doc.appointmentsCompleted ??
            0,
        canceled:
            doc.appointments?.canceled ??
            doc.canceledAppointments ??
            doc.appointmentsCanceled ??
            0,
    };

    let earnings = null;
    if (doc.earnings !== undefined && doc.earnings !== null)
        earnings = safeNumber(doc.earnings, 0);
    else if (doc.revenue !== undefined && doc.revenue !== null)
        earnings = safeNumber(doc.revenue, 0);
    else if (appointments.completed && fee)
        earnings = fee * safeNumber(appointments.completed, 0);
    else earnings = 0;

    return {
        id,
        name,
        specialization,
        fee,
        image,
        appointments,
        earnings,
        raw: doc,
    };
}

const DashboardPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //new patient 
    const [patientCount, setPatientCount] = useState(null);
    const [patientCountLaoding, setPatientCountLoading] = useState(false);

    const [query, setQuery] = useState("");
    const [showAll, setShowAll] = useState(false);

    //to load doctors from the server
    useEffect(() => {
        let mounted = true;
        async function loadDoctors() {
            setLoading(true);
            setError(null);
            try {
                const url = `${API_BASE}/api/doctors?limit=200`;
                const res = await fetch(url);
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    throw new Error(
                        body?.message || `Failed to fetch doctors (${res.status})`
                    );
                }
                const body = await res.json();
                let list = [];
                if (Array.isArray(body)) list = body;
                else if (Array.isArray(body.doctors)) list = body.doctors;
                else if (Array.isArray(body.data)) list = body.data;
                else if (Array.isArray(body.items)) list = body.items;
                else {
                    const firstArray = Object.values(body).find((v) => Array.isArray(v));
                    if (firstArray) list = firstArray;
                }
                const normalized = list.map((d) => normalizeDoctor(d));
                if (mounted) setDoctors(normalized);
            } catch (err) {
                console.error("Failed to load doctors:", err);
                if (mounted) {
                    setError(err.message || "Failed to load doctors");
                    setDoctors([]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }
        loadDoctors();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        let mounted = true;
        async function loadPatientCount() {
            setPatientCountLoading(true);
            try {
                const res = await fetch(PATIENT_COUNT_API);
                if (!res.ok) {
                    console.warn("Patient count fetch failed:", res.status);
                    if (mounted) setPatientCount(0);
                    return;
                }

                const body = await res.json().catch(() => ({}));
                const count = Number(
                    body?.count ?? body?.totalUsers ?? body?.data ?? 0
                );
                if (mounted) setPatientCount(isNaN(count) ? 0 : count);
            } catch (err) {
                console.error("Failed to fetch patient count:", err);
                if (mounted) setPatientCount(0);
            } finally {
                if (mounted) setPatientCountLoading(false);
            }
        }
        loadPatientCount();
        return () => {
            mounted = false;
        };
    }, []);

    const totals = useMemo(() => {
        const totalDoctors = doctors.length;
        const totalAppointments = doctors.reduce(
            (s, d) => s + safeNumber(d.appointments?.total, 0),
            0
        );
        const totalEarnings = doctors.reduce(
            (s, d) => s + safeNumber(d.earnings, 0),
            0
        );
        const completed = doctors.reduce(
            (s, d) => s + safeNumber(d.appointments?.completed, 0),
            0
        );
        const canceled = doctors.reduce(
            (s, d) => s + safeNumber(d.appointments?.canceled, 0),
            0
        );
        const totalLoginPatients =
            doctors.reduce((s, d) => s + (d.raw?.loginPatientsCount ?? 0), 0) || 0;
        return {
            totalDoctors,
            totalAppointments,
            totalEarnings,
            completed,
            canceled,
            totalLoginPatients,
        };
    }, [doctors]);

    const filteredDoctors = useMemo(() => {
        if (!query) return doctors;
        const q = query.trim().toLowerCase();
        const qNum = Number(q);
        return doctors.filter((d) => {
            if (d.name.toLowerCase().includes(q)) return true;
            if ((d.specialization || "").toLowerCase().includes(q)) return true;
            if (d.fee.toString().includes(q)) return true;
            if (!Number.isNaN(qNum) && d.fee <= qNum) return true;
            return false;
        });
    }, [doctors, query]);

    const INITIAL_COUNT = 8;
    const visibleDoctors = showAll
        ? filteredDoctors
        : filteredDoctors.slice(0, INITIAL_COUNT);
    return (
        <section className="font-serif p-4 bg-emerald-50">
            {/* Dashboard header */}
            <div className="flex w-full h-full justify-center flex-col px-2 mt-2">
                    <h3 className="text-3xl font-bold text-gray-700">Dashboard</h3>
                    <p className="text-gray-700 text-sm">Welcome back Hear's What's happening today</p>
            </div>
            

            {/* main  */}

            <div className="w-full mt-2 rounded-lg bg-white">

                {/* stats section  */}
                <div className="grid grid-cols-3 m-3 mt-4 p-3 gap-1">
                    <StatsCard mainText="Total Doctors" value={totals.totalDoctors}
                        icon={<Users />}
                        iconColor="#4f46e5" iconBgColor="#eef2ff"
                    />
                    <StatsCard mainText="Total Register" value={
                        patientCountLaoding ? "Loading..." :
                            (patientCount ?? totals.totalLoginPatients)
                    }
                        icon={<UserRoundCheck />}
                        iconColor="#16a34a" iconBgColor="#dcfce7"
                    />
                    <StatsCard mainText="Total Appointments" value={totals.totalAppointments}
                        icon={<CalendarRange />}
                        iconColor="#2563eb" iconBgColor="#dbeafe"
                    />
                    <StatsCard mainText="Total Earnings" value={`₹${totals.totalEarnings.toLocaleString()}`}
                        icon={<BadgeIndianRupee />}
                        iconColor="#d97706" iconBgColor="#fef3c7"
                    />
                    <StatsCard mainText="Completed" value={totals.completed}
                        icon={<CheckCircle />}
                        iconColor="#059669" iconBgColor="#d1fae5"
                    />
                    <StatsCard mainText="Canceled" value={totals.canceled}
                        icon={<XCircle />}
                        iconColor="#dc2626" iconBgColor="#fee2e2"
                    />
                </div>

                {/* Search section  */}
                <div className="w-full ml-3 my-5">
                    <label htmlFor="search" className="block text-lg text-slate-600 mb-2">Search Doctor</label>
                    <div className="flex items-center gap-3 max-w-md">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 w-5 h-5 text-green-500" size={20} />
                            <input type="text"
                                value={query}
                                id="search"
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search name / Specialization / fee"
                                className="pl-10 pr-4 py-2 rounded-full shadow-sm border border-green-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-200 w-full"
                            />
                        </div>
                        <button onClick={() => {
                            setQuery("");
                            setShowAll(false);
                        }}
                            className="px-3 py-2 bg-green-500 text-white rounded-full shadow hover:bg-green-600">Clear</button>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-green-50 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-800">Doctors</h2>
                        <p className="text-sm text-slate-500">
                            {loading ? "Loading..." : `Showing ${visibleDoctors.length} of ${filteredDoctors.length}`}
                        </p>
                    </div>
                    {error && (
                        <div className="px-6 py-4 border-b border-green-50 text-sm text-rose-600">
                            Error loading doctors: {error}
                        </div>
                    )}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-green-50">
                            <thead className="bg-green-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Doctor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Specialization</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Fee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Appointments</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Completed</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Canceled</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Total Earnings</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-green-50">
                                {visibleDoctors.map((d, idx) => (
                                    <tr
                                        key={d.id}
                                        className={`group transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1
                                            ${(idx % 2 === 0 ? "bg-white" : "bg-green-50/40")}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4">
                                            <div className="w-1 h-12 rounded-md mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-b from-emerald-400 to-green-200" />
                                            <img
                                                src={d.image}
                                                alt={d.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-green-100"
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-slate-800">
                                                    {d.name}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-0.5">
                                                    ID: {d.id}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {d.specialization}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-700">
                                            ₹ {d.fee}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-700">
                                            {d.appointments.total}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-emerald-600" >
                                            {d.appointments.completed}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-rose-500">
                                            {d.appointments.canceled}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-slate-800">
                                            ₹ {d.earnings.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="md:hidden px-4 py-4">
                        <div className="space-y-3">
                            {visibleDoctors.map((d) => (
                                <MobileDoctorCard key={d.id} d={d} />
                            ))}
                        </div>
                    </div>
                    {filteredDoctors.length > INITIAL_COUNT && (
                        <div className="px-6 py-4 border-t border-green-50 flex justify-center">
                            <button onClick={() => setShowAll((s) => !s)}
                                className="px-4 py-2 rounded-full bg-white border border-green-200 shadow-sm hover:bg-green-50 transition">
                                    {
                                        showAll ? "Slow less" : `Show more (${filteredDoctors.length - INITIAL_COUNT})`
                                    }

                            </button>
                        </div>
                    )}
                </div>

            </div>


        </section>
    )
}

export default DashboardPage

function MobileDoctorCard({ d }) {
    return (
        <div className="bg-white rounded-xl shadow p-3 border border-green-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={d.image} alt={d.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                        <div className="text-sm font-medium text-slate-800">{d.name}</div>
                        <div className="text-xs text-slate-500">{d.specialization}</div>
                    </div>
                </div>
                <div className="text-sm text-slate-700 font-semibold">{d.fee}</div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div>
                    <div className="text-xs text-slate-500">Appts</div>
                    <div className="text-sm font-semibold text-slate-800">{d.appointments.total
                    }</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500">Done</div>
                    <div className="text-sm font-semibold text-emerald-600">{d.appointments.completed
                    }</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500">Cancel</div>
                    <div className="text-sm font-semibold text-rose-500">{d.appointments.canceled
                    }</div>
                </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
                <div>Earned</div>
                <div className="font-medium">{d.earnings.toLocaleString()}</div>
            </div>
        </div>
    )
}