import ShortfallCalculator from "../components/shortsales/shortfall"
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
        <main className="flex-1 overflow-y-auto" style={{ background: 'linear-gradient(135deg, #024673 0%, #5C99E3 50%, #756CE5 100%)' }}>
          <ShortfallCalculator />
        </main>
      </div>
    </div>
  )
}