import Sidebar from "@/components/dashboard/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white relative">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} slide={() => setSidebarOpen(false)} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Row: Hamburger + Heading + Add Clothes */}
        <div className="flex items-center justify-between gap-2 mb-6 min-w-0 p-4">
          {/* Hamburger for mobile/tablet */}
          <button
            className="md:hidden flex-shrink-0 p-2 text-2xl bg-white rounded"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Sidebar"
            style={{ border: "none" }}
          >
            <span className="block w-6 h-0.5 bg-black mb-1"></span>
            <span className="block w-6 h-0.5 bg-black mb-1"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </button>
          {/* Heading */}
          <h1 className="flex-1 text-lg sm:text-xl md:text-2xl font-bold text-center md:text-left truncate mx-2">
            Welcome to Dashboard
          </h1>
          <button
            type="button"
            className="flex-shrink-0 bg-black text-white px-2 sm:px-4 py-2 rounded font-semibold text-xs sm:text-sm md:text-base hover:bg-gray-900 transition-colors"
            style={{ minWidth: "90px" }}
          >
            Add Clothes
          </button>
        </div>
        {/* Browser scrolls whole page. No overflow-y-auto here! */}
        <div className="px-4 pb-4">
          <Outlet />
        </div>
      </div>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[98] md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close Sidebar Overlay"
        />
      )}
    </div>
  );
};

export default Dashboard;
