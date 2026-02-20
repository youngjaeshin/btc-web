import { notFound } from "next/navigation";
import { chapterMeta } from "@/data/chapters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PlotErrorBoundary } from "@/components/content/PlotErrorBoundary";

import dynamic from "next/dynamic";

// Single source of truth: component map generated from chapterMeta
const chapterComponents: Record<string, React.ComponentType> = Object.fromEntries(
  chapterMeta.map((ch) => [
    ch.slug,
    dynamic(() => import(`@/components/chapters/${ch.component}`)),
  ])
);

export function generateStaticParams() {
  return chapterMeta.map((ch) => ({ slug: ch.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = chapterMeta.find((ch) => ch.slug === slug);
  return {
    title: chapter
      ? `${chapter.title} | 비트코인`
      : "비트코인",
    description: chapter?.description,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = chapterMeta.find((ch) => ch.slug === slug);
  if (!chapter) notFound();

  const ChapterContent = chapterComponents[slug];
  if (!ChapterContent) notFound();

  const currentIndex = chapterMeta.findIndex((ch) => ch.slug === slug);
  const prevChapter = currentIndex > 0 ? chapterMeta[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < chapterMeta.length - 1
      ? chapterMeta[currentIndex + 1]
      : null;

  const Icon = chapter.icon;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      {/* Chapter Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`h-12 w-12 rounded-xl bg-gradient-to-br ${chapter.color} flex items-center justify-center`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <Badge variant="outline" className="mb-1">
              Chapter {chapter.number}
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold">{chapter.title}</h1>
          </div>
        </div>
        <p className="text-muted-foreground">{chapter.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {chapter.keywords.map((kw) => (
            <Badge key={kw} variant="secondary" className="text-xs">
              {kw}
            </Badge>
          ))}
        </div>
      </div>

      {/* Chapter Content */}
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <PlotErrorBoundary>
          <ChapterContent />
        </PlotErrorBoundary>
      </article>

      {/* Navigation */}
      <nav className="flex items-center justify-between mt-12 pt-6 border-t">
        {prevChapter ? (
          <Link href={`/chapters/${prevChapter.slug}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{prevChapter.title}</span>
              <span className="sm:hidden">이전</span>
            </Button>
          </Link>
        ) : (
          <div />
        )}
        {nextChapter ? (
          <Link href={`/chapters/${nextChapter.slug}`}>
            <Button variant="outline" className="gap-2">
              <span className="hidden sm:inline">{nextChapter.title}</span>
              <span className="sm:hidden">다음</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Link href="/">
            <Button variant="outline" className="gap-2">
              홈으로
            </Button>
          </Link>
        )}
      </nav>
    </div>
  );
}
