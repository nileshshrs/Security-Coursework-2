import React, { useEffect, useMemo, useState } from "react";
import ProductSidebar from "@/components/Sidebar";
import { useParams } from "react-router-dom";
import { useGetClothesById } from "@/hooks/useClothes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart"; // <-- use your cart hook

const MATERIALS = [
  "Machine wash cold with like colors",
  "Gentle cycle",
  "Tumble dry low",
  "Low iron",
];

function getProductImage(url?: string | null) {
  if (
    url &&
    (url.toLowerCase().endsWith(".jpg") ||
      url.toLowerCase().endsWith(".jpeg") ||
      url.toLowerCase().endsWith(".png") ||
      url.toLowerCase().endsWith(".webp") ||
      url.startsWith("data:image"))
  ) {
    return url;
  }
  return "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/PLUM_Sweetheart-Tank-3_768x_crop_center%402x.progressive.webp";
}

function getDisplayPrice(price: any): string {
  if (price && typeof price === "object" && "$numberDecimal" in price)
    return (
      "₨ " +
      Number(price.$numberDecimal).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  if (typeof price === "string" && !isNaN(Number(price)))
    return (
      "₨ " +
      Number(price).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  if (typeof price === "number" && !isNaN(price))
    return "₨ " + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return "—";
}

export default function SingleProduct() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetClothesById(id ?? "");
  const product = data?.clothing;

  const [selectedColor, setSelectedColor] = useState<string>();
  const [selectedSize, setSelectedSize] = useState<string>();

  const colors = useMemo((): string[] => {
    return Array.isArray(product?.color)
      ? product.color
      : typeof product?.color === "string"
      ? product.color.split(",")
      : [];
  }, [product]);

  const sizes = useMemo((): string[] => {
    return Array.isArray(product?.size)
      ? product.size
      : typeof product?.size === "string"
      ? product.size.split(",")
      : [];
  }, [product]);

  const colorOptions = useMemo((): { label: string; value: string }[] => {
    return colors.map((color: string) => ({
      label: color.charAt(0).toUpperCase() + color.slice(1),
      value: color.toLowerCase(),
    }));
  }, [colors]);

  useEffect(() => {
    if (product) {
      if (!selectedColor && colorOptions.length > 0) {
        setSelectedColor(colorOptions[0].value);
      }
      if (!selectedSize && sizes.length > 0) {
        setSelectedSize(sizes[0]);
      }
    }
  }, [product, selectedColor, selectedSize, colorOptions, sizes]);

  // --- useCart global mutation ---
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!product?._id || !selectedColor || !selectedSize) {
      toast.error("Select a color and size first.");
      return;
    }
    addItem.mutate(
      {
        itemID: product._id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
      },
      {
        onSuccess: () => toast.success("Added to cart!"),
        onError: () => toast.error("Failed to add to cart."),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <span className="text-gray-400 text-lg">Loading product...</span>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <span className="text-red-500 text-lg">Product not found.</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col md:flex-row">
      <div className="px-8 py-4">
        <ProductSidebar />
      </div>
      <div className="flex-1 block lg:hidden">
        <div className="flex flex-col gap-8 py-8 px-2 max-w-2xl mx-auto items-center justify-center">
          <div className="w-full flex justify-center items-start mb-5">
            <div className="w-full max-w-[430px] h-[350px] bg-[#f8f6ff] flex items-center justify-center rounded">
              <img
                src={getProductImage(product.imagePath)}
                alt={product.name}
                className="object-contain w-[85%] h-[85%]"
                draggable={false}
              />
            </div>
          </div>
          <div className="flex flex-col w-full max-w-[480px] mx-auto">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
              <h1 className="text-lg font-bold">{product.name}</h1>
              <span className="text-base font-semibold text-gray-700">
                {getDisplayPrice(product.price)}
              </span>
            </div>
            <div className="mb-3 border-b border-gray-200 pb-3">
              <div className="flex justify-between items-center w-full mb-2">
                <span className="text-[14px] font-bold">Available Colors:</span>
                <span className="text-xs text-gray-600">
                  {colorOptions.find((c) => c.value === selectedColor)?.label || ""}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color: { label: string; value: string }) => (
                  <button
                    key={color.value}
                    className={`px-3 py-1 border text-xs rounded transition-all duration-75
                      ${selectedColor === color.value
                        ? "bg-black text-white border-black"
                        : "border-gray-300 bg-white text-black"
                      }`}
                    onClick={() => setSelectedColor(color.value)}
                    type="button"
                  >
                    {color.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3 border-b border-gray-200 pb-3">
              <div className="flex justify-between items-center w-full mb-2">
                <span className="text-[14px] font-bold">Available Sizes:</span>
                <span className="text-xs text-gray-600">{selectedSize}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size: string) => (
                  <button
                    key={size}
                    className={`w-10 h-9 border rounded transition-all duration-75
                      ${selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300"
                      } font-medium text-base`}
                    onClick={() => setSelectedSize(size)}
                    type="button"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <Button
              className="w-full bg-black text-white py-3 rounded font-semibold text-base mt-2 mb-7 hover:bg-gray-800 transition"
              type="button"
              onClick={handleAddToCart}
              disabled={addItem.isPending}
            >
              {addItem.isPending ? "Adding..." : "Add to Cart"}
            </Button>
            <div className="mb-4 border-b border-gray-200 pb-3">
              <div className="font-semibold text-[14px] mb-1">Description</div>
              <p
                className="text-gray-700 text-[14px] leading-relaxed"
                style={{
                  minHeight: "5.8em",
                  lineHeight: 1.45,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {product.description || "No description provided."}
              </p>
            </div>
            <div>
              <div className="font-semibold text-[14px] mb-1">Materials & Care</div>
              <ul className="text-gray-700 text-sm list-disc pl-5 space-y-1">
                {MATERIALS.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex-1 lg:block" style={{ containerType: "inline-size" }}>
        <div className="clothes-single-container grid grid-cols-1 gap-12 py-16 px-10 max-w-6xl mx-auto w-full justify-items-center">
          <div className="flex justify-center items-start">
            <div className="w-full max-w-[430px] h-[650px] bg-[#f8f6ff] flex items-center justify-center rounded">
              <img
                src={getProductImage(product.imagePath)}
                alt={product.name}
                className="object-contain w-[90%] h-[92%]"
                draggable={false}
              />
            </div>
          </div>
          <div className="flex flex-col w-full max-w-[480px]">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
              <h1 className="text-[22px] font-bold">{product.name}</h1>
              <span className="text-[20px] font-semibold text-gray-700">
                {getDisplayPrice(product.price)}
              </span>
            </div>
            <div className="mb-3 border-b border-gray-200 pb-3">
              <div className="flex justify-between items-center w-full mb-2">
                <span className="text-[15px] font-bold">Available Colors:</span>
                <span className="text-xs text-gray-600">
                  {colorOptions.find((c) => c.value === selectedColor)?.label || ""}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color: { label: string; value: string }) => (
                  <button
                    key={color.value}
                    className={`px-3 py-1 border text-xs rounded transition-all duration-75
                      ${selectedColor === color.value
                        ? "bg-black text-white border-black"
                        : "border-gray-300 bg-white text-black"
                      }`}
                    onClick={() => setSelectedColor(color.value)}
                    type="button"
                  >
                    {color.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3 border-b border-gray-200 pb-3">
              <div className="flex justify-between items-center w-full mb-2">
                <span className="text-[15px] font-bold">Available Sizes:</span>
                <span className="text-xs text-gray-600">{selectedSize}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size: string) => (
                  <button
                    key={size}
                    className={`w-10 h-9 border rounded transition-all duration-75
                      ${selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300"
                      } font-medium text-base`}
                    onClick={() => setSelectedSize(size)}
                    type="button"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <Button
              className="w-full bg-black text-white py-3 rounded font-semibold text-base mt-2 mb-7 hover:bg-gray-800 transition"
              type="button"
              onClick={handleAddToCart}
              disabled={addItem.isPending}
            >
              {addItem.isPending ? "Adding..." : "Add to Cart"}
            </Button>
            <div className="mb-4 border-b border-gray-200 pb-3">
              <div className="font-semibold text-[15px] mb-1">Description</div>
              <p
                className="text-gray-700 text-[15px] leading-relaxed"
                style={{
                  minHeight: "5.8em",
                  lineHeight: 1.45,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {product.description || "No description provided."}
              </p>
            </div>
            <div>
              <div className="font-semibold text-[15px] mb-1">Materials & Care</div>
              <ul className="text-gray-700 text-sm list-disc pl-5 space-y-1">
                {MATERIALS.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <style>
          {`
            .clothes-single-container { container-type: inline-size; }
            @container (min-width: 1100px) {
              .clothes-single-container {
                grid-template-columns: 1fr 1fr;
                max-width: 1200px;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}
