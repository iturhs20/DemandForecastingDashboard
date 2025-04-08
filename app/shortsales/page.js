import ShortfallCalculator from "../components/shortfall"
import Navbar from "../components/navbar"
import Sidebar from "../components/sidenavbar"

export default function HomePage() {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar wrapper with custom styling for this page */}
          <Navbar />
        
        {/* Main Content with Scrolling */}
        <main className="flex-1 overflow-y-auto">
          <ShortfallCalculator />
        </main>
      </div>
    </div>
  )
}