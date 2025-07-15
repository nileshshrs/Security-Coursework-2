import { addToCart, getCart, removeCartItem, updateCartItem } from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Cart } from "@/utils/types"; // Import your Cart type

const CART_KEY = ["cart"] as const;

// ---- Mutation types ----
type AddToCartParams = {
  itemID: string;
  quantity?: number;
  size: string;
  color: string;
};

type UpdateCartItemParams = {
  itemID: string;
  quantity: number;
  size: string;
  color: string;
};

type RemoveCartItemParams = {
  itemID: string;
  size: string;
  color: string;
};

export const useCart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: cartData,
    isLoading: cartLoading,
    isError: cartError,
  } = useQuery<{ cart: Cart }>(
    {
      queryKey: CART_KEY,
      queryFn: getCart,
      staleTime: 5 * 60 * 1000,
      enabled: !!user,
    }
  );

  const addItem = useMutation({
    mutationFn: (params: AddToCartParams) => addToCart(params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });

  const updateItem = useMutation({
    mutationFn: (params: UpdateCartItemParams) => updateCartItem(params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });

  const removeItem = useMutation({
    mutationFn: (params: RemoveCartItemParams) => removeCartItem(params),
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
