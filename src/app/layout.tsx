import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "비트코인 | Bitcoin from a Bitcoiner's Perspective",
  description:
    "비트코이너 관점의 비트코인 인터랙티브 학습. 건전화폐, 작업증명, 희소성, 자기주권, 라이트닝 네트워크, 오스트리안 경제학까지 심화 개념과 시뮬레이션.",
  keywords: [
    "비트코인",
    "Bitcoin",
    "건전화폐",
    "작업증명",
    "사토시 나카모토",
    "라이트닝 네트워크",
    "자기주권",
    "오스트리안 경제학",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-medium"
          >
            본문으로 건너뛰기
          </a>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main id="main-content" className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
