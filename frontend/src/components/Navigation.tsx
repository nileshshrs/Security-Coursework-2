import React, { useRef, useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import UserDropdown from "./UserDropdown";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", to: "/" },
  { name: "All", to: "/all" },
  { name: "Men's", to: "/mens" },
  { name: "Women's", to: "/womens" },
];

export default function Navigation() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "w-full border-b border-gray-200 bg-white z-50 transition-all duration-300",
        scrolled ? "fixed top-0" : "relative"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-2 flex h-14 items-center justify-between">
        {/* LEFT: Logo */}
        <div className="flex items-center gap-2">
          <span
            className="text-2xl font-bold italic select-none"
            style={{ fontFamily: "'Felipa', cursive" }}
          >
            CUT<span className="text-red-500">S</span>
          </span>
        </div>

        {/* CENTER: NavLinks (lg and up only) */}
        <div className="hidden lg:flex justify-center items-center gap-10 h-full">
          {navItems.map((item) => (
            <NavLink key={item.name} to={item.to} end={item.to === "/"}>
              {({ isActive }) => (
                <span
                  className="group flex flex-col items-center cursor-pointer select-none uppercase text-[15px] tracking-wide px-1 py-1 font-mono font-semibold"
                  style={{
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

        {/* RIGHT: Search + Cart + User + Sheet toggle */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div
            className={cn(
              "relative overflow-hidden transition-all duration-300 ease-in-out",
              searchOpen ? "w-48 sm:w-56 md:w-64 lg:w-80" : "w-0"
            )}
          >
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={cn(
                "h-9 text-sm transition-opacity duration-300",
                searchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            />
            {searchOpen && (
              <button
                onClick={() => {
                  setSearchValue("");
                  setSearchOpen(false);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {!searchOpen && (
            <Button
              variant="outline"
              size="icon"
              className="w-9 h-9 border-gray-300 hover:border-black"
              onClick={() => {
                setSearchOpen(true);
                setTimeout(() => inputRef.current?.focus?.(), 100);
              }}
              aria-label="Search"
            >
              <svg
                className="w-4 h-4 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.15 6.15z"
                />
              </svg>
            </Button>
          )}

          {/* Cart Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative w-9 h-9 border-gray-300 hover:border-black"
                aria-label="Shopping Bag"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13L17 13M7 13h10m-6 0v6"
                  />
                </svg>
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  3
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="pt-10 px-6 flex flex-col h-screen w-full lg:w-[60vw] xl:w-[40vw] md:w-[40vw] max-w-none"
            >
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="mb-4 border-b pb-3">
                  <h2 className="text-lg font-bold">Your Cart</h2>
                </div>

                <ScrollArea className="h-full pr-2">
                  <div className="flex flex-col gap-5 pb-4">
                    {[1, 2, 3, 4, 5].map((id) => (
                      <div key={id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-md" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">Product #{id}</p>
                          <p className="text-xs text-gray-500">Size: M</p>
                        </div>
                        <p className="font-semibold text-sm">$25</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="mt-4 border-t pt-4 pb-6">
                <div className="flex justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Subtotal</span>
                  <span className="text-sm font-bold">$200</span>
                </div>
                <Button className="w-full uppercase font-semibold text-sm">
                  Checkout
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* User Controls */}
          {user ? (
            <UserDropdown />
          ) : (
            <>
              <Link to="/sign-in">
                <Button
                  variant="default"
                  className="h-8 text-xs px-4 uppercase font-mono font-semibold"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button
                  variant="outline"
                  className="h-8 text-xs px-4 uppercase font-mono font-semibold"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {/* Nav Sheet Toggle (Mobile) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="ml-1 lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="sm:w-[70vw] md:w-[40vw] pt-10 px-6"
            >
              <div className="mb-8 border-b pb-3">
                <span className="text-xl font-bold italic select-none" style={{ fontFamily: "'Felipa', cursive" }}>
                  CUT<span className="text-red-500">S</span>
                </span>
              </div>
              <nav className="flex flex-col gap-6">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      `text-[15px] font-semibold uppercase font-mono tracking-wide ${
                        isActive ? "text-black" : "text-gray-600"
                      } hover:text-black transition-colors`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
