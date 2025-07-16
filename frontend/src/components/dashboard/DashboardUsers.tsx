import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useUser } from "@/hooks/useUser";
import React from "react";

type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
  verified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
};

export default function DashboardUsers() {
  const { allUsersQuery } = useUser();
  const { data: usersRaw, isLoading, isError, error } = allUsersQuery;

  const users: User[] = Array.isArray(usersRaw?.users) ? usersRaw.users : [];

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading users...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading users: {(error as any)?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-full mx-auto py-8 px-2 sm:px-4"
      style={{ containerType: "inline-size" }}
    >
      <h2 className="text-2xl font-bold mb-3">User Detail</h2>
      <div className="w-full">
        <ScrollArea className="w-full overflow-x-auto rounded-2xl border bg-white shadow-lg">
          <div className="min-w-[1300px]">
            {/* Table Heading Row */}
            <div className="grid grid-cols-[60px_2fr_2fr_1fr_1fr_1fr_1fr] text-[15px] font-bold bg-black text-white border-b border-gray-200 px-5 py-3 rounded-t-2xl">
              <div className="text-center">#</div>
              <div className="text-left">Username</div>
              <div className="text-left">Email</div>
              <div className="text-left">Role</div>
              <div className="text-left">Verified</div>
              <div className="text-left">MFA Enabled</div>
              <div className="text-left">Created At</div>
            </div>

            {/* Table Body */}
            <ScrollArea className="h-[650px] w-full px-0">
              <div>
                {users.length > 0 ? (
                  users.map((user: User, idx: number) => (
                    <div
                      key={user._id}
                      className={[
                        "grid grid-cols-[60px_2fr_2fr_1fr_1fr_1fr_1fr] items-center px-5 py-3 text-[15px]",
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50",
                        "border-b border-gray-100 last:border-b-0 transition hover:bg-gray-100",
                      ].join(" ")}
                    >
                      <div className="text-gray-500 text-center">{idx + 1}</div>
                      <div className="font-medium text-gray-800 text-left truncate">
                        {user.username}
                      </div>
                      <div className="text-gray-700 text-left truncate">
                        {user.email}
                      </div>
                      <div className="text-gray-600 text-left">{user.role}</div>
                      <div className="text-gray-600 text-left">
                        {user.verified ? "Yes" : "No"}
                      </div>
                      <div className="text-gray-600 text-left">
                        {user.mfaEnabled ? "Yes" : "No"}
                      </div>
                      <div className="text-gray-600 text-left">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-400 col-span-7">
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
