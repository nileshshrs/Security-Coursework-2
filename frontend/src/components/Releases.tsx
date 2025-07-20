import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useGetAllClothes } from "@/hooks/useClothes";
import type { Clothes } from "@/utils/types";
import { useMemo } from "react";
import { Link } from "react-router-dom";

// Helpers
function getDisplayPrice(price: Clothes["price"]): string {
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
function getRandomSubset<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export default function Releases() {
  const { data, isLoading, isError } = useGetAllClothes();

  const clothes: Clothes[] = Array.isArray(data?.clothes)
    ? (data.clothes as Clothes[])
    : [];

  const menArrivals = useMemo(() =>
    getRandomSubset(
      clothes.filter(
        (item) => item.category === "Male" && item.newArrival === true
      ),
      4
    ), [clothes]
  );
  const womenArrivals = useMemo(() =>
    getRandomSubset(
      clothes.filter(
        (item) => item.category === "Female" && item.newArrival === true
      ),
      4
    ), [clothes]
  );

  return (
    <section className="w-full py-12 px-4 md:px-8 lg:px-12 xl:px-16">
      <Tabs defaultValue="men" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-bold tracking-tight">Shop New Releases</h2>
            <TabsList>
              <TabsTrigger value="men">Men</TabsTrigger>
              <TabsTrigger value="women">Women</TabsTrigger>
            </TabsList>
          </div>
          <Button variant="default" className="text-sm px-5 py-2 font-mono font-semibold" asChild>
            <Link to="/clothes/all">Shop All</Link>
          </Button>
        </div>

        <TabsContent value="men">
          {isLoading ? (
            <div className="w-full flex justify-center py-12">
              <span className="text-gray-400 text-lg">Loading...</span>
            </div>
          ) : isError ? (
            <div className="w-full flex justify-center py-12">
              <span className="text-red-500 text-lg">Failed to load products.</span>
            </div>
          ) : menArrivals.length === 0 ? (
            <div className="w-full flex justify-center py-12">
              <span className="text-gray-400 text-lg">No men's new arrivals.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {menArrivals.map((item) => (
                <Link
                  to={`/clothes/${item._id}`}
                  key={item._id}
                  className="group block"
                  tabIndex={0}
                  aria-label={`Go to ${item.name} page`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="group border rounded-lg shadow-sm bg-white p-2 flex flex-col transition hover:shadow-md">
                    <div className="relative w-full overflow-hidden rounded-md">
                      <img
                        src={getProductImage(item.imagePath)}
                        alt={item.name}
                        className="w-full h-auto object-cover"
                      />
                      <Button
                        className="absolute bottom-0 w-full rounded-none bg-black text-white text-sm py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black"
                      >
                        Add to Bag
                      </Button>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">{joinVals(item.color)}</p>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-sm font-semibold">{getDisplayPrice(item.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="women">
          {isLoading ? (
            <div className="w-full flex justify-center py-12">
              <span className="text-gray-400 text-lg">Loading...</span>
            </div>
          ) : isError ? (
            <div className="w-full flex justify-center py-12">
              <span className="text-red-500 text-lg">Failed to load products.</span>
            </div>
          ) : womenArrivals.length === 0 ? (
            <div className="w-full flex justify-center py-12">
              <span className="text-gray-400 text-lg">No women's new arrivals.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {womenArrivals.map((item) => (
                <Link
                  to={`/clothes/${item._id}`}
                  key={item._id}
                  className="group block"
                  tabIndex={0}
                  aria-label={`Go to ${item.name} page`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="group border rounded-lg shadow-sm bg-white p-2 flex flex-col transition hover:shadow-md">
                    <div className="relative w-full overflow-hidden rounded-md">
                      <img
                        src={getProductImage(item.imagePath)}
                        alt={item.name}
                        className="w-full h-auto object-cover"
                      />
                      <Button
                        className="absolute bottom-0 w-full rounded-none bg-black text-white text-sm py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black"
                      >
                        Add to Bag
                      </Button>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">{joinVals(item.color)}</p>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-sm font-semibold">{getDisplayPrice(item.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}


