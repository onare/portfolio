"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const navLinks = [
  { menu: "projects", desc: "Projects", status: true },
  { menu: "skills", desc: "Skills", status: true },
  { menu: "contact", desc: "Contact", status: true },
];

export const Navigation: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);
  const pathName = usePathname();

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={ref}>
      <div
        className={`fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200 border-b  ${
          isIntersecting
            ? "bg-zinc-900/0 border-transparent"
            : "bg-zinc-900/500  border-zinc-800 "
        }`}
      >
        <div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
          <div className="flex justify-between gap-8">
            {navLinks.map((nl) => {
              const path = `/${nl.menu}`;

              const extraStyle = `${
                pathName === path
                  ? "text-zinc-300 text-lg font-bold"
                  : "text-zinc-400 hover:text-zinc-100"
              }`;

              return (
                <div key={nl.menu}>
                  <Link href={path} className={`duration-200  ${extraStyle}`}>
                    {nl.desc}
                  </Link>
                </div>
              );
            })}
          </div>

          <Link
            href="/"
            className="duration-200 text-zinc-300 hover:text-zinc-100"
          >
            <ArrowLeft className="w-6 h-6 " />
          </Link>
        </div>
      </div>
    </header>
  );
};
