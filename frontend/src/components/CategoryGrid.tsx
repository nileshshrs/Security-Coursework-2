import React from "react";

const categories = [
    {
        label: "Men's Top",
        image:
            "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/HPBlock_ShopAllMens_3x4_01_450x_crop_center%402x.progressive.webp",
    },
    {
        label: "Men's Bottom",
        image:
            "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/NYC-DAY-ONE-MENS--2-139_e1da42ff-684b-4dd6-a323-989d37ea83a1_450x_crop_center%402x.progressive.webp",
    },
    {
        label: "Women's Top",
        image:
            "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/HPBlock_ShopAll_Womens_3x4_02_450x_crop_center%402x.progressive.webp",
    },
    {
        label: "Women's Bottom",
        image:
            "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/NYC-DAY--2--3--101_450x_crop_center%402x.progressive.webp",
    },

];
export default function CategoryGrid() {
    return (
        <section className="w-full py-12 px-4 md:px-8 lg:px-12 xl:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat, idx) => (
                    <div key={idx} className="relative group overflow-hidden rounded-md shadow-sm aspect-[3/4]">
                        <img
                            src={cat.image}
                            alt={cat.label}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4 bg-black text-white text-sm font-semibold px-2 py-1 rounded-sm">
                            {cat.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}