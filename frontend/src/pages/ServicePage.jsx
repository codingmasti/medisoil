import { useEffect, useState } from 'react';
import ServiceCard from '../components/ServiceCard'

const ServicePage = ({previewCount = 9999}) => {
      const API_BASE = "http://localhost:4000";
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadServices() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/services`);
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          (json && json.message) || `Failed to load services (${res.status})`;
        setError(msg);
        setServices([]);
        setLoading(false);
        return;
      }

      const items = (json && (json.data || json)) || [];
      const normalized = (Array.isArray(items) ? items : []).map((s) => {
        const id = s._id || s.id;
        const image = s.imageUrl || s.image || s.imageSmall || "";
        const available =
          typeof s.available === "boolean"
            ? s.available
            : typeof s.availability === "string"
              ? s.availability.toLowerCase() === "available"
              : s.availability === "Available" || s.available === true;

        return {
          id,
          name: s.name || "Service",
          shortDescription: s.shortDescription || s.about || "",
          image,
          imageSmall: s.imageSmall || null,
          imageMedium: s.imageMedium || null,
          imageLarge: s.imageLarge || null,
          imageSrcSet: s.imageSrcSet || null,
          imageWebp: s.imageWebp || null,
          price: s.price ?? s.fee ?? 0,
          available,
          raw: s,
        };
      });

      setServices(normalized);
    } catch (err) {
      console.error("load services error:", err);
      setError("Network error while loading services.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, [API_BASE]);

  const shown = services.slice(0, previewCount);
  return (
    <div className="min-h-screen py-12 px-6 lg:px-20 font-serif bg-linear-to-b from-emerald-50 to-white">
        <div className="max-w-6xl mx-auto">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-emerald-900">Our Diagnostic Services</h1>
                <p className="mt-2 text-emerald-800/80">
                Safe, accurate & reliable testing.</p>
            </header>
            {
                error && (
                    <div className="text-center mb-6">
                        <div className="text-sm text-rose-600 mb-2">{error}</div>
                        <button onClick={loadServices} className="px-4 py-2 rounded-full bg-emerald-600 text-white">Retry</button>
                    </div>
                )
            }

            {loading ? (
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {Array.from({length: 8}).map((_,i) => (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            <div className="w-full h-48 bg-emerald-100 rounded mb-4"></div>
                            <div className="h-5 bg-emerald-100 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-emerald-100 rounded w-1/2 mb-4"></div>
                            <div className="h-10 bg-emerald-100 rounded w-full"></div>
                        </div>
                    ))}
                </section>
            ) : (
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
                    {shown.length > 0 ? (
                        shown.map((s) => <ServiceCard key={s.id || s.name} service={s} />)
                    ) : (
                        <div className='col-span-full text-center py-10 text-emerald-800 font-medium text-base'>
                            No services Available
                        </div>
                    )}
                </section>
            )}
        </div>
    </div>
  )
}

export default ServicePage