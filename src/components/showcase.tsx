import { useEffect, useState } from "react";
import logoUrl from "@/assets/logo.png";

/* ---------- shared bits ---------- */

function Panel({ title, note, children, className = "" }: { title: string; note?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col border border-border p-3 sm:p-4 ${className}`}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-display text-[11px] font-bold tracking-tight sm:text-xs">{title}</p>
        {note ? <p className="text-[9px] text-muted-foreground sm:text-[10px]">{note}</p> : null}
      </div>
      <div className="mt-3 flex flex-1 flex-col">{children}</div>
    </div>
  );
}

function Stat({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="bg-card px-2.5 py-2">
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-display text-[13px] font-bold tracking-tight sm:text-sm">{value}</p>
      <p className="text-[9px] text-muted-foreground">{delta}</p>
    </div>
  );
}

function Sparkline({ data, className = "" }: { data: number[]; className?: string }) {
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - v}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`h-full w-full ${className}`}>
      {[25, 50, 75].map((y) => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeWidth="0.3" className="text-border" />
      ))}
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.4" vectorEffect="non-scaling-stroke" className="text-foreground" />
    </svg>
  );
}

function Bars({ data }: { data: number[] }) {
  return (
    <div className="flex h-full items-end gap-[3px]">
      {data.map((h, i) => (
        <div key={i} style={{ height: `${h}%` }} className={`flex-1 ${i === data.length - 1 ? "bg-primary" : "bg-muted"}`} />
      ))}
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-[9px] text-muted-foreground sm:text-[10px]">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-1 h-1.5 bg-muted">
        <div className="h-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <ul className="space-y-2">
      {rows.map(([a, b]) => (
        <li key={a} className="flex items-center justify-between gap-2 border-b border-border pb-1.5 text-[9px] last:border-0 sm:text-[10px]">
          <span className="truncate text-muted-foreground">{a}</span>
          <span className="whitespace-nowrap font-display font-bold">{b}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- app chrome ---------- */

const modules = ["Dashboard", "Penjualan", "Keuangan", "Inventori", "Konsultasi", "Otomasi", "Tim", "Pengaturan"];

function AppShell({ activeModule, breadcrumb, tabs, children }: { activeModule: string; breadcrumb: string; tabs: string[]; children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full bg-card text-foreground">
      {/* sidebar */}
      <aside className="hidden w-40 shrink-0 flex-col border-r border-border py-3 sm:flex">
        <div className="flex items-center gap-2 px-4 pb-3">
          <img src={logoUrl} alt="" className="h-4 w-4" />
          <span className="font-display text-[11px] font-bold tracking-tight">Konsulin</span>
        </div>
        <nav className="flex-1 space-y-px px-2">
          {modules.map((m) => (
            <div
              key={m}
              className={`rounded-sm px-2 py-1.5 text-[10px] ${
                m === activeModule ? "bg-primary font-medium text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {m}
            </div>
          ))}
        </nav>
        <div className="mx-2 border-t border-border px-2 pt-2 text-[9px] text-muted-foreground">
          Workspace · Konsulin HQ
        </div>
      </aside>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <img src={logoUrl} alt="" className="h-4 w-4 sm:hidden" />
            <p className="truncate font-display text-[11px] font-bold tracking-tight">{activeModule}</p>
            <span className="hidden truncate text-[10px] text-muted-foreground md:inline">{breadcrumb}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {tabs.map((t, i) => (
              <span
                key={t}
                className={`whitespace-nowrap rounded-sm px-2 py-1 text-[9px] sm:text-[10px] ${
                  i === tabs.length - 1 ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4">{children}</div>
      </div>
    </div>
  );
}

/* ---------- screens ---------- */

function ScreenDashboard() {
  return (
    <AppShell activeModule="Dashboard" breadcrumb="Ringkasan · Sep 2026" tabs={["Hari ini", "7 hari", "30 hari"]}>
      <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[1.35fr_1fr]">
        <div className="flex min-h-0 flex-col gap-3">
          <div className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
            <Stat label="Net sales" value="Rp 84,2jt" delta="+12,4%" />
            <Stat label="Gross profit" value="Rp 39,7jt" delta="+8,1%" />
            <Stat label="Avg. order" value="Rp 128rb" delta="+3,6%" />
            <Stat label="Transaksi" value="658" delta="+21,0%" />
          </div>
          <Panel title="Tren penjualan" note="vs bulan lalu" className="flex-1">
            <div className="min-h-0 flex-1">
              <Sparkline data={[22, 34, 28, 46, 40, 58, 52, 70, 64, 78, 72, 90]} />
            </div>
            <div className="mt-2 h-10 sm:h-12">
              <Bars data={[38, 52, 44, 66, 58, 79, 71, 88, 62, 94, 81, 100]} />
            </div>
          </Panel>
        </div>
        <div className="flex min-h-0 flex-col gap-3">
          <Panel title="Metode pembayaran">
            <div className="space-y-2">
              <Meter label="QRIS" value={46} />
              <Meter label="Kartu debit" value={28} />
              <Meter label="Tunai" value={18} />
              <Meter label="Transfer" value={8} />
            </div>
          </Panel>
          <Panel title="Aktivitas terbaru" className="flex-1">
            <Rows
              rows={[
                ["#1284 · Meja 6", "Rp 214rb"],
                ["#1283 · Takeaway", "Rp 86rb"],
                ["#1282 · Meja 2", "Rp 132rb"],
                ["#1281 · Online", "Rp 349rb"],
              ]}
            />
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function ScreenPenjualan() {
  const rows: [string, string, string, string][] = [
    ["Kopi susu gula aren", "412", "Rp 18,5jt", "+14%"],
    ["Croissant butter", "268", "Rp 12,1jt", "+9%"],
    ["Matcha latte", "233", "Rp 11,4jt", "+6%"],
    ["Rice bowl ayam", "197", "Rp 9,8jt", "-2%"],
    ["Cold brew 1L", "126", "Rp 7,2jt", "+22%"],
  ];
  return (
    <AppShell activeModule="Penjualan" breadcrumb="Laporan produk · Semua outlet" tabs={["Ekspor", "Filter", "Bulan ini"]}>
      <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[1.5fr_1fr]">
        <Panel title="Produk terlaris" note="5 dari 148 SKU">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 border-b border-border pb-1.5 text-[9px] uppercase tracking-wider text-muted-foreground">
            <span>Produk</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Omzet</span>
            <span className="text-right">Δ</span>
          </div>
          <div className="mt-1.5 space-y-1.5">
            {rows.map(([n, q, o, d]) => (
              <div key={n} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 border-b border-border pb-1.5 text-[9px] last:border-0 sm:text-[10px]">
                <span className="truncate">{n}</span>
                <span className="text-right text-muted-foreground">{q}</span>
                <span className="text-right font-display font-bold">{o}</span>
                <span className="text-right text-muted-foreground">{d}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-3">
            <div className="h-12 sm:h-14">
              <Bars data={[44, 61, 53, 72, 66, 84, 77, 92, 70, 88, 95, 100]} />
            </div>
          </div>
        </Panel>
        <div className="flex min-h-0 flex-col gap-3">
          <div className="grid grid-cols-2 gap-px bg-border">
            <Stat label="Omzet" value="Rp 84,2jt" delta="+12,4%" />
            <Stat label="Refund" value="Rp 1,1jt" delta="-0,4%" />
          </div>
          <Panel title="Per outlet">
            <div className="space-y-2">
              <Meter label="Kemang" value={38} />
              <Meter label="Senopati" value={27} />
              <Meter label="BSD" value={21} />
              <Meter label="Bandung" value={14} />
            </div>
          </Panel>
          <Panel title="Jam sibuk" className="flex-1">
            <div className="min-h-0 flex-1">
              <Bars data={[12, 18, 30, 55, 72, 64, 40, 35, 58, 88, 76, 44]} />
            </div>
            <p className="mt-2 text-[9px] text-muted-foreground">Puncak 12.00 & 19.00</p>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function ScreenKeuangan() {
  const pl: [string, string, string, string][] = [
    ["Pendapatan", "84.200.000", "76.400.000", "+10,2%"],
    ["Harga pokok penjualan", "(44.500.000)", "(41.900.000)", "+6,2%"],
    ["Laba kotor", "39.700.000", "34.500.000", "+15,1%"],
    ["Beban operasional", "(21.300.000)", "(20.100.000)", "+6,0%"],
    ["Beban gaji", "(9.800.000)", "(9.800.000)", "0,0%"],
    ["Laba bersih", "8.600.000", "4.600.000", "+87,0%"],
  ];
  return (
    <AppShell activeModule="Keuangan" breadcrumb="Laba rugi · Sep 2026" tabs={["Unduh PDF", "Bandingkan", "Bulanan"]}>
      <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[1.6fr_1fr]">
        <Panel title="Laporan laba rugi" note="dalam Rupiah">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 border-b border-border pb-1.5 text-[9px] uppercase tracking-wider text-muted-foreground">
            <span>Akun</span>
            <span className="text-right">Sep</span>
            <span className="text-right">Agu</span>
            <span className="text-right">Δ</span>
          </div>
          <div className="mt-1.5 space-y-1.5">
            {pl.map(([a, b, c, d], i) => (
              <div
                key={a}
                className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 border-b border-border pb-1.5 text-[9px] last:border-0 sm:text-[10px] ${
                  i === 2 || i === pl.length - 1 ? "font-display font-bold" : ""
                }`}
              >
                <span className="truncate">{a}</span>
                <span className="text-right">{b}</span>
                <span className="text-right text-muted-foreground">{c}</span>
                <span className="text-right text-muted-foreground">{d}</span>
              </div>
            ))}
          </div>
        </Panel>
        <div className="flex min-h-0 flex-col gap-3">
          <div className="grid grid-cols-2 gap-px bg-border">
            <Stat label="Margin bersih" value="10,2%" delta="+3,8 pp" />
            <Stat label="Arus kas" value="Rp 12,4jt" delta="+18,9%" />
          </div>
          <Panel title="Tren laba bersih" className="flex-1">
            <div className="min-h-0 flex-1">
              <Sparkline data={[18, 26, 22, 31, 28, 40, 36, 52, 48, 61, 70, 84]} />
            </div>
          </Panel>
          <Panel title="Beban terbesar">
            <div className="space-y-2">
              <Meter label="Bahan baku" value={52} />
              <Meter label="Gaji" value={23} />
              <Meter label="Sewa" value={15} />
              <Meter label="Lainnya" value={10} />
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function ScreenInventori() {
  const stock: [string, string, string][] = [
    ["Biji kopi arabika", "18 kg", "Aman"],
    ["Susu UHT full cream", "9 dus", "Perlu order"],
    ["Gula aren cair", "4 L", "Kritis"],
    ["Cup 16oz", "1.240 pcs", "Aman"],
    ["Matcha powder", "2,1 kg", "Perlu order"],
  ];
  return (
    <AppShell activeModule="Inventori" breadcrumb="Stok & supplier · 3 gudang" tabs={["Buat PO", "Stok opname", "Live"]}>
      <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Stok bahan" note="peringatan otomatis">
          <div className="space-y-1.5">
            {stock.map(([n, q, s]) => (
              <div key={n} className="flex items-center justify-between gap-2 border-b border-border pb-1.5 text-[9px] last:border-0 sm:text-[10px]">
                <span className="truncate">{n}</span>
                <span className="whitespace-nowrap text-muted-foreground">{q}</span>
                <span
                  className={`whitespace-nowrap rounded-sm px-1.5 py-0.5 text-[9px] ${
                    s === "Kritis" ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
                  }`}
                >
                  {s}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-3">
            <p className="text-[9px] text-muted-foreground">Perputaran stok 6,4x · waste 1,8%</p>
          </div>
        </Panel>
        <div className="flex min-h-0 flex-col gap-3">
          <div className="grid grid-cols-2 gap-px bg-border">
            <Stat label="SKU aktif" value="148" delta="+6 baru" />
            <Stat label="Nilai stok" value="Rp 61,3jt" delta="-2,1%" />
          </div>
          <Panel title="Purchase order berjalan" className="flex-1">
            <Rows
              rows={[
                ["PO-0421 · Kopi Nusantara", "Dikirim"],
                ["PO-0420 · Dairy Prima", "Disetujui"],
                ["PO-0419 · Packindo", "Menunggu"],
                ["PO-0418 · Sweetline", "Selesai"],
              ]}
            />
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function ScreenKonsultasi() {
  return (
    <AppShell activeModule="Konsultasi" breadcrumb="Jadwal & rekomendasi" tabs={["Undang tim", "Riwayat", "Minggu ini"]}>
      <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[1fr_1.2fr]">
        <Panel title="Jadwal konsultasi">
          <Rows
            rows={[
              ["Sen 09.00 · Review margin", "Zoom"],
              ["Rab 13.30 · Rencana outlet 5", "Onsite"],
              ["Kam 16.00 · Audit stok", "Zoom"],
              ["Jum 10.00 · Bedah laporan", "Zoom"],
            ]}
          />
          <div className="mt-auto pt-3">
            <div className="border border-border p-2.5">
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Konsultan pendamping</p>
              <p className="mt-1 font-display text-[11px] font-bold tracking-tight">Rangga P. · F&amp;B Ops</p>
            </div>
          </div>
        </Panel>
        <div className="flex min-h-0 flex-col gap-3">
          <Panel title="Rekomendasi otomatis" note="dibuat dari data Anda">
            <ul className="space-y-2 text-[9px] sm:text-[10px]">
              {[
                "Naikkan harga cold brew 5% - elastisitas rendah 3 bulan terakhir.",
                "Gula aren kritis: buat PO sebelum Kamis agar tidak kehilangan 42 order/hari.",
                "Shift sore Kemang kelebihan 1 barista pada 14.00-16.00.",
              ].map((t) => (
                <li key={t} className="flex gap-2 border-b border-border pb-2 last:border-0">
                  <span className="font-display font-bold">→</span>
                  <span className="text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Skor kesehatan bisnis" className="flex-1">
            <div className="flex items-baseline gap-2">
              <p className="font-display text-2xl font-bold tracking-tight">82</p>
              <span className="text-[9px] text-muted-foreground">/100 · +7 vs Agustus</span>
            </div>
            <div className="mt-3 space-y-2">
              <Meter label="Profitabilitas" value={78} />
              <Meter label="Operasional" value={88} />
              <Meter label="Kepatuhan" value={71} />
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

/* ---------- carousel ---------- */

const screens = [
  { label: "Dashboard", el: <ScreenDashboard /> },
  { label: "Penjualan", el: <ScreenPenjualan /> },
  { label: "Keuangan", el: <ScreenKeuangan /> },
  { label: "Inventori", el: <ScreenInventori /> },
  { label: "Konsultasi", el: <ScreenKonsultasi /> },
];

export function Showcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setActive((i) => (i + 1) % screens.length), 4500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mx-auto mt-16 max-w-5xl">
      <div className="relative aspect-[16/10] overflow-hidden border border-border bg-card shadow-[0_30px_80px_-40px_oklch(0.14_0_0/0.45)] sm:aspect-[16/9]">
        {screens.map((s, i) => (
          <div
            key={s.label}
            aria-hidden={i !== active}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              i === active ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-6 opacity-0"
            }`}
          >
            {s.el}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {screens.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setActive(i)}
            aria-current={i === active}
            className={`rounded-sm border px-3 py-2 font-display text-[11px] tracking-wide transition-colors sm:px-4 sm:text-xs ${
              i === active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
