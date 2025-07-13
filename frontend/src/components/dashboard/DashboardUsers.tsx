import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const users = [
  {
    id: 1,
    username: "admin",
    name: "admin_user",
    email: "admin@admin.com",
    role: "admin",
  },
  {
    id: 4,
    username: "nileshshrs",
    name: "nileshshrs",
    email: "nileshshr979@gmail.com",
    role: "users",
  },
  // Add more as needed
];

export default function DashboardUsers() {
  return (
    <div
      className="w-full max-w-full mx-auto py-8 px-2 sm:px-4"
      style={{ containerType: "inline-size" }} // Enable container queries
    >
      <h2 className="text-2xl font-bold mb-1">User Details</h2>
      <p className="text-sm text-gray-400 mb-6">All registered users</p>
      <div className="w-full">
        <ScrollArea className="w-full max-w-full rounded-2xl border bg-white shadow-lg">
          <div className="min-w-[700px] @container">
            {/* Table Heading Row */}
            <div className="grid grid-cols-[50px_2fr_2fr_3fr_2fr_1fr] text-[15px] font-bold bg-black text-white border-b border-gray-200 px-5 py-3 rounded-t-2xl">
              <div>#</div>
              <div>Username</div>
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div className="flex justify-end">Action</div>
            </div>
            {/* Table Body */}
            <ScrollArea className="h-[650px] w-full px-0">
              <div>
                {users.length > 0 ? (
                  users.map((user, idx) => (
                    <div
                      key={user.id}
                      className={[
                        "grid grid-cols-[50px_2fr_2fr_3fr_2fr_1fr] items-center px-5 py-3 text-[15px]",
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50",
                        "border-b border-gray-100 last:border-b-0",
                        "transition hover:bg-gray-100",
                        "@container max-w-[450px]:grid-cols-1",
                      ].join(" ")}
                    >
                      <div className="text-gray-400 font-mono">{String(idx + 1).padStart(2, "0")}</div>
                      <div className="font-medium text-gray-800 truncate">{user.username}</div>
                      <div className="text-gray-700 truncate">{user.name}</div>
                      <div className="text-gray-700 truncate">{user.email}</div>
                      <div className="text-gray-600 truncate capitalize">{user.role}</div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          className="bg-black text-white hover:bg-neutral-900 px-4 py-1 text-xs shadow"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-400 col-span-6">
                    No users found.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
