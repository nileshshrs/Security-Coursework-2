import { addToCart, getCart, removeCartItem, updateCartItem } from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


const CART_KEY = ["cart"] as const;

export const useCart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth()

  const {
    data: cartData,
    isLoading: cartLoading,
    isError: cartError,
  } = useQuery({
    queryKey: CART_KEY,
    queryFn: getCart,
    staleTime: 5 * 60 * 1000,
    enabled: !!user
  });

  const addItem = useMutation({
    mutationFn: addToCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });

  const updateItem = useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });

  const removeItem = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });

  return {
    cart: cartData?.cart || null,
    isLoading: cartLoading,
    isError: cartError,
    addItem,
    updateItem,
    removeItem,
  };
};
