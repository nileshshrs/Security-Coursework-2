import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetAllClothes, useDeleteClothes } from "@/hooks/useClothes";
import { toast } from "sonner";
import type { Clothes } from "@/utils/types";
import ClothesPatchDialog from "./ClothesPatchDialog";

const fallbackProductImage =
  "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/PLUM_Sweetheart-Tank-3_768x_crop_center%402x.progressive.webp";

function getDisplayPrice(price: any): string {
  if (price && typeof price === "object" && "$numberDecimal" in price)
    return "₨ " + Number(price.$numberDecimal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (typeof price === "string" && !isNaN(Number(price)))
    return "₨ " + Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (typeof price === "number" && !isNaN(price))
    return "₨ " + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return "—";
}
function joinVals(val: any) {
  if (Array.isArray(val)) return val.join(", ");
  return typeof val === "string" ? val : "";
}
function getProductImage(url: string | undefined | null) {
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
  return fallbackProductImage;
}

type ProductCard = {
  id: string;
  name: string;
  price: string;
  color: string;
  size: string;
  productImage: string;
};

export default function DashboardClothes() {
  const { data, isLoading, isError } = useGetAllClothes();
  const deleteClothesMutation = useDeleteClothes();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingProduct, setEditingProduct] = useState<ProductCard | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  // Map backend to card type
  const products: ProductCard[] = Array.isArray(data?.clothes)
    ? data.clothes.map((item: Clothes) => ({
      id: item._id ?? "",
      name: item.name,
      price: getDisplayPrice(item.price),
      color: joinVals(item.color),
      size: joinVals(item.size),
      productImage: getProductImage(item.imagePath),
    }))
    : [];

  // Fallback for loading/error/empty
  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <span className="text-gray-400 text-lg">Loading clothes...</span>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="w-full flex justify-center py-20">
        <span className="text-red-500 text-lg">Failed to load clothes.</span>
      </div>
    );
  }
  if (products.length === 0) {
    return (
      <div className="w-full flex justify-center py-20">
        <span className="text-gray-400 text-lg">No clothes found.</span>
      </div>
    );
  }

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
                  src={product.productImage}
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
                    onClick={() => {
                      setEditingProduct(product);
                      setEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-black text-white hover:bg-neutral-800 border-none"
                    onClick={() => {
                      setDeletingId(product.id);
                      deleteClothesMutation.mutate(product.id, {
                        onSuccess: () => {
                          toast.success("Clothing item deleted.");
                          setDeletingId(null);
                        },
                        onError: () => {
                          toast.error("Failed to delete clothing item.");
                          setDeletingId(null);
                        },
                      });
                    }}
                    disabled={deletingId === product.id && deleteClothesMutation.isPending}
                  >
                    {deletingId === product.id && deleteClothesMutation.isPending
                      ? "Deleting..."
                      : "Delete"}
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
                src={product.productImage}
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
                  onClick={() => {
                    setEditingProduct(product);
                    setEditOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-black text-white hover:bg-neutral-800 border-none"
                  onClick={() => {
                    setDeletingId(product.id);
                    deleteClothesMutation.mutate(product.id, {
                      onSuccess: () => {
                        toast.success("Clothing item deleted.");
                        setDeletingId(null);
                      },
                      onError: () => {
                        toast.error("Failed to delete clothing item.");
                        setDeletingId(null);
                      },
                    });
                  }}
                  disabled={deletingId === product.id && deleteClothesMutation.isPending}
                >
                  {deletingId === product.id && deleteClothesMutation.isPending
                    ? "Deleting..."
                    : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editingProduct && (
        <ClothesPatchDialog
          open={editOpen}
          onOpenChange={(open) => setEditOpen(open)}
          initialData={data.clothes.find((c: Clothes) => c._id === editingProduct.id) || null}
          clothesId={editingProduct.id}
        />
      )}
    </div>
  );
}
