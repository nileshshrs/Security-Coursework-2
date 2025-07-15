import React, { useState } from "react";
import ProductSidebar from "@/components/Sidebar";
import { useParams } from "react-router-dom";
import { useGetClothesById } from "@/hooks/useClothes";
import { Button } from "@/components/ui/button";

// Always static
const MATERIALS = [
  "Machine wash cold with like colors",
  "Gentle Cycle",
  "Tumble dry low",
  "Low iron",
];

// Helper for fallback, coloring, joining arrays, etc.
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
  ;
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
function joinVals(val: string[] | string) {
  if (Array.isArray(val)) return val.join(", ");
  return typeof val === "string" ? val : "";
}

export default function SingleProduct() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetClothesById(id ?? "");
  const product = data?.clothing;

  // UI state
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  // Fallbacks
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

  // Parse color/size arrays and default selects
  const colors: string[] = Array.isArray(product.color) ? product.color : typeof product.color === "string" ? product.color.split(",") : [];
  const sizes: string[] = Array.isArray(product.size) ? product.size : typeof product.size === "string" ? product.size.split(",") : [];
  const stapleColors = colors.map((color) => ({
    label: color.charAt(0).toUpperCase() + color.slice(1),
    value: color.toLowerCase(),
  }));

  // Set defaults on first render only
  React.useEffect(() => {
    if (!selectedColor && stapleColors.length > 0) setSelectedColor(stapleColors[0].value);
    if (!selectedSize && sizes.length > 0) setSelectedSize(sizes[0]);
    // eslint-disable-next-line
  }, [product]);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-[220px] flex-shrink-0 px-4 md:px-10 py-4 md:py-8 ">
        <ProductSidebar />
      </div>

      {/* Main Product Section */}
      <div className="flex flex-1 flex-col md:flex-row gap-8 md:gap-16 py-8 md:py-16 px-4 md:px-10">
        {/* Image */}
        <div className="w-full md:w-[44%] flex justify-center items-start mb-8 md:mb-0">
          <div className="w-full max-w-[430px] h-[420px] md:h-[650px] bg-[#f8f6ff] flex items-center justify-center rounded">
            <img
              src={getProductImage(product.imagePath)}
              alt={product.name}
              className="object-contain w-[85%] h-[85%] md:w-[90%] md:h-[92%]"
              draggable={false}
            />
          </div>
        </div>
        {/* Details */}
        <div className="flex flex-col w-full max-w-[480px] mx-auto md:mx-0">
          {/* Title and Price */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
            <h1 className="text-lg md:text-[22px] font-bold">{product.name}</h1>
            <span className="text-base md:text-[20px] font-semibold text-gray-700">{getDisplayPrice(product.price)}</span>
          </div>
          {/* Staple Colors */}
          <div className="mb-3 border-b border-gray-200 pb-3">
            <div className="flex justify-between items-center w-full mb-2">
              <span className="text-[14px] md:text-[15px] font-bold">Staple Colors:</span>
              <span className="text-xs text-gray-600">
                {stapleColors.length ? stapleColors.find((c) => c.value === selectedColor)?.label : ""}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {stapleColors.map((color) => (
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
          {/* Sizes */}
          <div className="mb-3 border-b border-gray-200 pb-3">
            <div className="flex justify-between items-center w-full mb-2">
              <span className="text-[14px] md:text-[15px] font-bold">AVAILABLE SIZES:</span>
              <span className="text-xs text-gray-600">{selectedSize}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size) => (
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
          {/* Add to Cart Button */}
          <Button
            className="w-full bg-black text-white py-3 rounded font-semibold text-base mt-2 mb-7 hover:bg-gray-800 transition"
            type="button"
          >
            Add to Cart
          </Button>
          {/* Description */}
          <div className="mb-4 border-b border-gray-200 pb-3">
            <div className="font-semibold text-[14px] md:text-[15px] mb-1">Description</div>
            <p
              className="text-gray-700 text-[14px] md:text-[15px] leading-relaxed"
              style={{
                minHeight: "5.8em", // ~4 lines @ 1.45em line-height
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
          {/* Materials & Care */}
          <div>
            <div className="font-semibold text-[14px] md:text-[15px] mb-1">MATERIALS & CARE</div>
            <ul className="text-gray-700 text-sm list-disc pl-5 space-y-1">
              {MATERIALS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
