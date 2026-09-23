import {
  BadgeIndianRupee,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  Phone,
  SearchIcon,
  User,
  XCircle,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { serviceAppointmentStyles } from "../assets/style";

const API_BASE = "http://localhost:4000";

//helper functions

function formatTwo(n) {
  return String(n).padStart(2, "0");
}
function formatDateNice(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function parseTimeToParts(timeStr) {
  if (!timeStr) return { hour: 12, minute: 0, ampm: "AM" };
  const m = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (m) {
    let hh = Number(m[1]);
    const mm = Number(m[2]);
    const ampm = m[3] ? m[3].toUpperCase() : null;
    if (!ampm) {
      const hour12 = hh % 12 === 0 ? 12 : hh % 12;
      return { hour: hour12, minute: mm, ampm: hh >= 12 ? "PM" : "AM" };
    }
    return { hour: hh, minute: mm, ampm };
  }
  return { hour: 12, minute: 0, ampm: "AM" };
}

function timePartsTo12HourString(hh24, mm) {
  let ampm = hh24 >= 12 ? "PM" : "AM";
  let hour = hh24 % 12 === 0 ? 12 : hh24 % 12;
  return `${formatTwo(hour)}:${formatTwo(mm)} ${ampm}`;
}

function timePartsToInputValue(a) {
  const hour = Number(a.hour || 0);
  const minute = Number(a.minute || 0);
  let hh24 = hour % 12;
  if ((a.ampm || "AM").toUpperCase() === "PM") hh24 += 12;
  if (a.ampm === "AM" && hour === 12) hh24 = 0;
  if (a.ampm === "PM" && hour === 12) hh24 = 12;
  return `${formatTwo(hh24)}:${formatTwo(minute)}`;
}

function formatTimeDisplay(a) {
  return `${formatTwo(a.hour)}:${formatTwo(a.minute)} ${a.ampm}`;
}

function StatusBadge({ status }) {
  const classes = serviceAppointmentStyles.statusBadge(status);
  return (
    <span className={classes}>
      {status === "Confirmed" && <CheckCircle className="h-4 w-4" />}
      {status === "Canceled" && <XCircle className="h-4 w-4" />}
      {status}
    </span>
  );
}

function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-3 sm:right-4 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="max-w-xs w-full rounded-lg shadow-lg px-4 py-3 border-l-4 border-emerald-400 bg-white/95 backdrop-blur-sm"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{t.title}</div>
              <div className="text-xs text-gray-600">{t.message}</div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-700"
              aria-label="close toast"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusSelect({ appointment, onChange, disabled }) {
  const terminal =
    appointment.status === "Completed" || appointment.status === "Canceled";

  const options = [
    { value: "Pending", label: "Pending" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "Completed", label: "Completed" },
    { value: "Canceled", label: "Canceled" },
  ];

  return (
    <select
      value={appointment.status}
      onChange={(e) => onChange(e.target.value)}
      disabled={terminal || disabled}
      className={serviceAppointmentStyles.statusSelect(terminal)}
      title={terminal ? "Status cannot be changed" : "Change status"}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function getTodayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function isDateBefore(aDateStr, bDateStr) {
  try {
    const a = new Date(`${aDateStr}T00:00:00`);
    const b = new Date(`${bDateStr}T00:00:00`);
    return a.getTime() < b.getTime();
  } catch {
    return false;
  }
}

function RescheduleButton({ appointment, onReschedule, disabled }) {
  const terminal =
    appointment.status === "Completed" || appointment.status === "Canceled";
  const [editing, setEditing] = useState(false);
  const todayISO = getTodayISO();
  const [date, setDate] = useState(appointment.date || todayISO);
  const [time, setTime] = useState(timePartsToInputValue(appointment));

  useEffect(() => {
    const baseDate = appointment.date || "";
    const initialDate =
      baseDate && !isDateBefore(baseDate, todayISO) ? baseDate : todayISO;
    setDate(initialDate);
    setTime(timePartsToInputValue(appointment));
  }, [
    appointment.date,
    appointment.hour,
    appointment.minute,
    appointment.ampm,
  ]);

  function save() {
    if (!date || !time) return;
    if (isDateBefore(date, getTodayISO())) {
      alert("Please choose today or a future date for rescheduling.");
      return;
    }
    onReschedule(date, time);
    setEditing(false);
  }
  function cancel() {
    const baseDate = appointment.date || "";
    const restoreDate =
      baseDate && !isDateBefore(baseDate, getTodayISO())
        ? baseDate
        : getTodayISO();
    setDate(restoreDate);
    setTime(timePartsToInputValue(appointment));
    setEditing(false);
  }

  return (
    <div className="w-full">
      {!editing ? (
        <div className="flex justify-end">
          <button
            onClick={() => setEditing(true)}
            disabled={terminal || disabled}
            title={
              terminal ? "Cannot reschedule completed/canceled" : "Reschedule"
            }
            className={serviceAppointmentStyles.rescheduleButton(terminal)}
          >
            Reschedule
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row xl:flex-col md:flex-col md:items-end gap-2 bg-gray-50 p-2 rounded-md shadow-sm">
          <input
            type="date"
            value={date}
            min={getTodayISO()}
            onChange={(e) => setDate(e.target.value)}
            className="text-sm px-3 py-1 w-full sm:w-auto text-green-800 border border-emerald-500 rounded-full"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="text-sm px-3 py-1 w-full sm:w-auto text-green-800 border border-emerald-500 rounded-full"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={save}
              className="flex-1 sm:flex-none px-3 py-1 bg-green-500 cursor-pointer text-white border-emerald-500 rounded-full text-sm"
            >
              Save
            </button>
            <button
              onClick={cancel}
              className="flex-1 sm:flex-none px-3 py-1 bg-red-200 border text-sm cursor-pointer border-red-500 rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const ServiceAppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & debounce
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 220);
    return () => clearTimeout(t);
  }, [search]);

  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  function pushToast(title, message) {
    const toastId = Date.now() + Math.random();
    setToasts((t) => [...t, { id: toastId, title, message }]);
  }
  function removeToast(id) {
    setToasts((t) => t.filter((x) => x.id !== id));
  }

  async function fetchAppointments() {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/api/service-appointments?limit=500`;
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body?.message || `Failed to fetch appointments (${res.status})`,
        );
      }
      const body = await res.json();
      const list = Array.isArray(body.appointments)
        ? body.appointments
        : (body.appointments ??
          body.items ??
          body.data ??
          body.appointments ??
          []);

      const normalized = (Array.isArray(list) ? list : [])
        .map((a) => {
          const timeStr =
            a.time ||
            a.slot?.time ||
            a.rescheduledTo?.time ||
            (a.hour !== undefined && a.minute !== undefined
              ? `${formatTwo(a.hour || 12)}:${formatTwo(a.minute ?? 0)} ${a.ampm || "AM"}`
              : "");
          const parsed = parseTimeToParts(timeStr);
          return {
            id: a._id || a.id,
            patientName:
              a.patientName ||
              a.name ||
              (a.raw && a.raw.patientName) ||
              "Unknown",
            gender: a.gender || (a.raw && a.raw.gender) || "",
            mobile: a.mobile || a.phone || "",
            age: a.age || a.raw?.age || "",
            serviceName:
              a.serviceName ||
              a.service ||
              a.raw?.serviceName ||
              (a.notes || "").slice(0, 40),
            fees: a.fees ?? a.fee ?? a.payment?.amount ?? 0,
            date:
              a.date || (a.slot && a.slot.date) || a.rescheduledTo?.date || "",
            hour: parsed.hour,
            minute: parsed.minute,
            ampm: parsed.ampm,
            status: a.status || (a.payment && a.payment.status) || "Pending",
            raw: a,
          };
        })
        .filter(Boolean);
      setAppointments(normalized);
    } catch (err) {
      console.error("fetchAppointments:", err);
      setError(err.message || "Failed to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) =>
      setTimeout(() => {
        setToasts((s) => s.filter((x) => x.id !== t.id));
      }, 3000),
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, [toasts]);

  function extractUpdated(body) {
    return body?.data || body?.appointment || body || {};
  }

  async function changeStatusRemote(id, newStatus) {
    const old = appointments.find((a) => a.id === id);
    if (!old) return;
    if (old.status === "Completed" || old.status === "Canceled") {
      pushToast(
        "Cannot change status",
        `Appointment #${id} is already ${old.status}.`,
      );
      return;
    }

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );
    pushToast("Updating status", `Appointment #${id} → ${newStatus}`);

    try {
      const res = await fetch(`${API_BASE}/api/service-appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body?.message || `Status update failed (${res.status})`,
        );
      }

      const body = await res.json();
      const updated = extractUpdated(body);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
              ...a,
              status: updated.status || newStatus,
              date: updated.date || updated.rescheduledTo?.date || a.date,
              hour: parseTimeToParts(
                updated.time ||
                updated.rescheduledTo?.time ||
                a.raw?.time ||
                `${formatTwo(a.hour)}:${formatTwo(a.minute)} ${a.ampm}`,
              ).hour,
              minute: parseTimeToParts(
                updated.time ||
                updated.rescheduledTo?.time ||
                a.raw?.time ||
                `${formatTwo(a.hour)}:${formatTwo(a.minute)} ${a.ampm}`,
              ).minute,
              ampm: parseTimeToParts(
                updated.time ||
                updated.rescheduledTo?.time ||
                a.raw?.time ||
                `${formatTwo(a.hour)}:${formatTwo(a.minute)} ${a.ampm}`,
              ).ampm,
              raw: updated || a.raw,
            }
            : a,
        ),
      );
      pushToast("Status updated", `Appointment #${id} is now ${newStatus}`);
    } catch (err) {
      console.error("changeStatusRemote:", err);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: old.status } : a)),
      );
      pushToast("Update failed", err.message || "Failed to update status");
    }
  }

  async function rescheduleRemote(id, dateStr, time24) {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;
    const [hh, mm] = time24.split(":").map(Number);
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;
    const ampm = hh >= 12 ? "PM" : "AM";
    const timeStr = `${formatTwo(hour12)}:${formatTwo(mm)} ${ampm}`;

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
            ...a,
            date: dateStr,
            hour: hour12,
            minute: mm,
            ampm,
            status: "Rescheduled",
          }
          : a,
      ),
    );

    pushToast(
      "Rescheduling",
      `Appointment #${id} → ${formatDateNice(dateStr)} ${timeStr}`,
    );

    try {
      const res = await fetch(`${API_BASE}/api/service-appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rescheduledTo: { date: dateStr, time: timeStr },
          status: "Rescheduled",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `Reschedule failed (${res.status})`);
      }
      const body = await res.json();
      const updated = extractUpdated(body);

      const finalDate =
        updated.date || updated.rescheduledTo?.date || dateStr || appt.date;
      const finalTimeStr =
        updated.time ||
        updated.rescheduledTo?.time ||
        timeStr ||
        `${formatTwo(appt.hour)}:${formatTwo(appt.minute)} ${appt.ampm}`;

      const parsed = parseTimeToParts(finalTimeStr);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
              ...a,
              date: finalDate,
              hour: parsed.hour,
              minute: parsed.minute,
              ampm: parsed.ampm,
              status: updated.status || "Rescheduled",
              raw: updated || a.raw,
            }
            : a,
        ),
      );
      pushToast(
        "Rescheduled",
        `Appointment #${id} moved to ${formatDateNice(
          finalDate,
        )} ${finalTimeStr}`,
      );
    } catch (err) {
      console.error("rescheduleRemote:", err);
      pushToast(
        "Reschedule failed",
        err.message || "Failed to reschedule — reloading",
      );
      await fetchAppointments();
    }
  }

  //to cancel any appt
  async function cancelRemote(id) {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;
    if (appt.status === "Canceled") return;
    if (
      !window.confirm(
        `Mark appointment for ${appt.patientName} on ${formatDateNice(
          appt.date,
        )} as CANCELED?`,
      )
    )
      return;

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Canceled" } : a)),
    );
    pushToast("Canceling", `Appointment #${id} is being canceled`);

    try {
      const res = await fetch(
        `${API_BASE}/api/service-appointments/${id}/cancel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `Cancel failed (${res.status})`);
      }
      const body = await res.json();
      const updated = extractUpdated(body);
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
              ...a,
              status: updated.status || "Canceled",
              raw: updated || a.raw,
            }
            : a,
        ),
      );
      pushToast("Canceled", `Appointment #${id} canceled`);
    } catch (err) {
      console.error("cancelRemote:", err);
      pushToast("Cancel failed", err.message || "Failed to cancel — reloading");
      await fetchAppointments();
    }
  }

  //to filter
  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return appointments
      .filter((a) =>
        q
          ? (a.patientName || "").toLowerCase().includes(q) ||
          (a.serviceName || "").toLowerCase().includes(q)
          : true,
      )
      .filter((a) => (statusFilter ? a.status === statusFilter : true));
  }, [appointments, debouncedSearch, statusFilter]);

  function getTimestamp(a) {
    try {
      const [y, m, d] = (a.date || "1970-01-01").split("-").map(Number);
      let hour = Number(a.hour) || 0;
      if ((a.ampm || "AM") === "PM" && hour !== 12) hour += 12;
      if ((a.ampm || "AM") === "AM" && hour === 12) hour = 0;
      const minute = Number(a.minute) || 0;
      return new Date(y, (m || 1) - 1, d || 1, hour, minute).getTime();
    } catch {
      return 0;
    }
  }

  //sort that is upcoming date comes first
  const displayList = useMemo(() => {
    const copy = filtered.slice();
    copy.sort((x, y) => getTimestamp(y) - getTimestamp(x));
    return copy;
  }, [filtered]);

  return (
    <div className="p-4 sm:p-6 md:p-6 font-serif">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-800">
            Appointments
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage patient bookings - quick search & status controls
          </p>
        </div>

        <div className="w-full md:w-96 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <label className="relative block w-full">
              <span className="sr-only">Search Appointments</span>
              <div className="flex items-center gap-2 relative w-full">
                <div className="absolute left-3 pointer-events-none">
                  <SearchIcon className="w-4 h-4 text-emerald-400" />
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by patient or service..."
                  className="pl-10 pr-10 w-full rounded-full border border-emerald-200 bg-white/90 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                />

                {search ? (
                  <button
                    className="absolute right-3 rounded-full p-1 hover:bg-gray-100"
                    onClick={() => setSearch("")}
                  >
                    <XIcon className="w-4 h-4 text-gray-500" />
                  </button>
                ) : null}
              </div>
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm px-3 py-2 cursor-pointer rounded-full border border-emerald-400"
              title="Filter by status"
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
            <div>
              {displayList.length} result{displayList.length !== 1 ? "s" : ""}
            </div>

            <div>
              <button
                onClick={fetchAppointments}
                className="text-xs text-emerald-600 hover:underline"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="col-span-full rounded-2xl p-8 bg-white/90 border border-emerald-50 shadow-sm flex items-center justify-center gap-3">
          <Loader2 className="animate-spin" /> Loading appointments...
        </div>
      ) : error ? (
        <div className="col-span-full rounded-2xl p-4 bg-rose-50 border border-rose-100 text-rose-700">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {displayList.length === 0 ? (
            <div className="col-span-full rounded-2xl p-8 bg-white/90 border border-emerald-50 shadow-sm flex items-center justify-center flex-col gap-3">
              <div className="text-3xl text-emerald-300">
                <SearchIcon />
              </div>
              <div className="text-sm text-gray-600">
                No appointments match your search
              </div>
              <div className="text-xs text-gray-400">
                Try to different patient name or service
              </div>
            </div>
          ) : (
            displayList.map((a) => {
              const isLocked =
                a.status === "Completed" || a.status === "Canceled";
              return (
                <article
                  key={a.id}
                  className="group relative rounded-3xl p-1 animated-border h-full transform transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="card-inner rounded-2xl overflow-hidden border-2 border-emerald-300/60 p-5 bg-white/90 shadow-lg h-full flex flex-col">
                    {/* ================= HEADER ================= */}
                    <div className="flex items-start justify-between gap-4 min-h-[72px]">
                      {/* Patient Info */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="rounded-full w-12 h-12 shrink-0 flex items-center justify-center bg-emerald-100/70">
                          <User className="h-6 w-6 text-emerald-700" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div
                            className="text-lg font-bold leading-tight text-emerald-900 truncate"
                            title={a.patientName}
                          >
                            {a.patientName}
                          </div>

                          <div className="text-sm text-gray-500 mt-1">
                            {a.gender} • {a.age} yrs
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <StatusBadge status={a.status} />

                        <StatusSelect
                          appointment={a}
                          onChange={(s) => changeStatusRemote(a.id, s)}
                          disabled={false}
                        />
                      </div>
                    </div>

                    {/* ================= DETAILS ================= */}
                    <div className="mt-4 flex flex-col gap-3 text-gray-700">
                      {/* Phone */}
                      <div className="flex items-center gap-3 text-base min-w-0">
                        <Phone className="w-4 h-4 text-emerald-500 shrink-0" />

                        <span className="font-medium truncate">{a.mobile}</span>
                      </div>

                      {/* Fees */}
                      <div className="flex items-center gap-3 text-base">
                        <BadgeIndianRupee className="w-4 h-4 text-emerald-500 shrink-0" />

                        <span className="font-semibold">Fees: ₹{a.fees}</span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-3 text-base min-w-0">
                        <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />

                        <span className="font-medium truncate">
                          Date: {formatDateNice(a.date)}
                        </span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-3 text-base min-w-0">
                        <Clock className="w-4 h-4 text-emerald-500 shrink-0" />

                        <span className="font-medium truncate">
                          Time: {formatTimeDisplay(a)}
                        </span>
                      </div>

                      {/* Service */}
                      <div className="mt-2 text-base text-gray-600 min-w-0">
                        Service:{" "}
                        <span
                          className="font-semibold text-emerald-800 truncate inline-block max-w-full align-bottom"
                          title={a.serviceName}
                        >
                          {a.serviceName}
                        </span>
                      </div>
                    </div>

                    {/* ================= FOOTER ================= */}
                    <div className="mt-auto pt-5">
                      <div className="flex items-center gap-3 w-full">
                        {/* Reschedule */}
                        <div className="flex-1 min-w-0">
                          <RescheduleButton
                            appointment={a}
                            onReschedule={(d, t) =>
                              rescheduleRemote(a.id, d, t)
                            }
                            disabled={false}
                          />
                        </div>

                        {/* Cancel */}
                        <button
                          onClick={() => cancelRemote(a.id)}
                          disabled={isLocked}
                          className={`
            shrink-0
            px-4 py-2
            rounded-lg
            ${serviceAppointmentStyles.cancelButton(isLocked)}
          `}
                          title={
                            isLocked ? "Cannot cancel" : "Cancel appointment"
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}

      <Toast toasts={toasts} removeToast={removeToast} />
      <div className="mt-6 p-4 rounded-lg bg-white/80 shadow-inner border border-emerald-100 text-sm flex flex-col sm:flex-row flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>{" "}
          <span>Pending</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>{" "}
          <span>Confirmed</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>{" "}
          <span>Canceled</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-sky-400"></div>{" "}
          <span>Completed</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-400"></div>{" "}
          <span>Rescheduled</span>
        </div>
      </div>
      <style>{serviceAppointmentStyles.animatedBorderStyle}</style>
    </div>
  );
};

export default ServiceAppointmentPage;
