import { createFileRoute } from "@tanstack/react-router";
import logoUrl from "@/assets/logo.png";

const GOOGLE_FORM_ID = "1FAIpQLSdWZRTMVNQCOVTuEDvKWYiQqzBdj7uX07jsvI5CMVmvhs08gQ";
const FORM_VIEW_URL = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform`;
const FORM_EMBED_URL = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform?embedded=true`;

export const Route = createFileRoute("/karir")({
  head: () => ({
    meta: [
      { title: "Karir — Konsulin" },
      {
        name: "description",
        content: "Konsulin sedang membuka lowongan. Lihat posisi yang tersedia dan kirim lamaran Anda.",
      },
    ],
  }),
  component: Karir,
});

function Karir() {
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
              Kami sedang bertumbuh
            </p>
            <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              Karir di Konsulin
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
              Konsulin sedang open hiring. Kalau kamu tertarik membangun ERP Cafe dan Asisten Toko
              yang dipakai bisnis sungguhan setiap hari, isi form di bawah ini.
            </p>
            <a
              href={FORM_VIEW_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded-sm bg-primary px-7 py-3.5 font-display text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
            >
              Buka Form Lamaran di Tab Baru
            </a>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <div className="overflow-hidden border border-border bg-card">
              <iframe
                src={FORM_EMBED_URL}
                title="Form Lamaran Karir Konsulin"
                className="h-[80vh] min-h-[500px] w-full sm:h-[900px]"
                loading="lazy"
              >
                Memuat form...
              </iframe>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Form tidak muncul?{" "}
              <a href={FORM_VIEW_URL} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-foreground">
                Buka langsung di Google Forms
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-12 text-center">
        <p className="text-xs text-muted-foreground">© 2026 Konsulin. Let's Grow With Us.</p>
      </footer>
    </div>
  );
}
