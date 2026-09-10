import Logo from "../assets/logo.png"
const Hero = ({ role = "admin", userName = "Doctor" }) => {
  const isDoctor = role === "doctor";
  return (
    <main className="w-200 p-5 bg-white border-2 border-gray-200 rounded-2xl flex flex-col items-center justify-center ">
      <div className="flex flex-col items-center justify-center text-center">
        <img src={Logo} alt="logo" width={100} height={100} className="mb-5" />
        <h1 className="text-4xl font-extrabold text-[#14b8a6] mb-2">{isDoctor ? `Welcome, Dr.${userName}` : "WELCOME TO MEDISOIL ADMIN PANEL"}</h1>
        <p className="text-gray-700">Manage hospital operations,doctors, staff, patient records, and system settings from a <br />centralized control panel.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-[95%] mt-5">
        <div className="bg-green-200 p-3 rounded-lg border-2 border-green-300">
          <h3 className="font-bold text-lg text-green-400">Secure Access</h3>
          <p className="text-gray-700 text-sm">Role based login with protected medical data.</p>
        </div>

        <div className="bg-green-200 p-3 rounded-lg border-2 border-green-300">
          <h3 className="font-bold text-lg text-green-400">Secure Access</h3>
          <p className="text-gray-700 text-sm">Role based login with protected medical data.</p>
        </div>

        <div className="bg-green-200 p-3 rounded-lg border-2 border-green-300">
          <h3 className="font-bold text-lg text-green-400">Secure Access</h3>
          <p className="text-gray-700 text-sm">Role based login with protected medical data.</p>
        </div>
      </div>
    </main>
  )
}

export default Hero