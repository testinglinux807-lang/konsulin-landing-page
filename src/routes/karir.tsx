import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
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

        <SalesLapanganJob />

        <section id="form-lamaran" className="scroll-mt-20 border-b border-border">
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

function JobSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-10">
      <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em]">{title}</h3>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function SalesLapanganJob() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <article className="border border-border bg-card p-6 md:p-10">
          <p className="rounded-sm border border-border bg-muted px-4 py-3 text-center font-display text-xs font-bold uppercase tracking-[0.2em]">
            Sebelum apply wajib baca detail berikut
          </p>

          <p className="mt-10 font-display text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Dicari
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
            Sales Lapangan (Mitra) – Aplikasi Asisten Warung
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Freelance / Kemitraan · Full-time atau Part-time · Bandung
          </p>

          <JobSection title="Tentang Konsulin">
            <p>
              Konsulin bikin software buat bantu bisnis kecil jalan lebih rapi. Produk yang lagi kami
              pasarkan: Asisten Warung, aplikasi di HP buat pemilik warung kelontong untuk nyatet
              jualan, stok, dan untung harian tanpa buku tulis.
            </p>
          </JobSection>

          <JobSection title="Yang Bakal Kamu Kerjakan">
            <BulletList
              items={[
                "Mendatangi warung kelontong di area yang sudah ditentukan (daftar warung kami sediakan)",
                "Demo aplikasi langsung di HP ke pemilik warung, sekitar 5–10 menit",
                "Membantu pemilik warung daftar dan mulai masa coba 7 hari",
                "Follow up warung yang sedang mencoba sampai mereka berlangganan",
                "Mengisi laporan kunjungan harian (foto warung + hasil kunjungan) lewat form",
                "Menyampaikan masukan dari lapangan: keluhan, alasan menolak, fitur yang diminta",
              ]}
            />
          </JobSection>

          <JobSection title="Produk yang Kamu Jual">
            <p>
              Masalah yang sering dialami warung: jualan dicatat di buku, sering salah hitung saat
              ramai, stok cuma dihafal, lupa siapa yang masih utang, dan rekap akhir bulan jarang cocok
              dengan uang di laci.
            </p>
            <p>Asisten Warung membantu pemilik warung untuk:</p>
            <BulletList
              items={[
                "Mencatat penjualan dengan cepat, bisa scan barang pakai kamera HP",
                "Memantau stok dan tahu barang mana yang perlu dibelanja duluan",
                "Melihat laporan untung rugi secara otomatis",
                "Mengetahui barang yang laris dan yang tidak laku",
                "Mencatat utang pelanggan",
                'Bertanya ke asisten AI, misalnya "siapa yang belum bayar utang?"',
                "Memantau warung dari mana saja, data tidak hilang seperti buku tulis",
              ]}
            />
            <p className="font-medium text-foreground">
              Harga: Rp78.000/bulan · Rp210.000/3 bulan · Rp684.000/tahun
            </p>
            <p>
              Pembayaran online lewat{" "}
              <a
                href="https://asistenwarung.konsulin.com"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                asistenwarung.konsulin.com
              </a>
              .
              <br />
              Materi produk dan latihan demo kami berikan di awal.
            </p>
          </JobSection>

          <JobSection title="Skema Penghasilan">
            <p>
              Posisi ini 100% komisi, tanpa gaji pokok hanya dengan bonus dan recurring. Ada dua jenis
              komisi:
            </p>
            <p className="italic">Potensi 4–7jt++, detail melalui Zoom meeting</p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Komisi closing, dibayar setiap warung melakukan pembayaran pertama 30%</li>
              <li>
                Komisi berulang
                <br />
                Selama warung yang kamu closing masih memperpanjang langganan, kamu mendapat 15/25% dari
                setiap perpanjangan.
              </li>
            </ol>
            <p>
              Komisi dibayar setiap tanggal 5 setelah pembayaran warung terverifikasi. Closing selama
              masa trial tetap dibayar komisinya.
            </p>
          </JobSection>

          <JobSection title="Alur Rekrutmen">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Lamar dengan mengisi{" "}
                <a href="#form-lamaran" className="underline underline-offset-4 hover:text-foreground">
                  form lamaran di bawah
                </a>
              </li>
              <li>
                Tonton video brief, lalu ngobrol singkat 10 menit via Google Meet{" "}
                <span className="italic">(penting, wajib hadir)</span>
              </li>
              <li>Tes lapangan 24 jam: kunjungi minimal 2 warung, lalu kirim foto dan laporan</li>
              <li>
                Masa trial: full-time 7 hari, part-time maksimal 14 hari atau 30 kunjungan, dengan
                target 3 warung closing
              </li>
              <li>Lolos trial, tanda tangan perjanjian kemitraan</li>
            </ol>
          </JobSection>
        </article>
      </div>
    </section>
  );
}
