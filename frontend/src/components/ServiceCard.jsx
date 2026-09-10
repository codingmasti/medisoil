import { ChevronsRight, MousePointer2Off } from "lucide-react";
import { Link } from "react-router-dom";

const PlaceholderImg = "/placeholder-service.jpg";

const ServiceCard = ({ service }) => {
  const hasSrcSet =
    !!service.imageSrcSet ||
    (!!service.imageSmall && !!service.imageMedium && !!service.imageLarge);

  const src = service.imageUrl || service.image || service.imageSmall || "";
  const srcSet =
    service.imageSrcSet ||
    (service.imageSmall || service.image
      ? `${service.imageSmall || src} 480w, ${
          service.imageMedium || src
        } 768w, ${service.imageLarge || src} 1200w`
      : null);

  const name = service.name || "Service";
  const shortDescription = service.shortDescription || service.about || "";

  return (
    <div className="group rounded-2xl overflow-hidden bg-white shadow-xl hover:-translate-y-2 transition-transform duration-500 border border-emerald-100">
      <div className="w-full overflow-hidden bg-emerald-50/30 flex items-center justify-center" aria-hidden="true">
        {hasSrcSet ? (
          <picture className="w-full">
            {service.imageWebp && (
              <source srcSet={service.imageWebp} type="image/webp" />
            )}
            {service.imageSrcSet ? (
              <img
                src={src || PlaceholderImg}
                srcSet={service.imageSrcSet}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                alt={name}
                loading="lazy"
                decoding="async"
                className="w-full h-40 sm:h-48 md:h-56 lg:h-60 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PlaceholderImg;
                }}
              />
            ) : (
              <img
                src={src || PlaceholderImg}
                srcSet={srcSet || undefined}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                alt={name}
                loading="lazy"
                decoding="async"
                className="w-full h-40 sm:h-48 md:h-56 lg:h-60 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PlaceholderImg;
                }}
              />
            )}
          </picture>
        ) : (
          <img
            src={src || PlaceholderImg}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-60 sm:h-48 md:h-56 lg:h-60 object-cover object-center transform transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PlaceholderImg;
            }}
          />
        )}
      </div>

      <div className="p-5 text-center">
        <h3 className="text-lg md:text-sm whitespace-nowrap font-semibold font-serif text-emerald-900">{name}</h3>

        <div className="mt-4">
          {service.available ? (
            <Link
              to={`/services/${service.id}`}
              state={{ service: service.raw || service }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 w-full rounded-full bg-emerald-500 text-white font-medium"
              aria-label={`Book ${name}`}
            >
              <ChevronsRight className="w-5 h-5" aria-hidden="true" />
              Book Now
            </Link>
          ) : (
            <button
              disabled
              className="px-5 py-2 w-full flex items-center justify-center gap-2 rounded-full bg-gray-200 text-gray-500 cursor-not-allowed border"
              aria-label={`${name} not available`}
            >
              <MousePointer2Off className="w-5 h-5" aria-hidden="true" />
              Not Available
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;