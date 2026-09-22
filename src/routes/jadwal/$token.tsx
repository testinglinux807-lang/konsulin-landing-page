import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import logoUrl from "@/assets/logo.png";
import { ambilJadwalFn, pilihJadwalFn } from "@/lib/lamaran.functions";
import type { InfoJadwal, Slot } from "@/lib/lamaran.server";

// Kandidat Sales Partner milih sendiri jadwal interview dari slot yang dibuka tim rekrutmen. Link unik per kandidat.
export const Route = createFileRoute("/jadwal/$token")({
  head: () => ({
    meta: [
      { title: "Pilih jadwal interview | Konsulin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Jadwal,
});

const ZONA = "Asia/Jakarta";
const hari = (t: string) => new Date(t).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", timeZone: ZONA });
const jam = (t: string) => new Date(t).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: ZONA });

function Kerangka({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-6 py-4">
          <img src={logoUrl} alt="Logo Konsulin" className="h-8 w-8" width={40} height={40} />
          <span className="font-display text-lg font-bold tracking-tight">Konsulin</span>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-10">{children}</main>
    </div>
  );
}

function RingkasSlot({ s }: { s: Slot }) {
  return (
    <div className="rounded-sm border border-foreground p-5">
      <p className="font-display text-xl font-bold capitalize">{hari(s.mulai)}</p>
      <p className="mt-1 text-lg">
        Jam {jam(s.mulai)} WIB · {s.durasi} menit · sama {s.pewawancara}
      </p>
      {s.lokasi && <p className="mt-2 break-words text-muted-foreground">{s.lokasi}</p>}
    </div>
  );
}

function Jadwal() {
  const { token } = Route.useParams();
  const [info, setInfo] = useState<InfoJadwal | null>(null);
  const [error, setError] = useState("");
  const [ganti, setGanti] = useState(false);
  const [sibuk, setSibuk] = useState<number | null>(null);

  const muat = () => ambilJadwalFn({ data: { token } }).then(setInfo, (e: Error) => setError(e.message));
  useEffect(() => {
    muat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const perHari = useMemo(() => {
    const g: { h: string; slot: Slot[] }[] = [];
    for (const s of info?.slot ?? []) {
      const h = hari(s.mulai);
      const x = g[g.length - 1];
      if (x?.h === h) x.slot.push(s);
      else g.push({ h, slot: [s] });
    }
    return g;
  }, [info]);

  if (error && !info) {
    return (
      <Kerangka>
        <h1 className="font-display text-2xl font-bold">Link jadwal nggak bisa dibuka</h1>
        <p className="mt-3 text-muted-foreground">{error}</p>
      </Kerangka>
    );
  }
  if (!info) {
    return (
      <Kerangka>
        <p className="text-muted-foreground">Memuat jadwal…</p>
      </Kerangka>
    );
  }

  if (info.terpilih && (!ganti || info.tutup)) {
    return (
      <Kerangka>
        <p className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">Interview Sales Partner</p>
        <h1 className="mt-3 font-display text-3xl font-bold">Jadwal kamu udah kesimpan</h1>
        <div className="mt-6">
          <RingkasSlot s={info.terpilih} />
        </div>
        <p className="mt-4 text-muted-foreground">Datang tepat waktu ya. Kalau ada perubahan, tim rekrutmen bakal ngabarin lewat WhatsApp.</p>
        {!info.tutup && (
          <button className="mt-6 text-sm font-medium underline underline-offset-4" onClick={() => setGanti(true)}>
            Ganti jadwal
          </button>
        )}
      </Kerangka>
    );
  }
  if (info.tutup) {
    return (
      <Kerangka>
        <h1 className="font-display text-2xl font-bold">Pemilihan jadwal udah ditutup</h1>
        <p className="mt-3 text-muted-foreground">Hubungi tim rekrutmen lewat WhatsApp kalau ada pertanyaan.</p>
      </Kerangka>
    );
  }

  return (
    <Kerangka>
      <p className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">Interview Sales Partner</p>
      <h1 className="mt-3 font-display text-3xl font-bold leading-tight">Halo {info.nama}, pilih jadwal interview</h1>
      <p className="mt-3 text-muted-foreground">Semua jam dalam WIB. Pilih satu yang paling pas buat kamu.</p>
      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
      {perHari.length === 0 ? (
        <div className="mt-8 rounded-sm border border-border p-5">
          <p className="font-medium">Belum ada jadwal yang kebuka.</p>
          <p className="mt-1 text-muted-foreground">Tim rekrutmen lagi nyiapin slot. Buka lagi link ini nanti, atau tanya lewat WhatsApp.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {perHari.map((g) => (
            <section key={g.h}>
              <h2 className="font-display text-lg font-bold capitalize">{g.h}</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {g.slot.map((s) => (
                  <button
                    key={s.id}
                    disabled={sibuk !== null}
                    onClick={async () => {
                      setError("");
                      setSibuk(s.id);
                      try {
                        await pilihJadwalFn({ data: { token, slot: Number(s.id) } });
                        setGanti(false);
                        await muat();
                      } catch (e) {
                        setError((e as Error).message);
                        await muat();
                      } finally {
                        setSibuk(null);
                      }
                    }}
                    className="min-h-16 rounded-sm border border-border px-3 py-3 text-left transition-colors hover:border-foreground disabled:opacity-50"
                  >
                    <span className="block font-display text-lg font-bold">{sibuk === s.id ? "Nyimpen…" : jam(s.mulai)}</span>
                    <span className="block text-xs text-muted-foreground">
                      {s.durasi} menit · {s.pewawancara}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </Kerangka>
  );
}
