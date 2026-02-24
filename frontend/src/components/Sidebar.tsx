import { NavLink } from "react-router-dom"

export default function Sidebar() {
  const link =
    "block px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"

  const active = "bg-green-600 text-white"

  return (
    <aside className="w-72 bg-[#111116] border-r border-white/10 p-8 space-y-10">

      <div>
        <h1 className="text-2xl font-bold">
          MaungBiz<span className="text-green-500">Fund</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Community Fund
        </p>
      </div>

      <nav className="space-y-3">

        <NavLink to="/" className={({isActive}) =>
          `${link} ${isActive ? active : ""}`}>
          🏠 Overview
        </NavLink>

        <NavLink to="/projects" className={({isActive}) =>
          `${link} ${isActive ? active : ""}`}>
          🏪 Funded Projects
        </NavLink>

        <NavLink to="/apply" className={({isActive}) =>
          `${link} ${isActive ? active : ""}`}>
          📝 Apply for Funding
        </NavLink>

        <NavLink to="/treasury" className={({isActive}) =>
          `${link} ${isActive ? active : ""}`}>
          💰 Treasury
        </NavLink>

        <NavLink to="/governance" className={({isActive}) =>
          `${link} ${isActive ? active : ""}`}>
          🗳 Governance
        </NavLink>

        <NavLink to="/impact" className={({isActive}) =>
          `${link} ${isActive ? active : ""}`}>
          📊 Impact Report
        </NavLink>

      </nav>

      <div className="pt-8 border-t border-white/10 text-xs text-gray-500">
        A Community Fund Initiated by Faizal 
      </div>

    </aside>
  )
}
