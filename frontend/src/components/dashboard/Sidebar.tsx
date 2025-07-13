import { AiOutlineClose } from "react-icons/ai";
import { BsGrid1X2, BsArchive, BsPerson } from "react-icons/bs";
import { BiLogOut, BiHome } from "react-icons/bi";
import { GiClothes } from "react-icons/gi";
import { Link } from "react-router-dom";

type SidebarProps = {
  open: boolean;
  slide: () => void;
};

const navLinks = [
  { to: "/dashboard", icon: <BsGrid1X2 />, label: "Dashboard" },
  { to: "/", icon: <BiHome />, label: "Home" },
  { to: "/dashboard/clothes", icon: <GiClothes />, label: "Clothes" },
  { to: "/dashboard/users", icon: <BsPerson />, label: "Users" },
  { to: "/dashboard/orders", icon: <BsArchive />, label: "Order" },
];

const Sidebar = ({ open, slide }: SidebarProps) => (
  <div
    className={[
      // --- Base styles ---
      "flex flex-col gap-8 border-r border-[#d3d1d1] bg-white p-2.5 px-5 z-[99] transition-all duration-300",
      // --- Fixed/Static, Width, Height, Slide in/out ---
      "fixed md:static",
      open
        ? "top-0 left-0 w-4/5 max-w-xs translate-x-0 shadow-[10px_0px_30px_-15px_rgba(0,0,0,0.75)] h-screen"
        : "w-0 overflow-hidden p-0 border-0 top-0 left-0 -translate-x-full shadow-none h-0",
      "md:sticky md:top-0 md:left-0 md:min-w-[250px] md:w-[250px] md:translate-x-0 md:shadow-none md:h-screen"
    ].join(" ")}
    style={{ transition: "all 0.3s" }}
  >
    {/* Close Button - only on mobile */}
    <button
      className="absolute left-2 top-2 block md:hidden"
      onClick={slide}
      aria-label="Close Sidebar"
    >
      <AiOutlineClose />
    </button>
    <header className="max-w-full">
      <Link to="/">
        <h2
          className="pl-9 pr-9 font-bold text-[1.5rem]"
          style={{ fontFamily: "Felipa, serif" }}
        >
          CUT<span className="text-red-600">'S</span>
        </h2>
      </Link>
    </header>
    <a
      href="#"
      className="w-[90%] mx-auto flex justify-center items-center gap-3 p-2 bg-[#dadada] transition-colors border font-bold rounded-md text-[1rem] hover:bg-[#111] hover:text-white"
      style={{ fontFamily: "sans-serif" }}
    >
      <img src="" alt="N" width={30} height={30} className="rounded-full border h-[50px] w-[50px]" />
      <span className="w-full truncate">account</span>
    </a>
    <nav className="w-full">
      <ul className="grid gap-4">
        {navLinks.map(({ to, icon, label }) => (
          <li key={label}>
            <Link
              to={to}
              className="w-full px-5 py-2.5 rounded-lg flex items-center gap-3 font-mono font-bold text-xs transition-all duration-200 hover:bg-[#111] hover:text-white hover:py-4"
            >
              {icon} {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
    {/* Logout button right below nav links */}
    <div className="w-full flex items-center justify-center mt-4">
      <button className="flex items-center justify-center gap-1 w-[80%] px-5 py-2.5 border border-[#4d4d4d] bg-[#4d4d4d] font-bold text-base rounded-lg transition-colors text-white hover:bg-[#111] hover:text-white">
        <BiLogOut /> Logout
      </button>
    </div>
  </div>
);

export default Sidebar;
