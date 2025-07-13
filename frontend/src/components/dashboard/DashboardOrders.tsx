import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const orders = [
  {
    id: 1,
    image:
      "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/PLUM_Sweetheart-Tank-3_768x_crop_center%402x.progressive.webp",
    name: "ao jogger",
    user: "nileshshrs",
    email: "nileshshr979@gmail.com",
    payment: "khalti",
    address: "",
    contact: "",
    quantity: 1,
    total: "$ 118",
    status: "Completed",
  },
  // Add more orders as needed
];

export default function DashboardOrders() {
  return (
    <div className="w-full max-w-full mx-auto py-8 px-2 sm:px-4" style={{ containerType: "inline-size" }}>
      <h2 className="text-2xl font-bold mb-3">Order Detail</h2>
      <div className="w-full">
        <ScrollArea className="w-full overflow-x-auto rounded-2xl border bg-white shadow-lg">
          <div className="min-w-[2500px]">
            {/* Table Heading Row */}
            <div className="grid grid-cols-[60px_80px_1.5fr_1.5fr_2fr_1.2fr_1.2fr_1.2fr_1fr_1.2fr_1.3fr_1.3fr_1.3fr] text-[15px] font-bold bg-black text-white border-b border-gray-200 px-5 py-3 rounded-t-2xl">
              <div className="text-center">ID</div>
              <div className="flex justify-center">Image</div>
              <div className="text-left">Name</div>
              <div className="text-left">User</div>
              <div className="text-left">Email</div>
              <div className="text-left">Payment</div>
              <div className="text-left">Address</div>
              <div className="text-left">Contact</div>
              <div className="text-left">Quantity</div>
              <div className="text-left">Total Price</div>
              <div className="text-left">Status</div>
              <div className="flex justify-center">Cancel Order</div>
              <div className="flex justify-center">Order Status</div>
            </div>
            {/* Table Body */}
            <ScrollArea className="h-[650px] w-full px-0">
              <div>
                {orders.length > 0 ? (
                  orders.map((order, idx) => (
                    <div
                      key={order.id}
                      className={[
                        "grid grid-cols-[60px_80px_1.5fr_1.5fr_2fr_1.2fr_1.2fr_1.2fr_1fr_1.2fr_1.3fr_1.3fr_1.3fr] items-center px-5 py-3 text-[15px]",
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50",
                        "border-b border-gray-100 last:border-b-0 transition hover:bg-gray-100"
                      ].join(" ")}
                    >
                      <div className="text-gray-500 text-center">{order.id}</div>
                      <div className="flex items-center justify-center">
                        <img
                          src={order.image}
                          alt={order.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </div>
                      <div className="font-medium text-gray-800 text-left">{order.name}</div>
                      <div className="text-gray-700 text-left">{order.user}</div>
                      <div className="text-gray-700 text-left">{order.email}</div>
                      <div className="text-gray-600 text-left">{order.payment}</div>
                      <div className="text-gray-600 text-left">{order.address || <span className="text-gray-400">-</span>}</div>
                      <div className="text-gray-600 text-left">{order.contact || <span className="text-gray-400">-</span>}</div>
                      <div className="text-gray-600 text-left">{order.quantity}</div>
                      <div className="text-gray-800 text-left">{order.total}</div>
                      {/* Status badge */}
                      <div className="flex items-center">
                        <span className="inline-flex items-center h-8 px-3 rounded bg-gray-200 text-black font-semibold text-xs">
                          {order.status}
                        </span>
                      </div>
                      {/* Cancel Order */}
                      <div className="flex items-center justify-center">
                        <Button
                          size="sm"
                          className="bg-black text-white hover:bg-neutral-900 h-8 px-4 rounded text-xs shadow"
                        >
                          Delete
                        </Button>
                      </div>
                      {/* Order Status badge */}
                      <div className="flex items-center justify-center">
                        <span className="inline-flex items-center h-8 px-3 rounded bg-black text-white font-semibold text-xs">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-400 col-span-13">
                    No orders found.
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
