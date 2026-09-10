import {
    Activity,
    ArrowRight,
    Mail,
    MapPin,
    Phone,
    Stethoscope,
} from "lucide-react";

import Logo from "../assets/logo.png";

const Footer = () => {
    const quickLinks = [
        "Home",
        "Doctors",
        "Services",
        "Contact",
        "Appointments",
    ];

    const services = [
        "Blood Pressure Check",
        "Blood Sugar Test",
        "Full Blood Count",
        "X-Ray Scan",
        "Health Consultation",
    ];

    return (
        <footer className="relative overflow-hidden bg-[#effcf8] text-[#386d63]">

            {/* Decorative Icons */}
            <Stethoscope
                size={25}
                className="pointer-events-none absolute right-5 top-5 text-[#249b7e]"
            />

            {/* Main Footer */}
            <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">

                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

                    {/* Logo + Description + Contact */}
                    <div className="sm:col-span-2 lg:col-span-1">

                        {/* Logo */}
                        <div className="mb-5 flex items-center gap-3">
                            <img
                                src={Logo}
                                alt="Medisoil Logo"
                                className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                            />

                            <div>
                                <span className="text-2xl font-bold text-[#1976D2] sm:text-3xl">
                                    Medi<span className="text-[#14B8A6]">soil</span>
                                </span>

                                <p className="text-xs text-[#386d63] sm:text-sm">
                                    Healthcare Solutions
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="mb-6 max-w-md text-sm italic leading-6 text-[#4b786f]">
                            Your trusted partner in healthcare innovation. We're
                            committed to providing exceptional medical care with
                            cutting-edge technology and compassionate service.
                        </p>

                        {/* Contact */}
                        <div className="space-y-4">

                            {/* Phone */}
                            <div className="flex items-center gap-3 text-sm">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dcf8ef] text-[#28ae88]">
                                    <Phone size={17} />
                                </span>

                                <span className="break-all">
                                    +91 8299431275
                                </span>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-3 text-sm">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dcf8ef] text-[#28ae88]">
                                    <Mail size={17} />
                                </span>

                                <span className="break-all">
                                    hexagonservices@gmail.com
                                </span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-3 text-sm">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dcf8ef] text-[#28ae88]">
                                    <MapPin size={17} />
                                </span>

                                <span>
                                    Lucknow, India
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-6 text-lg font-bold text-[#255e54] sm:text-xl">
                            Quick Links
                        </h3>

                        <ul className="space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="group flex items-center gap-3 text-sm transition-all duration-300 hover:translate-x-1 hover:text-[#16a878]"
                                    >
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#dcf8ef] text-[#35b990] transition-all duration-300 group-hover:bg-[#bff0e1]">
                                            <ArrowRight size={14} />
                                        </span>

                                        <span>{link}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="mb-6 text-lg font-bold text-[#255e54] sm:text-xl">
                            Our Services
                        </h3>

                        <ul className="space-y-4">
                            {services.map((service, index) => (
                                <li
                                    key={`${service}-${index}`}
                                    className="flex items-center gap-3 text-sm"
                                >
                                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#20b47f]" />

                                    <span>
                                        {service}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CTA / Working Hours */}
                    <div>
                        <h3 className="mb-6 text-lg font-bold text-[#255e54] sm:text-xl">
                            Need Medical Help?
                        </h3>

                        <p className="mb-5 text-sm leading-6 text-[#4b786f]">
                            Book an appointment with our healthcare
                            professionals and get the care you need.
                        </p>

                        <button
                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#20b47f] to-[#14b8a6] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-fit"
                        >
                            <span>Book Appointment</span>

                            <ArrowRight
                                size={17}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </button>

                        {/* Working Hours */}
                        <div className="mt-6 rounded-xl border border-[#ccefe4] bg-white/60 p-4">
                            <h4 className="mb-2 text-sm font-semibold text-[#255e54]">
                                Working Hours
                            </h4>

                            <p className="text-xs leading-5 text-[#4b786f]">
                                Mon - Sat: 9:00 AM - 6:00 PM
                                <br />
                                Sunday: Emergency Only
                            </p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-10 h-px bg-[#ccefe4]" />

                {/* Bottom Footer */}
                <div className="flex flex-col items-center justify-between gap-3 text-center text-xs text-[#5d8279] sm:flex-row sm:text-left">

                    <p>
                        © {new Date().getFullYear()} Medisoil. All rights reserved.
                    </p>

                    <div className="flex gap-5">
                        <a
                            href="#"
                            className="transition-colors hover:text-[#16a878]"
                        >
                            Privacy Policy
                        </a>

                        <a
                            href="#"
                            className="transition-colors hover:text-[#16a878]"
                        >
                            Terms & Conditions
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;