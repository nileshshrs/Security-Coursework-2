import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function Releases() {
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
          <Button variant="default" className="text-sm px-5 py-2 font-mono font-semibold">
            Shop All
          </Button>
        </div>

        <TabsContent value="men">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, ].map((id) => (
              <div key={id} className="group">
                <div className="relative w-full overflow-hidden rounded-md">
                  <img
                    src="https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/PLUM_Sweetheart-Tank-3_768x_crop_center%402x.progressive.webp"
                    alt=""
                    className="w-full h-auto object-cover"
                  />
                  <Button
                    className="absolute bottom-0 w-full rounded-none bg-black text-white text-sm py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black"
                  >
                    Add to Bag
                  </Button>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Shorts</p>
                  <p className="text-sm font-medium">Crossover Short 7"</p>
                  <p className="text-sm font-semibold">$48</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="women">
          <div className="grid grid-cols-1sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {[5, 6, 7, 8].map((id) => (
              <div key={id} className="group">
                <div className="relative w-full overflow-hidden rounded-md">
                  <img
                    src="https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/PLUM_Sweetheart-Tank-3_768x_crop_center%402x.progressive.webp"
                    alt=""
                    className="w-full h-auto object-cover"
                  />
                  <Button
                    className="absolute bottom-0 w-full rounded-none bg-black text-white text-sm py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black"
                  >
                    Add to Bag
                  </Button>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Tops</p>
                  <p className="text-sm font-medium">Sweetheart Tank</p>
                  <p className="text-sm font-semibold">$52</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
