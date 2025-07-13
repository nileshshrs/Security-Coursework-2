import { Button } from "@/components/ui/button";

const products = [
  { id: 1, name: "Sweetheart Tank", price: "$52", color: "Plum, Black, Cream", size: "XS - XL" },
  { id: 2, name: "Sweetheart Tank", price: "$52", color: "Plum, Black, Cream", size: "XS - XL" },
  { id: 3, name: "Sweetheart Tank", price: "$52", color: "Plum, Black, Cream", size: "XS - XL" },
  { id: 4, name: "Sweetheart Tank", price: "$52", color: "Plum, Black, Cream", size: "XS - XL" },
  { id: 5, name: "Sweetheart Tank", price: "$52", color: "Plum, Black, Cream", size: "XS - XL" },
  { id: 6, name: "Sweetheart Tank", price: "$52", color: "Plum, Black, Cream", size: "XS - XL" },
];

const productImage =
  "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/PLUM_Sweetheart-Tank-3_768x_crop_center%402x.progressive.webp";

export default function DashboardClothes() {
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-2 sm:px-4">

      {/* --- Small screens: container query grid --- */}
      <div className="block md:hidden" style={{ containerType: "inline-size" }}>
        <div className="grid grid-cols-1 gap-6 clothes-container">
          {products.map((product) => (
            <div
              key={product.id}
              className="group border rounded-lg shadow-sm bg-white p-2 flex flex-col"
            >
              <div className="relative w-full overflow-hidden rounded-md">
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="flex flex-col gap-1 mt-2 flex-1">
                <p className="text-xs text-gray-500">Color: {product.color}</p>
                <p className="text-xs text-gray-500">Size: {product.size}</p>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-sm font-semibold">{product.price}</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-black text-white hover:bg-neutral-800 border-none"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-black text-white hover:bg-neutral-800 border-none"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Container queries for 1/2/4 columns on very small screens */}
        <style>
          {`
            .clothes-container { container-type: inline-size; }
            @container (min-width: 350px) {
              .clothes-container {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            @container (min-width: 700px) {
              .clothes-container {
                grid-template-columns: repeat(4, 1fr);
              }
            }
          `}
        </style>
      </div>

      {/* --- Medium and up: Tailwind media query grid --- */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group border rounded-lg shadow-sm bg-white p-2 flex flex-col"
          >
            <div className="relative w-full overflow-hidden rounded-md">
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="flex flex-col gap-1 mt-2 flex-1">
              <p className="text-xs text-gray-500">Color: {product.color}</p>
              <p className="text-xs text-gray-500">Size: {product.size}</p>
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-sm font-semibold">{product.price}</p>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  className="flex-1 bg-black text-white hover:bg-neutral-800 border-none"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-black text-white hover:bg-neutral-800 border-none"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
