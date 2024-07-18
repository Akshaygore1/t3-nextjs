import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";

const navItems = [
  { name: "Categories", href: "/" },
  { name: "Sale", href: "/docs" },
  { name: "Clearance", href: "/docs" },
  { name: "New stock", href: "/docs" },
  { name: "Trending", href: "/docs" },
];

export const Navbar = () => {
  return (
    <div className="flex h-16 items-center justify-between px-4">
      <div className="flex items-center">
        <h1 className="ml-3 text-3xl font-bold">ECOMMERCE</h1>
      </div>
      <div className="hidden sm:ml-6 sm:flex sm:items-center">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <div className="inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium">
              {item.name}
            </div>
          </Link>
        ))}
      </div>
      <div className="hidden items-center sm:ml-6 sm:flex sm:items-center">
        <div className="mr-8 flex h-8 w-8 items-center">
          <Search width={20} height={20} />
        </div>
        <div className="h8 w-8">
          <ShoppingCart width={20} height={20} />
        </div>
      </div>
    </div>
  );
};
