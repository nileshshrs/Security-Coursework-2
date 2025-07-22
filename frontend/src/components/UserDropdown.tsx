import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const UserDropdown = () => {
  const { user, logout } = useAuth();

  const fallbackLetter = user?.username?.[0]?.toUpperCase() || "A";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="relative w-9 h-9">
          <Avatar className="w-9 h-9 cursor-pointer shadow-[0_0_0_3px_rgba(0,0,0,0.06)] transition-shadow duration-200 hover:shadow-[0_0_0_4px_rgba(0,0,0,0.14)]">
            <AvatarImage
              src={user?.image}
              alt="User"
              className="aspect-square object-cover"
            />
            <AvatarFallback className="bg-black text-white text-sm uppercase font-bold">
              {fallbackLetter}
            </AvatarFallback>
          </Avatar>

          {/* Exclamation badge if user is not verified */}
          {user && user.verified === false && (
            <span
              className="absolute -top-1 -right-1 z-10 w-4 h-4 flex items-center justify-center rounded-full bg-yellow-400 border-2 border-white text-xs font-extrabold text-white shadow"
              title="Account not verified. A verification email has been sent."
            >
              !
            </span>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[220px] mt-2 bg-white text-sm text-gray-900 font-semibold rounded-md p-1 border border-gray-200 shadow-md"
      >
        <div className="px-3 py-2 text-[14px] select-none text-gray-600">
          {user?.username || "Unknown user"}
        </div>

        <DropdownMenuItem
          asChild
          className="px-3 py-2 text-[13px] cursor-pointer rounded-md transition-colors hover:bg-gray-100"
        >
          <Link to="/account">Account</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => logout()}
          className="px-3 py-2 text-[13px] cursor-pointer rounded-md transition-colors hover:bg-gray-100"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
