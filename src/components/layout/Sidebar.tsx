"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { chapterMeta } from "@/data/chapters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  mobile?: boolean;
}

export function Sidebar({ mobile = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background",
        mobile ? "h-full pt-12" : "hidden md:flex w-64 shrink-0"
      )}
    >
      <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          목차
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-0.5 p-2">
          {chapterMeta.map((ch) => {
            const isActive = pathname === `/chapters/${ch.slug}`;
            return (
              <Link
                key={ch.slug}
                href={`/chapters/${ch.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Badge
                  variant={isActive ? "secondary" : "outline"}
                  className="h-6 w-6 shrink-0 items-center justify-center rounded-full p-0 text-xs"
                >
                  {ch.number}
                </Badge>
                <div className="flex flex-col min-w-0">
                  <span className="truncate font-medium">{ch.title}</span>
                  <span
                    className={cn(
                      "truncate text-xs",
                      isActive
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground/70"
                    )}
                  >
                    {ch.subtitle}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}
