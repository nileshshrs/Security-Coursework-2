import ClothesDialog from "@/components/dashboard/ClothesDialog";
import Sidebar from "@/components/dashboard/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clothesDialogOpen, setClothesDialogOpen] = useState(false);

  return (
    <>
      <div className="flex min-h-screen bg-white relative">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} slide={() => setSidebarOpen(false)} />
        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full max-w-full">
          {/* Header Row */}
          <div
            className="
            flex items-center justify-between gap-1 mb-4 min-w-0
            px-2 py-2
            sm:gap-2 sm:mb-6 sm:px-4
          "
          >
            {/* Hamburger */}
            <button
              className="md:hidden flex-shrink-0 p-2 text-lg sm:text-2xl bg-white rounded"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Sidebar"
              style={{ border: "none" }}
            >
              <span className="block w-5 h-0.5 bg-black mb-1"></span>
              <span className="block w-5 h-0.5 bg-black mb-1"></span>
              <span className="block w-5 h-0.5 bg-black"></span>
            </button>
            {/* Heading */}
            <h1
              className="
              flex-1 text-base sm:text-lg md:text-2xl font-bold
              text-center md:text-left truncate mx-1 sm:mx-2
            "
              style={{ minWidth: 0 }}
            >
              Welcome to Dashboard
            </h1>
            <button
              type="button"
              className="
              flex-shrink-0 bg-black text-white
              px-2 sm:px-4 py-2 rounded font-semibold
              text-xs sm:text-sm md:text-base
              hover:bg-gray-900 transition-colors
              ml-1
            "
              style={{ minWidth: "80px" }}
              onClick={() => setClothesDialogOpen(true)}
            >
              Add Clothes
            </button>
          </div>
          {/* Dialog */}

          {/* --- THE FIX: Outlet is in a wrapper with w-full max-w-full --- */}
          <div className="w-full max-w-full px-2 sm:px-4 pb-4">
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
      <ClothesDialog
        open={clothesDialogOpen}
        onOpenChange={setClothesDialogOpen}
      />
    </>
  );
};

export default Dashboard;
