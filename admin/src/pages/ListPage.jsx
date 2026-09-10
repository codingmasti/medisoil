//HELPER FUNCTIONS

import { BadgeIndianRupee, EyeClosed, Search, Star, Trash2, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { doctorStyle } from "../assets/style";

//this function will give you output as DD - MM - YYYY
function formatDateISO(iso) {
    if (!iso || typeof iso !== "string") return iso;
    const parts = iso.split("-");
    if (parts.length !== 3) return iso;
    const [y, m, d] = parts;
    const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const day = String(Number(d));
    const month = monthNames[dateObj.getMonth()] || "";
    return `${day} ${month} ${y}`;
}


//it will normalize any date-like string
function normalizeToDateString(d) {
    if (!d) return null;
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return null;
    return dt.toISOString().split("T")[0];
}


//this function will normalize schedule map: ex - YYYY-MM-DD : [slot1, slot2 ...]
//also converts slots to array slots
function buildScheduleMap(schedule) {
    const map = {};
    if (!schedule || typeof schedule !== "object") return map;
    Object.entries(schedule).forEach(([k, v]) => {
        const nd = normalizeToDateString(k) || String(k);
        map[nd] = Array.isArray(v) ? v.slice() : [];
    });
    return map;
}


//this function gives past dates first
//that is nearest date comes first:
function getSortedScheduleDates(scheduleLike) {
    let keys = [];
    if (Array.isArray(scheduleLike)) {
        keys = scheduleLike.map(normalizeToDateString).filter(Boolean);
    } else if (scheduleLike && typeof scheduleLike === "object") {
        keys = Object.keys(scheduleLike).map(normalizeToDateString).filter(Boolean);
    }

    keys = Array.from(new Set(keys));
    const parsed = keys.map((ds) => ({ ds, date: new Date(ds) }));
    const dateVal = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

    const today = new Date();
    const todayVal = dateVal(today);

    const past = parsed
        .filter((p) => dateVal(p.date) < todayVal)
        .sort((a, b) => dateVal(b.date) - dateVal(a.date));

    const future = parsed
        .filter((p) => dateVal(p.date) >= todayVal)
        .sort((a, b) => dateVal(a.date) - dateVal(b.date));

    return [...past, ...future].map((p) => p.ds);
}

const ListPage = () => {
    const API_BASE = "http://localhost:4000";

    const [doctors, setDoctors] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [query, setQuery] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(false);

    const [isMobileScreen, setIsMobileScreen] = useState(false);
    useEffect(() => {
        function onResize() {
            if (typeof window === "undefined") return;
            setIsMobileScreen(window.innerWidth < 640);
        }
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);


    //fetch doctors from server
    async function fetchDoctors() {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/doctors`);
            const body = await res.json().catch(() => null);

            if (res.ok && body && body.success) {
                const list = Array.isArray(body.data)
                    ? body.data
                    : Array.isArray(body.doctors)
                        ? body.doctors
                        : [];
                const normalized = list.map((d) => {
                    const scheduleMap = buildScheduleMap(d.schedule || {});
                    return {
                        ...d,
                        schedule: scheduleMap,
                    };
                });
                setDoctors(normalized);
            } else {
                console.error("Failed to fetch doctors", { status: res.status, body });
                setDoctors([]);
            }
        } catch (err) {
            console.error("Network error fetching doctors", err);
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDoctors();
    }, []);


    //to filter doctors
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = doctors;
        if (filterStatus === "available") {
            list = list.filter(
                (d) => (d.availability || "").toString().toLowerCase() === "available"
            );
        } else if (filterStatus === "unavailable") {
            list = list.filter(
                (d) => (d.availability || "").toString().toLowerCase() !== "available"
            );
        }
        if (!q) return list;
        return list.filter((d) => {
            return (
                (d.name || "").toLowerCase().includes(q) ||
                (d.specialization || "").toLowerCase().includes(q)
            );
        });
    }, [doctors, query, filterStatus]);

    //show doctor according to filter
    const displayed = useMemo(() => {
        if (showAll) return filtered;
        return filtered.slice(0, 6);
    }, [filtered, showAll]);

    function toggle(id) {
        setExpanded((prev) => (prev === id ? null : id));
    }

    //to delete any doctor
    async function removeDoctor(id) {
        const doc = doctors.find((d) => (d._id || d.id) === id);
        if (!doc) return;
        const ok = window.confirm(`Delete ${doc.name}? This cannot be undone.`);
        if (!ok) return;

        try {
            const res = await fetch(`${API_BASE}/api/doctors/${id}`, {
                method: "DELETE",
            });
            const body = await res.json().catch(() => null);
            if (!res.ok) {
                alert(body?.message || "Failed to delete");
                return;
            }
            setDoctors((prev) => prev.filter((p) => (p._id || p.id) !== id));
            if (expanded === id) setExpanded(null);
        } catch (err) {
            console.error("delete error", err);
            alert("Network error deleting doctor");
        }
    }

    //shows all doctor or the filtered ones
    function applyStatusFilter(status) {
        setFilterStatus((prev) => (prev === status ? "all" : status));
        setExpanded(null);
        setShowAll(false);
    }
    return (
        <div className="min-h-screen font-serif bg-emerald-50 p-4 sm:p-6 md:p-8">
            <header className="max-w-6xl mx-auto mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="p-2 rounded-full bg-white shadow-sm transform transition">
                            <Users size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <h1 className="text-base sm:text-lg font-semibold text-emerald-800">Find a Doctor</h1>
                            <p className="text-sm sm:text-md text-emerald-600">
                                Search by name or specialization
                            </p>
                        </div>
                    </div>

                    <div className="w-full sm:w-auto mt-3 sm:mt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="flex items-center w-full sm:w-96 bg-white rounded-full px-3 py-2 shadow-sm">
                            <Search size={17} className="text-emerald-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search Doctors, specialization"
                                className="ml-3 w-full outline-none text-emerald-700 placeholder-emerald-400 bg-transparent" />
                        </div>
                        <button onClick={() => {
                            setQuery("");
                            setExpanded(null);
                            setShowAll(false);
                            setFilterStatus("all")
                        }}
                            className="px-3 py-2 cursor-pointer rounded-full bg-emerald-600 text-white shadow hover:opacity-95 transition w-full sm:w-auto">
                            Clear
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-5">
                    <button
                        onClick={() => applyStatusFilter("available")}
                        className={doctorStyle.filterButton(
                            filterStatus === "available", "emerald"
                        )}>Available</button>

                    <button
                        onClick={() => applyStatusFilter("unavailable")}
                        className={doctorStyle.filterButton(
                            filterStatus === "unavailable", "red"
                        )}>Unavailable</button>
                </div>
            </header>
            <main className="max-w-6xl grid xl:grid-cols-2 lg:grid-cols-2 lg:gap-3 xl:gap-4 mx-auto space-y-4">
                {loading && (
                    <div className="text-center text-emerald-600 py-8">
                        Loading Doctors...
                    </div>
                )}
                {!loading && filtered.length === 0 && (
                    <div className="text-center text-emerald-600 py-8">
                        No doctor match your search.
                    </div>
                )}

                {displayed.map((doc) => {
                    const id = doc._id || doc.id;
                    const isOpen = expanded === id;
                    const isAvailable = doc.availability === "Available";

                    const scheduleMap = buildScheduleMap(doc.schedule || {});
                    const sortedDates = getSortedScheduleDates(scheduleMap);

                    return (
                        <article key={id}
                            className="bg-linear-to-r from-emerald-100/50 to-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden transition-all duration-300"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 sm:p-4 md:p-5">
                                <img src={doc.imageUrl || doc.image || ""} alt={doc.name}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-emerald-200 shadow-sm mx-auto sm:mx-0" />



                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex flex-col sm:flex-row sm:items-start items-start justify-between gap-3 w-full">
                                        <div className="min-w-0 w-full">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-base sm:text-lg md:text-xl text-emerald-800 font-medium truncate">{doc.name}</h3>
                                                <span className={doctorStyle.availabilityBadge(isAvailable)}>
                                                    <span className={doctorStyle.availabilityDot(isAvailable)} />
                                                    {isAvailable ? "Available" : "Unavailable"}
                                                </span>
                                            </div>

                                            <div className="text-sm text-emerald-600 truncate mt-2 sm:mt-1">
                                                {doc.specialization} • {doc.experience} years
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mt-3 sm:mt-0 sm:ml-4">
                                            <div className="text-sm text-emerald-700 flex items-center gap-1">
                                                <Star size={14} /> {doc.rating}
                                            </div>
                                            <button onClick={() => toggle(id)}
                                                className={doctorStyle.toggleButton(isOpen)}>
                                                <EyeClosed size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                        <div className="text-xs text-emerald-500">Patients</div>
                                        <div className="text-sm text-emerald-700 font-medium flex items-center gap-2">
                                            <Users size={14} /> {doc.patients}
                                        </div>
                                    </div>


                                    <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => removeDoctor(id)}
                                                className="px-3 py-1 cursor-pointer rounded-full bg-red-50 text-red-600 text-xs flex items-center gap-2 transition">
                                                <Trash2 size={14} /> Delete
                                            </button>

                                            <div className="text-md font-bold text-emerald-700">
                                                <div className="text-sm text-emerald-800 font-medium flex items-center gap-1">
                                                    <BadgeIndianRupee /> {doc.fee}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* after expand is done  */}

                            <div
                                className="px-4 md:px-5 bg-white overflow-auto sm:overflow-visible"
                                style={{
                                    maxHeight: isOpen ? (isMobileScreen ? 320 : 600) : 0,
                                    transition:
                                        "max-height 420ms cubic-bezier(.2,.9,.2,1), padding 220ms ease",
                                    paddingTop: isOpen ? 16 : 0,
                                    paddingBottom: isOpen ? 16 : 0,
                                }}
                            >
                                {isOpen && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="col-span-2">
                                            <h4 className="text-md font-bold text-emerald-700 mb-1">About</h4>
                                            <p className="text-sm text-emerald-600 break-words whitespace-normal">{doc.about}</p>

                                            <div className="mt-4">
                                                <div className="text-md text-emerald-700 font-bold">
                                                    Qualifications
                                                </div>
                                                <div className="text-sm text-emerald-600 break-words whitespace-normal">
                                                    {doc.qualifications}
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <div className="text-md text-emerald-700 font-bold">
                                                    Schedule
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {sortedDates.map((date) => {
                                                        const slots = scheduleMap[date] || [];
                                                        return (
                                                            <div key={date} className="min-w-full md:min-w-0">
                                                                <div className="text-xs text-emerald-500">
                                                                    {formatDateISO(date)}
                                                                </div>
                                                                <div className="mt-1 flex flex-wrap gap-2">
                                                                    {slots.map((s, i) => (
                                                                        <span
                                                                            key={i}
                                                                            className="text-xs px-3 py-1 rounded-full border border-emerald-100 shadow-sm break-words"
                                                                        >
                                                                            {s}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <aside className="col-span-1 flex flex-col sm:flex-row md:flex-col xl:flex-col lg:flex-col gap-3 items-start md:items-end">
                                            <div className="text-md text-emerald-700 font-bold">
                                                Success
                                            </div>
                                            <div className="text-sm text-emerald-700">
                                                {doc.success}%
                                            </div>

                                            <div className="text-md text-emerald-700 font-bold">
                                                Patients
                                            </div>
                                            <div className="text-sm text-emerald-700">
                                                {doc.patients}
                                            </div>

                                            <div className="text-md text-emerald-700 font-bold">
                                                Location
                                            </div>
                                            <div className="text-sm text-emerald-700">
                                                {doc.location}
                                            </div>
                                        </aside>
                                    </div>
                                )}
                            </div>
                        </article>
                    )
                })}

                {
                    filtered.length > 6 && (
                        <div className="col-span-full flex justify-center mt-4">
                            <button
                                onClick={() => setShowAll((s) => !s)}
                                className="px-5 py-2 cursor-pointer rounded-full bg-white border border-emerald-300 shadow-sm hover:shadow-md transition">
                                {showAll ? "Show Less" : `Show More(${filtered.length - 4})`}
                            </button>
                        </div>
                    )
                }
            </main>
        </div>
    )
}

export default ListPage