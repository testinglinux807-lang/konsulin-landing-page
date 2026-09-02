import { createFileRoute, notFound } from "@tanstack/react-router";
import logoUrl from "@/assets/logo.png";
import { getBlogPost } from "@/lib/blog-posts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/blog/$slug")({
  // Only check existence here - the post object holds a React component (Content),
  // which can't be serialized for client hydration. Look posts up directly by slug
  // instead (blogPosts is a static in-memory array, already bundled on the client).
  loader: ({ params }) => {
    if (!getBlogPost(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) return {};
    return {
      meta: [
        { title: post.metaTitle },
        { name: "description", content: post.description },
        { property: "og:title", content: post.metaTitle },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  // Safe to assert: the loader above throws notFound() for unknown slugs.
  const post = getBlogPost(slug)!;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <img src={logoUrl} alt="Logo Konsulin" className="h-8 w-8" width={40} height={40} />
            <span className="font-display text-lg font-bold tracking-tight">Konsulin</span>
          </a>
          <a href="/blog" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            ← Kembali ke blog
          </a>
        </div>
      </header>

      <main>
        <article className="mx-auto max-w-3xl px-6 py-16">
          <p className="font-display text-xs uppercase tracking-[0.35em] text-muted-foreground">
            {post.dateLabel}
          </p>
          <h1 className="mt-6 font-display text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">{post.description}</p>

          <div className="mt-10">
            <post.Content />
          </div>

          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Pertanyaan yang Sering Ditanyain (FAQ)
            </h2>
            <Accordion type="single" collapsible className="mt-4">
              {post.faq.map((item, i) => (
                <AccordionItem key={item.question} value={`faq-${i}`}>
                  <AccordionTrigger className="font-display text-base font-semibold text-foreground">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <p className="mt-16 border-t border-border pt-8 text-base italic leading-relaxed text-muted-foreground">
            {post.closingText}{" "}
            <a href="/#jadwal" className="not-italic underline underline-offset-4 hover:text-foreground">
              Hubungi kami
            </a>{" "}
            buat mulai obrolan.
          </p>
        </article>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-12 text-center">
        <p className="text-xs text-muted-foreground">© 2026 Konsulin. Let's Grow With Us.</p>
      </footer>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
