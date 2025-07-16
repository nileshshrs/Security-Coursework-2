import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  cancelOrder,
  updateOrderStatus,
} from "@/api/api"; // Use the correct path to your api functions

// Query keys
const USER_ORDERS_KEY = ["orders", "user"];
const ALL_ORDERS_KEY = ["orders", "all"];

export function useOrder() {
  const queryClient = useQueryClient();

  // Place order (from cart)
  const placeOrderMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      // Refetch user orders and (optionally) the cart
      queryClient.invalidateQueries({ queryKey: USER_ORDERS_KEY });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Get all orders for current user
  const userOrdersQuery = useQuery({
    queryKey: USER_ORDERS_KEY,
    queryFn: getUserOrders,
  });

  // Get all orders (admin)
  const allOrdersQuery = useQuery({
    queryKey: ALL_ORDERS_KEY,
    queryFn: getAllOrders,
    // enabled: isAdmin, // You can add condition here if you have isAdmin context
  });

  // Cancel order (user)
  const cancelOrderMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_ORDERS_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_ORDERS_KEY });
    },
  });

  // Update order status (admin)
  const updateOrderStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALL_ORDERS_KEY });
      queryClient.invalidateQueries({ queryKey: USER_ORDERS_KEY });
    },
  });

  return {
    // Queries
    userOrdersQuery,
    allOrdersQuery,

    // Mutations
    placeOrder: placeOrderMutation,
    cancelOrder: cancelOrderMutation,
    updateOrderStatus: updateOrderStatusMutation,
  };
}
