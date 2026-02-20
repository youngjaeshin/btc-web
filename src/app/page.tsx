import Link from "next/link";
import { chapterMeta } from "@/data/chapters";
import { ArrowRight, BookOpen, Cpu, BarChart3 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: BookOpen,
    title: "비트코이너 관점",
    description: "건전화폐 철학부터 기술 원리까지 10개 심화 챕터",
  },
  {
    icon: Cpu,
    title: "인터랙티브 시뮬레이션",
    description: "해시, 채굴, 공급 스케줄을 직접 체험하며 학습",
  },
  {
    icon: BarChart3,
    title: "자가 평가 퀴즈",
    description: "각 챕터별 퀴즈로 학습 내용을 확인",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-transparent to-amber-50 dark:from-orange-950/20 dark:via-transparent dark:to-amber-950/20" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 md:py-24 text-center">
          <Badge variant="secondary" className="mb-4">
            비트코이너 관점 | From a Bitcoiner&apos;s Perspective
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            비트코인
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              {" "}인터랙티브
            </span>{" "}
            학습
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            건전화폐 철학, 프로토콜 원리, 경제학적 의미를 깊이 있게.
            <br />
            화폐의 본질부터 작업증명, 자기주권, 라이트닝 네트워크까지 — 비트코이너의 시각으로
          </p>
          <Link
            href="/chapters/what-is-money"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-medium text-white shadow hover:bg-orange-600 transition-colors"
          >
            학습 시작하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center text-center p-6 rounded-xl border bg-card"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chapter Grid */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6">전체 챕터</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapterMeta.map((ch) => {
            const Icon = ch.icon;
            return (
              <Link key={ch.slug} href={`/chapters/${ch.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-0.5 group cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg bg-gradient-to-br ${ch.color} flex items-center justify-center shrink-0`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs mb-1">
                          Chapter {ch.number}
                        </Badge>
                        <CardTitle className="text-base group-hover:text-primary transition-colors">
                          {ch.title}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-sm line-clamp-2">
                      {ch.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="-mt-2">
                    <div className="flex flex-wrap gap-1">
                      {ch.keywords.slice(0, 3).map((kw) => (
                        <Badge
                          key={kw}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 비트코인 인터랙티브 학습</p>
      </footer>
    </div>
  );
}
