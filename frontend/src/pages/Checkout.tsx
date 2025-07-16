import React, { useRef, useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import KhaltiCheckout from "khalti-checkout-web";
import { useNavigate } from "react-router-dom";
import { useOrder } from "@/hooks/useOrder"; // <-- Import your hook

const publicTestKey = "test_public_key_402c2b0e98364222bb1c1ab02369cefd";

export default function CheckoutPage() {
  const { cart, refetch } = useCart();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "khalti">("cod");
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const khaltiCheckoutRef = useRef<any>(null);
  const navigate = useNavigate();


  // Use the order hook
  const { placeOrder } = useOrder();

  const subtotal =
    cart?.items?.reduce((sum, { item, quantity }) => {
      let priceNum = 0;
      if (typeof item?.price === "object" && "$numberDecimal" in item.price) {
        priceNum = Number(item.price.$numberDecimal);
      } else if (typeof item?.price === "string" && !isNaN(Number(item.price))) {
        priceNum = Number(item.price);
      } else if (typeof item?.price === "number") {
        priceNum = item.price;
      }
      return sum + priceNum * (quantity ?? 1);
    }, 0) ?? 0;

  useEffect(() => {
    if (paymentMethod === "khalti") {
      const config = {
        publicKey: publicTestKey,
        productIdentity: "123766",
        productName: "cuts clothing",
        productUrl: window.location.origin,
        eventHandler: {
          onSuccess: async (payload: any) => {
            setError(null);
            setCheckingOut(true);
            placeOrder.mutate(
              {
                address,
                paymentMethod: "khalti",
                khaltiToken: payload.token,
                khaltiAmount: payload.amount,
              },
              {
                onSuccess: () => {
                  setCheckingOut(false);
                  refetch && refetch();
                  navigate("/success");
                },
                onError: (err: any) => {
                  setCheckingOut(false);
                  setError(err?.message || "Order failed");
                },
              }
            );
          },
          onError: () => {
            setError("Khalti payment failed.");
          },
          onClose: () => {},
        },
        paymentPreference: [
          "KHALTI",
          "EBANKING",
          "MOBILE_BANKING",
          "CONNECT_IPS",
          "SCT",
        ],
      };
      khaltiCheckoutRef.current = new KhaltiCheckout(config);
    }
  }, [paymentMethod, address, refetch, navigate, placeOrder]);

  const launchKhalti = (amount: number) => {
    if (!khaltiCheckoutRef.current) {
      setError("KhaltiCheckout not initialized.");
      return;
    }
    khaltiCheckoutRef.current.show({ amount: amount * 100 });
  };

  const handlePlaceOrder = async () => {
    setError(null);
    if (!address.trim()) {
      setError("Address required.");
      return;
    }
    if (!cart?.items?.length) {
      setError("Cart is empty.");
      return;
    }
    if (paymentMethod === "cod") {
      setCheckingOut(true);
      placeOrder.mutate(
        {
          address,
          paymentMethod: "cod",
        },
        {
          onSuccess: () => {
            setCheckingOut(false);
            refetch && refetch();
            navigate("/success");
          },
          onError: (err: any) => {
            setCheckingOut(false);
            setError(err?.message || "Order failed");
          },
        }
      );
    } else if (paymentMethod === "khalti") {
      launchKhalti(subtotal);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-3">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="mb-6 border rounded p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <ScrollArea className="h-60 w-full">
          <div className="flex flex-col gap-2 pr-2">
            {cart?.items?.length
              ? cart.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <img
                    src={item.item?.imagePath || "https://via.placeholder.com/48x48?text=No+Image"}
                    alt={item.item?.name}
                    className="w-12 h-12 object-cover rounded bg-gray-100 border"
                    onError={e => { (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/48x48?text=No+Image"; }}
                  />
                  <div className="flex-1 min-w-0 pl-2">
                    <div className="font-medium truncate">{item.item?.name}</div>
                    <div className="text-xs text-gray-600">
                      Size: {item.size}, Color: {item.color}
                    </div>
                    <div className="text-xs text-gray-400">
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="font-semibold text-sm pl-2">
                    {typeof item.item?.price === "object" && item.item.price.$numberDecimal
                      ? "₨ " + Number(item.item.price.$numberDecimal)
                      : "₨ " + Number(item.item?.price ?? 0)}
                  </div>
                </div>
              ))
              : <div className="text-gray-400 text-center">Cart empty</div>
            }
          </div>
        </ScrollArea>
        <div className="font-bold mt-4 flex justify-between">
          <span>Subtotal:</span>
          <span>
            ₨ {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-1 font-medium">Delivery Address</label>
        <textarea
          className="w-full p-2 border rounded bg-white"
          value={address}
          onChange={e => setAddress(e.target.value)}
          rows={2}
        />
      </div>
      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium">Payment Method</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            <span>Cash on Delivery</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "khalti"}
              onChange={() => setPaymentMethod("khalti")}
            />
            <span>Khalti</span>
          </label>
        </div>
      </div>
      {error && (
        <div className="mb-4 text-red-500 text-sm">{error}</div>
      )}
      <Button
        className="w-full font-semibold"
        disabled={checkingOut || !cart?.items?.length}
        onClick={handlePlaceOrder}
      >
        {checkingOut
          ? "Processing..."
          : paymentMethod === "cod"
            ? "Place Order (COD)"
            : "Pay with Khalti"}
      </Button>
    </div>
  );
}
