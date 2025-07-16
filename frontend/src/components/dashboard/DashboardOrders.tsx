import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useOrder } from "@/hooks/useOrder";

// Define allowed status values
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
const statusOptions: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function DashboardOrders() {
  const { allOrdersQuery, updateOrderStatus } = useOrder();
  const { data: ordersRaw, isLoading } = allOrdersQuery;

  const orders = Array.isArray(ordersRaw)
    ? ordersRaw
    : Array.isArray(ordersRaw?.orders)
    ? ordersRaw.orders
    : [];

  // Annotate types in .flatMap and .map
  const mappedOrders =
    orders.flatMap((order: any) =>
      (order.items || []).map((item: any, idx: number) => ({
        id: order._id,
        image:
          item.item?.imagePath ||
          "https://via.placeholder.com/48x48?text=No+Image",
        name: item.item?.name || "-",
        user: order.user?.username || "-",
        email: order.user?.email || "-",
        address: order.address || "-",
        quantity: item.quantity,
        total:
          "₨ " +
          (typeof order.total === "number"
            ? order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })
            : order.total),
        status: order.status as OrderStatus,
      }))
    );

  return (
    <div className="w-full max-w-full mx-auto py-8 px-2 sm:px-4" style={{ containerType: "inline-size" }}>
      <h2 className="text-2xl font-bold mb-3">Order Detail</h2>
      <div className="w-full">
        <ScrollArea className="w-full overflow-x-auto rounded-2xl border bg-white shadow-lg">
          <div className="min-w-[1500px]">
            {/* Table Heading Row */}
            <div className="grid grid-cols-[60px_80px_1.5fr_1.5fr_2fr_1fr_1.2fr_1.2fr_1.2fr] text-[15px] font-bold bg-black text-white border-b border-gray-200 px-5 py-3 rounded-t-2xl">
              <div className="text-center">ID</div>
              <div className="flex justify-center">Image</div>
              <div className="text-left">Name</div>
              <div className="text-left">User</div>
              <div className="text-left">Email</div>
              <div className="text-left">Address</div>
              <div className="text-left">Quantity</div>
              <div className="text-left">Total Price</div>
              <div className="text-left">Status</div>
            </div>
            {/* Table Body */}
            <ScrollArea className="h-[650px] w-full px-0">
              <div>
                {isLoading ? (
                  <div className="flex items-center justify-center h-32 text-gray-400 col-span-9">
                    Loading...
                  </div>
                ) : mappedOrders.length > 0 ? (
                  mappedOrders.map((order: any, idx: number) => (
                    <div
                      key={order.id + "_" + idx}
                      className={[
                        "grid grid-cols-[60px_80px_1.5fr_1.5fr_2fr_1fr_1.2fr_1.2fr_1.2fr] items-center px-5 py-3 text-[15px]",
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50",
                        "border-b border-gray-100 last:border-b-0 transition hover:bg-gray-100",
                      ].join(" ")}
                    >
                      {/* Use index for ID */}
                      <div className="text-gray-500 text-center">{idx + 1}</div>
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
                      <div className="text-gray-600 text-left">{order.address || <span className="text-gray-400">-</span>}</div>
                      <div className="text-gray-600 text-left">{order.quantity}</div>
                      <div className="text-gray-800 text-left">{order.total}</div>
                      {/* Status dropdown for admin */}
                      <div className="flex items-center">
                        <select
                          className="inline-flex h-8 px-3 rounded bg-gray-200 text-black font-semibold text-xs focus:outline-none"
                          value={order.status}
                          onChange={e => {
                            const newStatus = e.target.value as OrderStatus;
                            if (newStatus !== order.status) {
                              updateOrderStatus.mutate({ orderID: order.id, status: newStatus });
                            }
                          }}
                          disabled={updateOrderStatus.isPending}
                          style={{ minWidth: 120 }}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-400 col-span-9">
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
