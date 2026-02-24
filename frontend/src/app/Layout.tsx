import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#0b0f14]">
      <Sidebar />
      <main className="flex-1 p-12 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
