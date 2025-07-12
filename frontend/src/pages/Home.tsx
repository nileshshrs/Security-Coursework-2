import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Releases from "@/components/Releases";
import CategoryGrid from "@/components/CategoryGrid";
import BestSelling from "@/components/BestSelling";
import ShopBlocks from "@/components/ShopBlocks";
import EditorialGrid from "@/components/EditorialGrid";
import Quotes from "@/components/Quotes";

export default function Home() {
  return (
    <>
      <section className="relative w-full h-[70vh] overflow-hidden">
        {/* XL and above Background Image */}
        <img
          src="https://cdn.shopify.com/s/files/1/1368/3463/files/HPHero_3x1_January_2024_20copy_1024x_crop_center@2x.progressive.jpg?v=1704244561"
          alt="Hero XL"
          className="hidden xl:block absolute inset-0 w-full h-full object-cover"
        />

        {/* LG Background Image */}
        <img
          src="https://cdn.shopify.com/s/files/1/1368/3463/files/MOBILE-HP-HERO-1.2.24_768x_crop_center@2x.progressive.jpg?v=1704250478"
          alt="Hero LG"
          className="hidden md:block xl:hidden absolute inset-0 w-full h-full object-cover"
        />

        {/* Mobile Background Image */}
        <img
          src="https://cdn.shopify.com/s/files/1/1368/3463/files/MOBILE-HP-HERO-1.2.24_768x_crop_center@2x.progressive.jpg?v=1704250478"
          alt="Hero Mobile"
          className="block md:hidden absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay for text visibility */}
        <div className="absolute inset-0 bg-black/30 z-0" />

        {/* Content positioned with responsive alignment */}
        <div className="absolute top-1/2 left-1/2 lg:left-auto lg:right-[5%] -translate-y-1/2 -translate-x-1/2 lg:translate-x-0 z-10 px-4 sm:px-8 md:px-12">
          <div className="text-white text-center max-w-xl space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Refresh Your Wardrobe
            </h1>
            <p className="text-sm md:text-lg font-medium text-gray-200">
              Refined Style. Versatile Comfort
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/womens">
                <Button className="bg-white text-black hover:bg-gray-200 font-semibold text-sm rounded-md px-4 py-2 font-mono">
                  Shop Women’s
                </Button>
              </Link>
              <Link to="/mens">
                <Button className="bg-white text-black hover:bg-gray-200 font-semibold text-sm rounded-md px-4 py-2 font-mono">
                  Shop Men’s
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Releases />
      <CategoryGrid />
      <BestSelling />
      <section className="w-full py-20 px-4 text-center bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-wider font-medium mb-4 underline underline-offset-4">
            Our Story
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug sm:leading-snug">
            We’re Inspired by the Cities that Never Sleep<br />
            and the Dreams that Keep Us Awake.
          </h2>
        </div>
      </section>
      <ShopBlocks />
      <EditorialGrid />
      <section className="flex flex-col items-center justify-center gap-5 px-5 py-[5rem] bg-slate-100">
        <div className="w-50% mx-auto flex justify-center items-center flex-col gap-[3rem]">
          <div>
            <Quotes />
          </div>
          <div className="flex items-center justify-center w-full gap-2">
            <img src={"https://raw.githubusercontent.com/nileshshrs/clothing-store/fdab48f6936e1cc7fab381288f4b12e5d0bc6017/frontend/src/assets/logo-uncrate.svg"} alt="" />
            <img src={"https://raw.githubusercontent.com/nileshshrs/clothing-store/fdab48f6936e1cc7fab381288f4b12e5d0bc6017/frontend/src/assets/logo-wired.svg"} alt="" />
          </div>
        </div>
      </section>
    </>
  );
}