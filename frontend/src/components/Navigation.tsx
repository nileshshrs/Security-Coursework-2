import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { NavLink, Link } from "react-router-dom";

const navItems = [
  { name: "Home", to: "/" },
  { name: "All", to: "/all" },
  { name: "Men's", to: "/mens" },
  { name: "Women's", to: "/womens" },
];

export default function Navigation() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-2 flex h-14 items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center h-full">
          <span
            className="text-2xl font-bold italic select-none"
            style={{ fontFamily: "'Felipa', cursive" }}
          >
            CUT<span className="text-red-500">S</span>
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex justify-center items-center gap-10 h-full">
          {navItems.map((item) => (
            <NavLink key={item.name} to={item.to} end={item.to === "/"}>
              {({ isActive }) => (
                <span
                  className="group flex flex-col items-center cursor-pointer select-none uppercase text-[15px] tracking-wide px-1 py-1 font-mono font-semibold"
                  style={{
                    color: "#000",
                    fontFamily: "'Roboto Mono', monospace",
                    letterSpacing: "0.09em",
                  }}
                >
                  <span>{item.name}</span>
                  <span
                    className={`block h-[2px] bg-black rounded-full mt-1 w-7 transition-transform duration-300 origin-center ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right Side (Search + Buttons) */}
        <div className="flex items-center gap-2">
          {/* Expanding Search Bar */}
          <form
            className="relative hidden md:flex items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Search Icon */}
            <button
              type="button"
              aria-label="Search"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-black z-10 focus:outline-none"
              tabIndex={0}
              onClick={() => {
                setSearchOpen(true);
                setTimeout(() => inputRef.current?.focus(), 10);
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {/* Clear Button */}
            {searchValue && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  setSearchOpen(false);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-black z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search products, brands, and more"
              className={`transition-all duration-300 ease-in-out bg-white border border-gray-400 text-sm px-9 py-1 h-8 rounded font-mono
                ${searchOpen || searchValue
                  ? "w-[280px] opacity-100"
                  : "w-0 px-0 border-transparent opacity-0"
                }
                outline-none focus:border-black
              `}
              style={{ fontFamily: "'Roboto Mono', monospace" }}
              onBlur={() => {
                if (!searchValue) setSearchOpen(false);
              }}
              onFocus={() => setSearchOpen(true)}
            />
          </form>

          {/* Sign In / Sign Up */}
          <Link to="/sign-in">
            <button
              className="uppercase border-black border-[1.5px] px-4 py-1 h-8 text-xs rounded-sm font-semibold bg-black text-white font-mono"
              style={{ fontFamily: "'Roboto Mono', monospace" }}
            >
              SIGN IN
            </button>
          </Link>
          <Link to="/sign-up">
            <button
              className="uppercase border-black border-[1.5px] px-4 py-1 h-8 text-xs rounded-sm font-semibold bg-white text-black hover:bg-black hover:text-white font-mono transition-colors"
              style={{ fontFamily: "'Roboto Mono', monospace" }}
            >
              SIGN UP
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
