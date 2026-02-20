"use client";

import Link from "next/link";
import { Bitcoin, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center px-4 md:px-6">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden" aria-label="목차 메뉴 열기">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">챕터 목차</SheetTitle>
            <Sidebar mobile />
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Bitcoin className="h-6 w-6 text-orange-500" />
          <span className="hidden sm:inline">비트코인</span>
          <span className="sm:hidden">Bitcoin</span>
        </Link>

        <div className="flex-1" />

        {/* Right side */}
        <nav className="flex items-center gap-1">
          <Link href="/">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              홈
            </Button>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
