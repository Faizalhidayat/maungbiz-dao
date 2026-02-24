import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./Layout"

// Pages
import Dashboard from "../pages/Dashboard"
import Projects from "../pages/Projects"
import ProjectDetail from "../pages/ProjectDetail"
import Apply from "../pages/Apply"
import Treasury from "../pages/Treasury"
import Governance from "../pages/Governance"
import Impact from "../pages/Impact"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>

          {/* ================= MAIN ROUTES ================= */}

          <Route path="/" element={<Dashboard />} />

          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />

          <Route path="/apply" element={<Apply />} />

          <Route path="/treasury" element={<Treasury />} />

          <Route path="/governance" element={<Governance />} />

          <Route path="/impact" element={<Impact />} />

          {/* ================= FALLBACK ROUTE ================= */}

          <Route
            path="*"
            element={
              <div className="text-white text-3xl p-10">
                404 — Page Not Found
              </div>
            }
          />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}
