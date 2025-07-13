import React, { useState } from "react";
import ProductSidebar from "@/components/Sidebar";

const PRODUCT = {
  name: "Crossover Short 7\"",
  price: 48,
  image: "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/PLUM_Sweetheart-Tank-3_768x_crop_center%402x.progressive.webp",
  stapleColors: [
    { label: "Black", value: "black" },
    { label: "Infinity Blue", value: "infinity-blue" },
    { label: "Slate", value: "slate" },
  ],
  sizes: ["S", "M", "L", "XL", "XXL"],
  description:
    "The perfect summer shorts for any adventure. Made from ripstop fabric, these shorts can handle both land and water activities, making them versatile and practical for any warm weather occasion. With their 7\" inseam, these shorts offer the perfect balance of coverage and mobility.",
  materials: [
    "Machine wash cold with like colors",
    "Gentle Cycle",
    "Tumble dry low",
    "Low iron",
  ],
};

export default function SingleProduct() {
  const [selectedColor, setSelectedColor] = useState(PRODUCT.stapleColors[0].value);
  const [selectedSize, setSelectedSize] = useState(PRODUCT.sizes[0]);

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
              src={PRODUCT.image}
              alt={PRODUCT.name}
              className="object-contain w-[85%] h-[85%] md:w-[90%] md:h-[92%]"
              draggable={false}
            />
          </div>
        </div>
        {/* Details */}
        <div className="flex flex-col w-full max-w-[480px] mx-auto md:mx-0">
          {/* Title and Price */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
            <h1 className="text-lg md:text-[22px] font-bold">{PRODUCT.name}</h1>
            <span className="text-base md:text-[20px] font-semibold text-gray-700">${PRODUCT.price}</span>
          </div>
          {/* Staple Colors */}
          <div className="mb-3 border-b border-gray-200 pb-3">
            <div className="flex justify-between items-center w-full mb-2">
              <span className="text-[14px] md:text-[15px] font-bold">Staple Colors:</span>
              <span className="text-xs text-gray-600">{PRODUCT.stapleColors[0].label}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {PRODUCT.stapleColors.map((color) => (
                <button
                  key={color.value}
                  className={`px-3 py-1 border text-xs rounded transition-all duration-75
                    ${selectedColor === color.value
                      ? "bg-black text-white border-black"
                      : "border-gray-300 bg-white text-black"
                  }`}
                  onClick={() => setSelectedColor(color.value)}
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
              {PRODUCT.sizes.map((size) => (
                <button
                  key={size}
                  className={`w-10 h-9 border rounded transition-all duration-75
                    ${selectedSize === size
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300"
                  } font-medium text-base`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {/* Add to Cart Button */}
          <button
            className="w-full bg-black text-white py-3 rounded font-semibold text-base mt-2 mb-7 hover:bg-gray-800 transition"
            type="button"
          >
            Add to Cart
          </button>
          {/* Description */}
          <div className="mb-4 border-b border-gray-200 pb-3">
            <div className="font-semibold text-[14px] md:text-[15px] mb-1">Description</div>
            <p className="text-gray-700 text-[14px] md:text-[15px] leading-relaxed">
              {PRODUCT.description}
            </p>
          </div>
          {/* Materials & Care */}
          <div>
            <div className="font-semibold text-[14px] md:text-[15px] mb-1">MATERIALS & CARE</div>
            <ul className="text-gray-700 text-sm list-disc pl-5 space-y-1">
              {PRODUCT.materials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
