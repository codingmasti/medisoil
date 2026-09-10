import { certificationStyle } from "../assets/style/style";

import C1 from "../assets/image/C1.png";
import C2 from "../assets/image/C2.png";
import C3 from "../assets/image/C3.png";
import C4 from "../assets/image/C4.svg";
import C5 from "../assets/image/C5.png";
import C6 from "../assets/image/C6.png";
import C7 from "../assets/image/C7.svg";

const Certification = () => {
  const certifications = [
    {
      id: 1,
      name: "Medical Commission",
      image: C1,
      type: "international",
    },
    {
      id: 2,
      name: "Government Approved",
      image: C2,
      type: "government",
    },
    {
      id: 3,
      name: "NABH Accredited",
      image: C3,
      alt: "NABH Accreditation",
      type: "healthcare",
    },
    {
      id: 4,
      name: "Medical Council",
      image: C4,
      type: "government",
    },
    {
      id: 5,
      name: "Quality Healthcare",
      image: C5,
      alt: "Quality Healthcare",
      type: "healthcare",
    },
    {
      id: 6,
      name: "Paramedical Council",
      image: C6,
      alt: "Patient Safety",
      type: "healthcare",
    },
    {
      id: 7,
      name: "Ministry of Health",
      image: C7,
      alt: "Ministry of Health",
      type: "government",
    },
  ];

  const duplicatedCertifications = [
    ...certifications,
    ...certifications,
    ...certifications,
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-10">

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60" />

        <div className="absolute inset-0 opacity-[0.03]">
          <div className="grid h-full w-full grid-cols-12 gap-4">
            {Array.from({ length: 144 }).map((_, i) => (
              <div
                key={i}
                className="rounded border border-green-300"
              />
            ))}
          </div>
        </div>

      </div>

      {/* Main content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center">

          <div className="relative inline-block">

            {/* Left line */}
            <div className="absolute -left-20 top-1/2 hidden h-0.5 w-16 -translate-y-1/2 bg-gradient-to-r from-transparent to-green-400 sm:block" />

            {/* Right line */}
            <div className="absolute -right-20 top-1/2 hidden h-0.5 w-16 -translate-y-1/2 bg-gradient-to-r from-green-400 to-transparent sm:block" />

            <h2 className="text-3xl font-serif tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                CERTIFICATION & EXCELLENCE
              </span>
            </h2>

          </div>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed tracking-wide text-gray-600 sm:text-lg">
            Government recognized and internationally accredited
            healthcare standards
          </p>

          {/* Certified badge */}
          <div className="mt-5 inline-flex items-center rounded-full border border-green-400/30 bg-green-500/10 px-5 py-2.5 backdrop-blur-sm">

            <div className="mr-3 h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />

            <span className="text-sm font-semibold tracking-wide text-green-700">
              OFFICIALLY CERTIFIED
            </span>

          </div>

        </div>

        {/* Certifications */}
        <div className="relative mt-10">

          <div className="overflow-hidden">

            <div className="flex w-max animate-marquee-single items-center py-5">

              {duplicatedCertifications.map((cert, index) => (
                <div
                  key={`cert-${cert.id}-${index}`}
                  className="group mx-8 flex w-32 flex-col items-center sm:mx-10"
                >

                  {/* Image */}
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white p-3 shadow-md transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl">

                    <img
                      src={cert.image}
                      alt={cert.alt || cert.name}
                      className="h-16 w-16 object-contain transition-transform duration-500 group-hover:scale-110"
                    />

                  </div>

                  {/* Name */}
                  <span className="mt-3 text-center font-serif text-sm font-semibold italic leading-tight text-gray-700 transition-colors duration-300 group-hover:text-green-700">
                    {cert.name}
                  </span>

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

      <style>{certificationStyle.animationStyles}</style>

    </section>
  );
};

export default Certification;