import { Instagram } from "lucide-react";

const images = [
  "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/1_590673ed-c289-4859-864b-a7a0dbeb2025_350x_crop_center%402x.progressive.webp",
  "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/2_564b4029-571e-4db6-9ad8-9be9c8cb0188_350x_crop_center%402x.progressive.webp",
  "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/3_c620fb5b-34c0-4ad9-b520-2d83afd87570_350x_crop_center%402x.progressive.webp",
  "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/4_350x_crop_center%402x.progressive.webp",
  "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/5_350x_crop_center%402x.progressive.webp",
  "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/6_350x_crop_center%402x.progressive.webp",
  "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/7_350x_crop_center%402x.progressive.webp",
  "https://raw.githubusercontent.com/nileshshrs/clothing-store/refs/heads/master/frontend/src/assets/8_7b160054-f133-4a69-9e19-512719ee71e4_350x_crop_center%402x.progressive.webp",
];

export default function EditorialGrid() {
  return (
    <section className="w-full px-4 py-12">
      <div className="grid grid-cols-4">
        {images.map((src, idx) => (
          <div key={idx} className="relative group w-full aspect-square overflow-hidden">
            <img src={src} alt={`grid-${idx}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Instagram className="text-black w-6 h-6" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
