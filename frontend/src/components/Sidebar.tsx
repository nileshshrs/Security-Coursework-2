// components/ProductSidebar.tsx

const sidebarFilters = {
  TOPS: ["Tees", "Polos", "Long Sleeves", "Sweatshirts & Layers", "Outerwear", "All Tops"],
  BOTTOMS: ["Shorts", "Pants & Joggers", "Sweatpants", "All Bottoms"],
};

export default function ProductSidebar() {
  return (
    <aside className="w-64 hidden md:block pr-8">
      <h3 className="font-semibold mb-4">Shop All</h3>
      <div className="space-y-4 text-sm">
        {Object.entries(sidebarFilters).map(([category, items]) => (
          <div key={category}>
            <h4 className="uppercase font-medium text-xs mb-2">{category}</h4>
            <ul className="space-y-1 text-gray-600">
              {items.map((item) => (
                <li key={item} className="hover:underline cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="mt-4 space-y-1">
          <p className="underline cursor-pointer">All Men</p>
          <p className="underline cursor-pointer">All Women</p>
        </div>
      </div>
    </aside>
  );
}
