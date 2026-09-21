import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Instagram, Linkedin, MapPin, MessageCircle, Menu, Star, X } from "lucide-react";
import logoUrl from "@/assets/logo.png";
import rinaPhoto from "@/assets/rinawijaya.jpg";
import budiPhoto from "@/assets/budiwijaya.jpg";
import salimPhoto from "@/assets/salimkusuma.jpg";
import warungShot from "@/assets/asisten-warung-beranda.jpg";
import { Showcase } from "@/components/showcase";
import { submitConsultation } from "@/lib/consultation.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Konsulin" },
      {
        name: "description",
        content:
          "Dari kasir harian sampai laporan keuangan - ERP Cafe dan Asisten Warung dari Konsulin bikin operasional bisnis Anda lebih rapi dan siap berkembang.",
      },
      { property: "og:title", content: "Konsulin" },
      {
        property: "og:description",
        content: "Dari kasir harian sampai laporan keuangan - ERP Cafe dan Asisten Warung dari Konsulin bikin operasional bisnis Anda lebih rapi dan siap berkembang.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

// Fitur Asisten Warung yang beneran ada di aplikasinya (asistenwarung.konsulin.com), bukan daftar fitur SaaS umum.
const fiturWarung = [
  { t: "Catat jualan dari kamera HP", d: "Scan barcode barang, total langsung keluar. Bayar tunai atau QRIS." },
  { t: "Untung hari ini, bukan cuma omzet", d: "Modal tiap barang ikut dihitung, jadi yang kelihatan untung bersihnya." },
  { t: "Stok yang mau habis ketahuan duluan", d: "Daftar belanja disusun dari seberapa cepat barangnya laku." },
  { t: "Kasbon pelanggan nggak lupa", d: "Siapa yang belum bayar, berapa, dan sejak kapan." },
  { t: "Tanya Mang AI", d: 'Cukup ketik "siapa yang belum bayar utang?" atau "barang apa yang paling laris?".' },
];

const steps = [
  { n: "01", t: "Konsultasi kebutuhan", d: "Ceritakan alur bisnis Anda - kami rekomendasikan ERP Cafe atau Asisten Warung yang paling pas." },
  { n: "02", t: "Setup & kustomisasi", d: "Kami pasang dan sesuaikan fitur, harga, hingga tampilan sesuai kebutuhan Anda." },
  { n: "03", t: "Pelatihan & go-live", d: "Tim Anda dilatih, sistem langsung aktif, dan tim support kami siap membantu." },
];

// Harga Asisten Warung disamain sama yang ditagih lewat Midtrans (warung-pintar-backend/src/services/midtrans.service.js).
const hargaWarung = [
  { durasi: "1 bulan", harga: "Rp78.000", ket: "" },
  { durasi: "3 bulan", harga: "Rp210.000", ket: "Rp70.000/bulan" },
  { durasi: "1 tahun", harga: "Rp684.000", ket: "Rp57.000/bulan" },
  { durasi: "Permanen", harga: "Rp3.650.000", ket: "sekali bayar" },
];

const plans = [
  {
    name: "ERP Cafe",
    price: "Rp200rb",
    note: "mulai dari /bulan",
    items: ["Pemesanan meja & dapur", "Manajemen stok bahan baku", "Laporan keuangan lengkap", "Multi outlet"],
    dark: true,
  },
  {
    name: "Custom",
    price: "Sesuai kebutuhan",
    note: "fitur & harga dihitung bareng tim kami",
    items: ["Fitur sesuai kebutuhan", "Harga custom", "Paket permanen (bayar sekali) - akses hingga 4 pengguna"],
    dark: false,
  },
];

const testimonials = [
  {
    name: "Rina Wijaya",
    role: "Pemilik, Kopi Kenangan Senja",
    quote:
      "Sejak pakai ERP Cafe dari Konsulin, laporan penjualan harian nggak perlu direkap manual lagi. Semua kelihatan real-time, tim jadi lebih tenang kerjanya.",
    photo: rinaPhoto,
  },
  {
    name: "Budi Santoso",
    role: "Pemilik, Toko Sembako Makmur",
    quote:
      "Asisten Toko bikin stok barang gampang dipantau. Barang mau habis langsung ketahuan sebelum benar-benar kehabisan di rak.",
    photo: budiPhoto,
  },
  {
    name: "Salim Kusuma",
    role: "Manajer Operasional, Roti & Kopi Pagi",
    quote:
      "Tim support-nya responsif banget. Fitur di-custom sesuai kebutuhan tiap outlet kami tanpa ribet, harganya pun jelas dari awal.",
    photo: salimPhoto,
  },
];

function Mark({ className = "" }: { className?: string }) {
  return <img src={logoUrl} alt="Logo Konsulin" className={className} width={40} height={40} />;
}

function Landing() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [catatan, setCatatan] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!selectedPlan) return;
    const target = `Saya tertarik dengan paket ${selectedPlan}.`;
    setCatatan("");
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      setCatatan(target.slice(0, i));
      if (i >= target.length) window.clearInterval(id);
    }, 30);
    return () => window.clearInterval(id);
  }, [selectedPlan]);

  return (

    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2">
            <Mark className="h-8 w-8" />
            <span className="font-display text-lg font-bold tracking-tight">Konsulin</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#fitur" className="transition-colors hover:text-foreground">Fitur</a>
            <a href="#cara" className="transition-colors hover:text-foreground">Cara kerja</a>
            <a href="#harga" className="transition-colors hover:text-foreground">Harga</a>
            <a href="#jadwal" className="transition-colors hover:text-foreground">Jadwalkan meeting</a>
            <a href="/blog" className="transition-colors hover:text-foreground">Blog</a>
            <a href="/karir" className="transition-colors hover:text-foreground">Karir</a>
          </nav>
          <a
            href="#jadwal"
            className="hidden rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85 md:inline-block"
          >
            Jadwalkan meeting
          </a>
          <button
            type="button"
            aria-label={navOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => setNavOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-foreground md:hidden"
          >
            {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {navOpen && (
          <nav className="flex flex-col gap-1 border-t border-border px-6 py-4 text-sm text-muted-foreground md:hidden">
            <a href="#fitur" onClick={() => setNavOpen(false)} className="rounded-sm px-2 py-2.5 transition-colors hover:bg-accent hover:text-foreground">Fitur</a>
            <a href="#cara" onClick={() => setNavOpen(false)} className="rounded-sm px-2 py-2.5 transition-colors hover:bg-accent hover:text-foreground">Cara kerja</a>
            <a href="#harga" onClick={() => setNavOpen(false)} className="rounded-sm px-2 py-2.5 transition-colors hover:bg-accent hover:text-foreground">Harga</a>
            <a href="/blog" onClick={() => setNavOpen(false)} className="rounded-sm px-2 py-2.5 transition-colors hover:bg-accent hover:text-foreground">Blog</a>
            <a href="/karir" onClick={() => setNavOpen(false)} className="rounded-sm px-2 py-2.5 transition-colors hover:bg-accent hover:text-foreground">Karir</a>
            <a
              href="#jadwal"
              onClick={() => setNavOpen(false)}
              className="mt-2 rounded-sm bg-primary px-4 py-2.5 text-center font-medium text-primary-foreground transition-opacity hover:opacity-85"
            >
              Jadwalkan meeting
            </a>
          </nav>
        )}
      </header>

      <main id="top">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 text-center">
            <p className="font-display text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Let's Grow With Us
            </p>
            <h1 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Sistem yang Tumbuh Bersama Bisnis Anda
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
              Dari kasir harian sampai laporan keuangan - ERP Cafe dan Asisten Warung dari Konsulin
              bikin operasional bisnis Anda lebih rapi dan siap berkembang.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#jadwal"
                className="rounded-sm bg-primary px-7 py-3.5 font-display text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
              >
                Jadwalkan meeting
              </a>
              <a
                href="#harga"
                className="rounded-sm border border-primary px-7 py-3.5 font-display text-sm font-medium transition-colors hover:bg-accent"
              >
                Lihat Harga
              </a>
            </div>
            <Showcase />
          </div>
        </section>


        <section id="fitur" className="scroll-mt-16 border-b border-border">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16">
            <div>
              <h2 className="font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                Asisten Warung: buku warung pindah ke HP
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                Buat warung kelontong yang selama ini nyatet di buku tulis. Buka aplikasinya, dan
                untung hari ini langsung kelihatan di layar pertama.
              </p>
              <dl className="mt-10 divide-y divide-border border-y border-border">
                {fiturWarung.map((f) => (
                  <div key={f.t} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-6">
                    <dt className="font-display text-sm font-bold tracking-tight">{f.t}</dt>
                    <dd className="text-sm leading-relaxed text-muted-foreground">{f.d}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="https://asistenwarung.konsulin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-sm bg-primary px-7 py-3.5 font-display text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
                >
                  Coba gratis 7 hari
                </a>
                <a
                  href="#harga"
                  className="rounded-sm border border-primary px-7 py-3.5 font-display text-sm font-medium transition-colors hover:bg-accent"
                >
                  Lihat harga Asisten Warung
                </a>
              </div>
            </div>
            <figure className="mx-auto w-full max-w-[300px] md:max-w-[340px]">
              <div className="overflow-hidden rounded-[2.2rem] border-[10px] border-primary bg-primary shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]">
                <img
                  src={warungShot}
                  alt="Layar beranda Asisten Warung: untung hari ini, jumlah penjualan, total kasbon, dan stok yang mau habis"
                  width={780}
                  height={1688}
                  loading="lazy"
                  className="block h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 text-center text-xs text-muted-foreground">
                Beranda Asisten Warung, diambil dari akun demo
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="cara" className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="max-w-lg font-display text-4xl font-bold tracking-tight">
              Tiga langkah adopsi sistem kami
            </h2>
            <div className="mt-14 grid gap-12 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n}>
                  <span className="font-display text-sm tracking-[0.3em] opacity-50">{s.n}</span>
                  <h3 className="mt-4 font-display text-xl font-medium">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-70">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="harga" className="scroll-mt-16 border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="font-display text-4xl font-bold tracking-tight">Harga</h2>

            <div className="mt-12 grid gap-px border border-border bg-border md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
              <div className="bg-card p-8 md:p-10">
                <h3 className="font-display text-2xl font-bold tracking-tight">Asisten Warung</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Semua fitur di atas, di semua paket. Bedanya cuma lama langganan. Mulai dengan coba
                  gratis 7 hari, bayar online lewat aplikasinya.
                </p>
                <a
                  href="https://asistenwarung.konsulin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-block rounded-sm bg-primary px-6 py-3 font-display text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
                >
                  Coba gratis 7 hari
                </a>
              </div>
              <ul className="divide-y divide-border bg-card">
                {hargaWarung.map((h) => (
                  <li key={h.durasi} className="flex items-baseline justify-between gap-4 px-8 py-5 md:px-10">
                    <span className="font-display text-sm font-medium">{h.durasi}</span>
                    <span className="text-right">
                      <span className="font-display text-2xl font-bold tracking-tight">{h.harga}</span>
                      {h.ket && <span className="block text-xs text-muted-foreground">{h.ket}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {plans.map((p) => (
                <div
                  key={p.name}
                  className={
                    p.dark
                      ? "border border-primary bg-primary p-8 text-primary-foreground"
                      : "border border-border bg-card p-8 text-card-foreground"
                  }
                >
                  <h3 className="font-display text-2xl font-bold tracking-tight">{p.name}</h3>
                  <p className="mt-5 font-display text-4xl font-bold tracking-tight">{p.price}</p>
                  <p className="mt-1 text-xs opacity-70">{p.note}</p>
                  <ul className="mt-7 space-y-2.5 text-sm">
                    {p.items.map((i) => (
                      <li key={i} className="flex gap-2">
                        <span className="opacity-50">-</span>
                        <span className="opacity-90">{i}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#jadwal"
                    onClick={() => setSelectedPlan(p.name)}
                    className={
                      p.dark
                        ? "mt-8 block rounded-sm bg-primary-foreground px-4 py-3 text-center font-display text-sm font-medium text-primary transition-opacity hover:opacity-85"
                        : "mt-8 block rounded-sm border border-primary px-4 py-3 text-center font-display text-sm font-medium transition-colors hover:bg-accent"
                    }
                  >
                    {p.name === "Custom" ? "Diskusikan kebutuhan Anda" : `Jadwalkan demo ${p.name}`}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimoni" className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="text-center font-display text-4xl font-bold tracking-tight">
              Kata mereka yang sudah pakai
            </h2>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.name} className="border border-primary-foreground/15 p-8">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-relaxed opacity-85">"{t.quote}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    {t.photo ? (
                      <img
                        src={t.photo}
                        alt={t.name}
                        className="h-10 w-10 shrink-0 rounded-full border border-primary-foreground/25 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-foreground/25 font-display text-sm font-bold">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-display text-sm font-bold tracking-tight">{t.name}</p>
                      <p className="text-xs opacity-60">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="jadwal">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.35em] text-muted-foreground">
                Konsultasi Gratis
              </p>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-tight">
                Talk to Us
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                Beritahu apa yang Anda butuhkan - kami akan membuat apa yang Anda butuhkan.
              </p>
            </div>
            <form
              className="space-y-4 border border-border bg-card p-8"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                const form = e.currentTarget;
                const fd = new FormData(form);
                setSubmitting(true);
                try {
                  await submitConsultation({
                    data: {
                      nama: String(fd.get("nama") ?? ""),
                      email: String(fd.get("email") ?? ""),
                      hp: String(fd.get("hp") ?? ""),
                      tanggal: String(fd.get("tanggal") ?? ""),
                      jam: String(fd.get("jam") ?? ""),
                      catatan: String(fd.get("catatan") ?? ""),
                    },
                  });
                  setSent(true);
                  form.reset();
                  setCatatan("");
                  setSelectedPlan(null);
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Gagal mengirim permintaan. Coba lagi sebentar lagi.",
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {sent ? (
                <div className="flex flex-col items-center gap-4 py-10 text-center animate-in fade-in-0 zoom-in-95 duration-300">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground animate-in zoom-in-50 duration-500">
                    <Check className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold tracking-tight">Jadwal konsultasi terkirim!</p>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                      Cek email Anda untuk konfirmasi. Tinggal tunggu ya - tim Konsulin akan segera menghubungi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-2 font-display text-xs font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Ajukan jadwal lain
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">Nama</span>
                      <input
                        required
                        name="nama"
                        className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                      />
                    </label>
                    <label className="block">
                      <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">Email</span>
                      <input
                        required
                        type="email"
                        name="email"
                        className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">No HP</span>
                    <input
                      required
                      type="tel"
                      name="hp"
                      placeholder="08xxxxxxxxxx"
                      className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">Tanggal preferensi</span>
                      <input
                        required
                        type="date"
                        name="tanggal"
                        className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                      />
                    </label>
                    <label className="block">
                      <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">Jam preferensi</span>
                      <input
                        required
                        type="time"
                        name="jam"
                        min="09:00"
                        max="19:00"
                        className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                      />
                      <span className="mt-1 block text-[11px] text-muted-foreground">Jam operasional 09:00 - 19:00</span>
                    </label>
                  </div>
                  <label className="block">
                    <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">Catatan</span>
                    <textarea
                      name="catatan"
                      rows={3}
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      placeholder="Ceritakan kebutuhan Anda..."
                      className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-sm bg-primary px-6 py-3 font-display text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-50"
                  >
                    {submitting ? "Mengirim..." : "Talk to Us"}
                  </button>
                  {error && (
                    <p className="animate-fade-in text-xs text-destructive">{error}</p>
                  )}
                </>
              )}
            </form>
          </div>
        </section>
      </main>



      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            <a href="#top" className="flex items-center gap-2">
              <Mark className="h-7 w-7" />
              <span className="font-display text-sm font-bold tracking-tight">Konsulin</span>
            </a>

            <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 sm:gap-x-16">
              <div>
                <p className="font-display text-xs uppercase tracking-widest text-muted-foreground">Kontak</p>
                <a
                  href="https://wa.me/6287886078754"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex items-center gap-1.5 text-sm transition-colors hover:text-foreground"
                >
                  <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                  +62 878-8607-8754
                </a>
              </div>
              <div>
                <p className="font-display text-xs uppercase tracking-widest text-muted-foreground">Sosial</p>
                <a
                  href="https://instagram.com/konsulinid"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex items-center gap-1.5 text-sm transition-colors hover:text-foreground"
                >
                  <Instagram className="h-3.5 w-3.5 shrink-0" />
                  Instagram
                </a>
                <a
                  href="https://linkedin.com/company/konsulin"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 flex items-center gap-1.5 text-sm transition-colors hover:text-foreground"
                >
                  <Linkedin className="h-3.5 w-3.5 shrink-0" />
                  LinkedIn
                </a>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="font-display text-xs uppercase tracking-widest text-muted-foreground">Alamat</p>
                <p className="mt-2 flex items-start gap-1.5 text-sm leading-relaxed text-muted-foreground">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    Jl. Dago Asri III Blok J No. 3A
                    <br />
                    Kec. Coblong, Kota Bandung
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-2 border-t border-border pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between">
            <p>© 2026 Konsulin. Let's Grow With Us.</p>
            <a href="/karir" className="transition-colors hover:text-foreground">
              Kami sedang open hiring, lihat karir di Konsulin
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
