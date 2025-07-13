import ProductSidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";

const filters = [
  "All",
  "Men",
  "Women",
  "Tees",
  "Polos",
  "Outers",
  "Pants & Joggers",
  "Sweatpants",
];

const products = [
  {
    id: 1,
    name: "Sweetheart Tank",
    price: "$52",
    color: "Plum, Black, Cream",
    size: "XS - XL",
  },
  {
    id: 2,
    name: "Sweetheart Tank",
    price: "$52",
    color: "Plum, Black, Cream",
    size: "XS - XL",
  },
  {
    id: 3,
    name: "Sweetheart Tank",
    price: "$52",
    color: "Plum, Black, Cream",
    size: "XS - XL",
  },
  {
    id: 4,
    name: "Sweetheart Tank",
    price: "$52",
    color: "Plum, Black, Cream",
    size: "XS - XL",
  },
  {
    id: 5,
    name: "Sweetheart Tank",
    price: "$52",
    color: "Plum, Black, Cream",
    size: "XS - XL",
  },
  {
    id: 6,
    name: "Sweetheart Tank",
    price: "$52",
    color: "Plum, Black, Cream",
    size: "XS - XL",
  },
];

const productImage =
  "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/PLUM_Sweetheart-Tank-3_768x_crop_center%402x.progressive.webp";

export default function ProductPage() {
  return (
    <div className="flex w-full px-4 py-6">
      <ProductSidebar />

      <main className="flex-1">
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((f, i) => (
            <Button key={i} variant={i === 0 ? "default" : "outline"} size="sm">
              {f}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative w-full overflow-hidden rounded-sm">
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black text-white text-center text-xs py-1 opacity-0 group-hover:opacity-100 transition">
                  + Quick Add
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Color: {product.color}</p>
              <p className="text-xs text-gray-500">Size: {product.size}</p>
              <p className="text-sm font-medium mt-1">{product.name}</p>
              <p className="text-sm font-semibold">{product.price}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
