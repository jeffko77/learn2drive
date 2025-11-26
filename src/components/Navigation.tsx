"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, BookOpen, Trophy, Settings } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/drivers", icon: Users, label: "Drivers" },
  { href: "/training", icon: BookOpen, label: "Training" },
  { href: "/quiz", icon: Trophy, label: "Quiz" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`tap-target flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? "text-sky-blue bg-sky-blue/10"
                  : "text-chrome/60 hover:text-chrome"
              }`}
              style={{
                color: isActive ? "var(--color-sky-blue)" : undefined,
              }}
            >
              <Icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2}
                className="transition-all"
              />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

