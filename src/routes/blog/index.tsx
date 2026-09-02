import { createFileRoute } from "@tanstack/react-router";
import logoUrl from "@/assets/logo.png";
import { blogPosts } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog - Konsulin" },
      {
        name: "description",
        content:
          "Studi kasus, cerita produk, dan insight seputar sistem manajemen kafe dan toko dari tim Konsulin.",
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <img src={logoUrl} alt="Logo Konsulin" className="h-8 w-8" width={40} height={40} />
            <span className="font-display text-lg font-bold tracking-tight">Konsulin</span>
          </a>
          <a href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            ← Kembali ke beranda
          </a>
        </div>
      </header>

      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 pb-12 pt-20 text-center">
            <p className="font-display text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Blog Konsulin
            </p>
            <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              Studi Kasus &amp; Cerita Produk
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
              Cerita di balik sistem-sistem yang kami bangun untuk bisnis F&amp;B dan retail -
              dari kasir harian sampai laporan keuangan resmi.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-4xl px-6 py-16">
            <div className="grid gap-6 sm:grid-cols-2">
              {blogPosts.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden border border-border bg-card transition-colors hover:border-primary"
                >
                  <div className="flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-border bg-muted">
                    <img
                      src={post.image}
                      alt={post.imageAlt}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                      {post.dateLabel}
                    </p>
                    <h2 className="mt-3 font-display text-xl font-bold leading-tight tracking-tight">
                      {post.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <span className="mt-6 text-sm font-medium text-foreground">
                      Baca artikel →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-12 text-center">
        <p className="text-xs text-muted-foreground">© 2026 Konsulin. Let's Grow With Us.</p>
      </footer>
    </div>
  );
}
