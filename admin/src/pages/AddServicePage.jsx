import { useEffect, useRef, useState } from "react";
import { addServiceStyle } from "../assets/style";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Image,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";

const AddServicePage = ({ serviceId }) => {
  const API_BASE = "http://localhost:4000";

  const fileRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [hasExistingImage, setHasExistingImage] = useState(false); //to update the image found
  const [removeImage, setRemoveImage] = useState(false);

  const [serviceName, setServiceName] = useState("");
  const [about, setAbout] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("available");

  const [instructions, setInstructions] = useState([""]);
  const [slots, setSlots] = useState([]);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  const years = Array.from({ length: 5 }).map((_, i) => currentYear + i);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const hours = Array.from({ length: 12 }).map((_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  const minutes = Array.from({ length: 12 }).map((_, i) =>
    String(i * 5).padStart(2, "0"),
  );
  const ampm = ["AM", "PM"];

  const [slotDay, setSlotDay] = useState(String(currentDate));
  const [slotMonth, setSlotMonth] = useState(String(currentMonth));
  const [slotYear, setSlotYear] = useState(String(currentYear));
  const [slotHour, setSlotHour] = useState("11");
  const [slotMinute, setSlotMinute] = useState("00");
  const [slotAmPm, setSlotAmPm] = useState("AM");

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  //compute the days for selected month/year (respecting the month length)
  const selectedYearNum = Number(slotYear);
  const selectedMonthNum = Number(slotMonth);
  const daysInSelectedMonth = new Date(
    selectedYearNum,
    selectedMonthNum + 1,
    0,
  ).getDate();
  const days = Array.from({ length: daysInSelectedMonth }).map((_, i) =>
    String(i + 1),
  );

  //user cant select previous year / month / date. from today
  useEffect(() => {
    if (Number(slotDay) > daysInSelectedMonth) {
      console.log("daysIn Selected Month:", daysInSelectedMonth);
      setSlotDay(String(daysInSelectedMonth));
    }
  }, [slotMonth, slotYear, daysInSelectedMonth]);

  //to fetch services when in editing state
  useEffect(() => {
    let mounted = true;
    async function loadService() {
      if (!serviceId) return;
      try {
        const res = await fetch(`${API_BASE}/api/services/${serviceId}`);
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          console.warn("Failed to fetch service:", res.status, txt);
          showToast(
            "error",
            "Load failed",
            "Could not load service for editing.",
          );
          return;
        }
        const payload = await res.json().catch(() => null);
        const data = payload?.data || payload;
        if (!data) return;
        if (!mounted) return;

        setServiceName(data.name || "");
        setAbout(data.about || data.description || "");
        setPrice(data.price != null ? String(data.price) : "");
        setAvailability(data.available ? "available" : "unavailable");
        setInstructions(
          Array.isArray(data.instructions) && data.instructions.length
            ? data.instructions
            : [""],
        );

        if (data.slots) {
          const formattedSlots = [];

          Object.entries(data.slots).forEach(([date, times]) => {
            times.forEach((time) => {
              formattedSlots.push(`${date} • ${time}`);
            });
          });

          setSlots(formattedSlots);
        } else {
          setSlots([]);
        }

        if (data.imageUrl) {
          setImagePreview(data.imageUrl);
          setHasExistingImage(true);
          setRemoveImage(false);
        } else {
          setImagePreview(null);
          setHasExistingImage(false);
        }
      } catch (err) {
        console.error("loadService error:", err);
        showToast("error", "Network error", "Could not load service.");
      }
    }
    loadService();
    return () => {
      mounted = false;
    };
  }, [serviceId, API_BASE]);

  function handleImageChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (imagePreview && imagePreview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(imagePreview);
      } catch (err) {
        console.log(err);
      }
    }
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));

    //remove the existing image if user chooses a new file.
    setRemoveImage(false);
    setHasExistingImage(false);
  }

  //instructions helper function
  function addInstruction() {
    setInstructions((s) => [...s, ""]);
  }
  function updateInstruction(i, v) {
    setInstructions((s) => s.map((x, idx) => (idx === i ? v : x)));
  }
  function removeInstruction(i) {
    setInstructions((s) => s.filter((_, idx) => idx !== i));
  }

  //reset the form back to initial state
  function resetForm() {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(imagePreview);
      } catch (err) {
        console.log(err);
      }
    }
    setImagePreview(null);
    setImageFile(null);
    setHasExistingImage(false);
    setRemoveImage(false);
    setServiceName("");
    setAbout("");
    setPrice("");
    setAvailability("available");
    setInstructions([""]);
    setSlots([]);
    setErrors({});
  }

  //to show tost for 3.5sec
  function showToast(type, title, message) {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 3500);
  }

  //convert selected 12 hrs components to a Date Object
  function selectedDateTime() {
    const d = Number(slotDay);

    console.log("Date==", d);
    const m = Number(slotMonth);

    console.log("Month==", m);
    const y = Number(slotYear);

    console.log("Year==", y);
    let h = Number(slotHour);

    console.log("Hour==", h);
    const mm = Number(slotMinute);

    console.log("Minut==", mm);
    const ap = slotAmPm;

    console.log("AMPM ===", ap);

    if (ap === "AM") {
      if (h === 12) h = 0;
    } else {
      if (h !== 12) h = h + 12;
    }

    return new Date(y, m, d, h, mm, 0, 0);
  }

  console.log("Selected date and time me kush aya kyaa==", selectedDateTime());

  //to prevent user for selecting the past time for that particular date
  function isSelectedDateTimeInPast() {
    const sel = selectedDateTime();
    console.log("Sel.getTime==", sel.getTime());
    console.log("Date.now me==", Date.now());
    return sel.getTime() <= Date.now();
    // return sel.getTime() <= Date.now();
  }

  console.log(
    "Selected date and time in past me kush aya kya==",
    isSelectedDateTimeInPast(),
  );

  //to add or update a particular slots
  function addSlot() {
    const m = months[Number(slotMonth)];
    const d = String(slotDay).padStart(2, "0");
    const y = slotYear;
    const h = String(slotHour).padStart(2, "0");
    const mm = slotMinute;
    const ap = slotAmPm;
    const formatted = `${d} ${m} ${y} • ${h}:${mm} ${ap}`;

    console.log("Formated me kush aya kaya==", formatted);

    if (slots.includes(formatted)) {
      showToast(
        "error",
        "Duplicate Slot",
        "This time slot has already been added. Please select a different time.",
      );
      return;
    }

    if (isSelectedDateTimeInPast()) {
      showToast(
        "error",
        "Past Time",
        "You cannot add a time slot in the past. Please select a future date/time.",
      );
      setErrors((e) => ({ ...e, slots: true }));
      return;
    }

    setSlots((s) => [...s, formatted]);
    setErrors((e) => ({ ...e, slots: false }));
    showToast("success", "Slot Added", `Time slot added: ${formatted}`);
  }

  function removeSlot(i) {
    const removedSlot = slots[i];
    setSlots((s) => s.filter((_, idx) => idx !== i));
    showToast("info", "Slot Removed", `Removed: ${removedSlot}`);
  }

  //to validate that all fields are filled by user or not
  function validate() {
    const newErrors = {};
    if (!imageFile && !hasExistingImage) newErrors.image = true;
    if (!serviceName.trim()) newErrors.serviceName = true;
    if (!about.trim()) newErrors.about = true;
    if (!String(price).trim()) newErrors.price = true;
    if (!instructions.some((ins) => ins.trim())) newErrors.instructions = true;
    if (!slots.length) newErrors.slots = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  //submit function for creation and update
  async function handleSubmit(e) {
    console.log("========== SUBMIT START ==========");
    console.log("slots state =", slots);
    console.log("slots length =", slots.length);
    console.log("instructions =", instructions);
    console.log("serviceId =", serviceId);

    e.preventDefault();
    if (!validate()) {
      showToast(
        "error",
        "Missing Fields",
        "Please fill all required fields before submitting.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", serviceName);
      fd.append("about", about);
      const numericPrice = String(price).replace(/[^\d.-]/g, "");
      fd.append("price", numericPrice === "" ? "0" : numericPrice);
      fd.append("availability", availability);
      // arrays serialized as JSON
      fd.append("instructions", JSON.stringify(instructions));

      const slotsByDate = {};

      slots.forEach((slot) => {
        const [datePart, timePart] = slot.split(" • ");

        if (!slotsByDate[datePart]) {
          slotsByDate[datePart] = [];
        }

        slotsByDate[datePart].push(timePart);
      });

      fd.append("slots", JSON.stringify(slotsByDate));

      if (imageFile) {
        fd.append("image", imageFile);
      } else if (removeImage) {
        fd.append("removeImage", "true");
      }

      const url = serviceId
        ? `${API_BASE}/api/services/${serviceId}`
        : `${API_BASE}/api/services`;
      const method = serviceId ? "PUT" : "POST";

      console.log("========== FINAL FORM DATA ==========");

      for (const [key, value] of fd.entries()) {
        console.log(key, "=>", value);
      }




      
      const res = await fetch(url, { method, body: fd });
      const data = await res.json().catch(() => null);

      console.log("Data me kush aya kaya ", data);

      if (!res.ok) {
        const msg = data?.message || `Server error (${res?.status || "?"})`;
        showToast("error", "Save Failed", msg);
        setSubmitting(false);
        return;
      }

      showToast(
        "success",
        serviceId ? "Service Updated" : "Service Added",
        `${serviceName} saved with ${slots.length} slot(s).`,
      );

      if (!serviceId) {
        resetForm();
        if (fileRef.current) fileRef.current.value = null;
      } else {
        const saved = data?.data || null;
        if (saved) {
          setHasExistingImage(Boolean(saved.imageUrl));
          setImagePreview(saved.imageUrl || null);
          setImageFile(null);
          setRemoveImage(false);
        }
      }
    } catch (err) {
      console.error("service submit error:", err);
      showToast("error", "Network error", "Could not reach server.");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="min-h-screen font-serif relative flex items-center justify-center overflow-y-hidden">
      <div className="fixed font-serif top-6 right-6 z-50 w-full max-w-sm">
        {toast && (
          <div
            className={`flex items-start gap-4 p-4 rounded-2xl border shadow-xl transform transition-all duration-300 
                        ${
                          toast.type === "error"
                            ? "bg-linear-to-r from-red-50 to-orange-50 border-red-100"
                            : toast.type === "info"
                              ? "bg-linear-to-r from-blue-50 to-cyan-50 border-blue-100"
                              : "bg-linear-to-r from-emerald-50 to-teal-50 border-emerald-100"
                        } animate-slideIn`}
          >
            <div className={addServiceStyle.iconContainer(toast.type)}>
              {toast.type === "error" ? (
                <AlertTriangle className="w-5 h-5" />
              ) : toast.type === "info" ? (
                <Clock className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-800">
                {" "}
                {toast.title}
              </div>
              <div className="text-xs text-gray-600 mt-1 truncate">
                {toast.message}
              </div>
            </div>

            <button
              onClick={() => setToast(null)}
              className="p-1 rounded-full hover:bg-white/50 transition-colors"
            >
              <XCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white/90 backdrop-blur-sm rounded-lg p-6 sm:p-8 shadow-2xl border border-emerald-100/50 box-border"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-linear-to-r from-emerald-700 to-teal-600 bg-clip-text">
              {serviceId ? "Edit Service" : "Add Service"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create a beautiful service card with unique time slots
            </p>
          </div>
          <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-4 py-2 cursor-pointer rounded-full bg-white border border-emerald-100 hover:shadow transition-shadow duration-200"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex justify-center items-center gap-2 w-full sm:w-auto px-5 py-2 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                    Saving...
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {serviceId ? "Update Service" : "Save Service"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* left Side  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 md:col-span-1 col-span-1 flex flex-col items-center">
            <div className={addServiceStyle.container(errors.image)}>
              <div className="w-full h-56 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-emerald-100">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-emerald-400">
                    <Image className="w-10 h-10" />
                    <div className="mt-2 text-sm">Service image (required)</div>
                  </div>
                )}
              </div>
              <div className="w-full flex gap-2 items-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-200 hover:shadow transition-shadow"
                >
                  <Plus className="w-4 h-4" />{" "}
                  {imagePreview ? "Replace Image" : "Upload Image"}
                </button>

                {(imagePreview || hasExistingImage) && (
                  <button
                    type="button"
                    onClick={() => {
                      // If current preview is a blob URL, revoke it
                      if (imagePreview && imagePreview.startsWith("blob:")) {
                        try {
                          URL.revokeObjectURL(imagePreview);
                        } catch (e) {
                          console.log(e);
                        }
                      }
                      setImagePreview(null);
                      setImageFile(null);
                      // mark that user wants to remove the existing image
                      if (hasExistingImage) {
                        setRemoveImage(true);
                        setHasExistingImage(false);
                      }
                      if (fileRef.current) fileRef.current.value = null;
                    }}
                    className="px-3 py-2 rounded-full bg-white border border-red-100 hover:shadow transition-shadow"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>

              {hasExistingImage && (
                <div className="w-full text-xs text-gray-600 mt-2 flex items-center gap-2">
                  <input
                    id="remove-img"
                    type="checkbox"
                    checked={removeImage}
                    onChange={(e) => {
                      setRemoveImage(Boolean(e.target.checked));
                      if (e.target.checked) {
                        setImagePreview(null);
                        setImageFile(null);
                        setHasExistingImage(false);
                      }
                    }}
                    className="rounded"
                  />
                  <label htmlFor="remove-img">Remove existing image</label>
                </div>
              )}
            </div>
          </div>

          {/* Right side  */}

          <div className="lg:col-span-2 md:col-span-1 col-span-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-emerald-700">
                  Service name
                </label>
                <input
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. General Consultation"
                  className={addServiceStyle.formFields.input(
                    errors.serviceName,
                  )}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-emerald-700">
                  Price
                </label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="₹ 499"
                  className={addServiceStyle.formFields.input(errors.price)}
                  inputMode="numeric"
                />

                <div className="mt-3">
                  <label className="text-sm font-medium text-emerald-700">
                    Availability
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="mt-2 w-full px-4 py-3 rounded-full border border-emerald-100 text-gray-700 bg-white appearance-none focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-emerald-700">
                About this service
              </label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Short description"
                rows={4}
                className={addServiceStyle.formFields.textarea(errors.about)}
              />
            </div>
          </div>
        </div>

        {/* instructions */}
        <div className="mt-7">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-emerald-700">
              Instructions (point wise)
            </label>
            <button
              type="button"
              onClick={addInstruction}
              className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div
            className={addServiceStyle.instructions.container(
              errors.instructions,
            )}
          >
            {instructions.map((ins, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 my-2 bg-white rounded-full p-3 border border-emerald-50 shadow-sm hover:shadow transition-shadow min-w-0"
              >
                <div className="font-semibold text-emerald-600">{idx + 1}.</div>
                <input
                  value={ins}
                  onChange={(e) => updateInstruction(idx, e.target.value)}
                  placeholder={`Instruction ${idx + 1}`}
                  className="flex-1 min-w-0 px-3 py-2 rounded-full border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(idx)}
                    className="p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* slot controls */}
        <div className={addServiceStyle.slots.container(errors.slots)}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-emerald-700 font-medium">
              <Calendar className="w-5 h-5" /> Slots & Schedule
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500">
                {slots.length} slot{slots.length !== 1 ? "s" : ""} added
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 mb-4">
            <div className="min-w-0">
              <label className="text-xs text-gray-500">Day</label>
              <select
                value={slotDay}
                onChange={(e) => setSlotDay(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-full border border-emerald-100 text-gray-700 bg-white appearance-none focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              >
                {days.map((d) => {
                  const dNum = Number(d);
                  const disabled =
                    Number(slotYear) === currentYear &&
                    Number(slotMonth) === currentMonth &&
                    dNum < currentDate;
                  return (
                    <option key={d} value={d} disabled={disabled}>
                      {d}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="min-w-0">
              <label className="text-xs text-gray-500">Month</label>
              <select
                value={slotMonth}
                onChange={(e) => setSlotMonth(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-full border border-emerald-100 text-gray-700 bg-white appearance-none focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              >
                {months.map((m, idx) => {
                  const disabled =
                    Number(slotYear) === currentYear && idx < currentMonth;
                  return (
                    <option key={m} value={String(idx)} disabled={disabled}>
                      {m}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="min-w-0">
              <label className="text-xs text-gray-500">Year</label>
              <select
                value={slotYear}
                onChange={(e) => setSlotYear(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-full border border-emerald-100 text-gray-700 bg-white appearance-none focus:ring-2 focus:ring-emerald-200 focus:outline-none"
              >
                {years.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2 min-w-0">
              <div className="min-w-0">
                <label className="text-xs text-gray-500">Hour</label>
                <select
                  value={slotHour}
                  onChange={(e) => setSlotHour(e.target.value)}
                  className="mt-1 w-full px-2 py-2 rounded-full border border-emerald-100 text-gray-700 bg-white appearance-none focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                >
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-0">
                <label className="text-xs text-gray-500">Minute</label>
                <select
                  value={slotMinute}
                  onChange={(e) => setSlotMinute(e.target.value)}
                  className="mt-1 w-full px-2 py-2 rounded-full border border-emerald-100 text-gray-700 bg-white appearance-none focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                >
                  {minutes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-0">
                <label className="text-xs text-gray-500">AM/PM</label>
                <select
                  value={slotAmPm}
                  onChange={(e) => setSlotAmPm(e.target.value)}
                  className="mt-1 w-full px-1 py-2 rounded-full border border-emerald-100 text-gray-700 bg-white appearance-none focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                >
                  {ampm.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={addSlot}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4" /> Add This Time Slot
            </button>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-2">
              Added Slots ({slots.length})
            </div>

            <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-1 overflow-auto gap-2 max-h-screen pr-2">
              {slots.length === 0 ? (
                <div className="text-sm text-gray-400 italic px-4 py-2">
                  No slots added yet. Select a time and click "Add This Time
                  Slot"
                </div>
              ) : (
                slots.map((s, idx) => (
                  <div
                    key={s}
                    className="flex items-center gap-2 bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-100 px-2 py-2 my-1 rounded-full shadow hover:shadow-md transition-shadow min-w-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Clock className="w-4 h-4 xl:w-6 xl:h-6 text-emerald-600" />
                      <div className="text-xs whitespace-nowrap xl:text-xs lg:text-xs lg:whitespace-nowrap xl:whitespace-nowrap font-medium max-w-[180px] sm:max-w-[300px] md:max-w-[320px]">
                        {s}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSlot(idx)}
                      className="p-1 rounded-full xl:-mr-1 hover:bg-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </form>

      <style>{addServiceStyle.customCSS}</style>
    </div>
  );
};

export default AddServicePage;
