import { Button } from "@/components/ui/button";

const blocks = [
  {
    label: "Shop Men's",
    image:
      "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/BottomBlock_ShopMens_1x1_01_20_281_29_768x_crop_center%402x.progressive.webp",
  },
  {
    label: "Shop Women's",
    image:
      "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/BottomBlock_ShopWomens_1x1_01_768x_crop_center%402x.progressive.webp",
  },
];

export default function ShopBlocks() {
  return (
    <section className="w-full px-4 py-8 md:px-8 lg:px-12 xl:px-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blocks.map((block, index) => (
          <div key={index} className="relative w-full h-full overflow-hidden rounded-md">
            <img
              src={block.image}
              alt={block.label}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 right-6 flex flex-col items-end gap-2">
              <p className="text-white font-semibold text-sm sm:text-base">{block.label}</p>
              <div className="flex gap-2">
                <Button variant="secondary" className="bg-white text-black hover:bg-gray-200">
                  New Releases
                </Button>
                <Button variant="secondary" className="bg-white text-black hover:bg-gray-200">
                  Best Sellers
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
