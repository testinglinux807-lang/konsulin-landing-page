import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import logoUrl from "@/assets/logo.png";
import { ambilKuisFn, kirimKuisFn } from "@/lib/lamaran.functions";
import type { InfoKuis } from "@/lib/lamaran.server";

// Kuis product 5 soal pilihan ganda (+ soal esai kalau diatur tim) buat kandidat Sales Partner. Lulus cuma dari pilihan
// ganda; jawaban esai dibaca tim rekrutmen buat bahan interview. Link unik dikirim tim rekrutmen via WA; nilainya langsung masuk
// ke sistem rekrutmen (Makalin). Satu link cuma bisa dikerjain sekali.
export const Route = createFileRoute("/kuis/$token")({
  head: () => ({
    meta: [
      { title: "Kuis Sales Partner | Konsulin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Kuis,
});

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

function Kuis() {
  const { token } = Route.useParams();
  const [info, setInfo] = useState<InfoKuis | null>(null);
  const [error, setError] = useState("");
  const [jawaban, setJawaban] = useState<Record<string, number>>({});
  const [esai, setEsai] = useState<Record<string, string>>({});
  const [setuju, setSetuju] = useState(false);
  const [sibuk, setSibuk] = useState(false);
  const [hasil, setHasil] = useState<{ benar: number; dari: number; lulus: boolean } | null>(null);

  useEffect(() => {
    ambilKuisFn({ data: { token } }).then(setInfo, (e: Error) => setError(e.message));
  }, [token]);

  if (error && !info) {
    return (
      <Kerangka>
        <h1 className="font-display text-2xl font-bold">Link kuis nggak bisa dibuka</h1>
        <p className="mt-3 text-muted-foreground">{error}</p>
      </Kerangka>
    );
  }
  if (!info) {
    return (
      <Kerangka>
        <p className="text-muted-foreground">Memuat kuis…</p>
      </Kerangka>
    );
  }
  const selesai = hasil || (info.selesai ? { benar: info.benar ?? 0, dari: info.dari ?? 5, lulus: !!info.lulus } : null);
  if (selesai) {
    return (
      <Kerangka>
        <h1 className="font-display text-3xl font-bold">
          {selesai.lulus ? "Benar semua!" : `Kamu benar ${selesai.benar} dari ${selesai.dari}`}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {selesai.lulus
            ? "Makasih udah ngerjain kuisnya. Kalau kamu juga udah daftar di aplikasi Asisten Warung pakai nomor WA yang kamu pakai buat melamar, tim rekrutmen bakal ngirim link buat pilih jadwal interview."
            : "Makasih udah ngerjain kuisnya. Syarat lanjutnya benar semua, jadi tim rekrutmen bakal ngabarin kamu soal langkah berikutnya lewat WhatsApp."}
        </p>
      </Kerangka>
    );
  }
  const soal = info.soal ?? [];
  const soalEsai = info.esai ?? [];
  const minEsai = info.minEsai ?? 15;
  const esaiKurang = soalEsai.filter((s) => (esai[s.id] ?? "").trim().length < minEsai).length;
  const lengkap = soal.every((s) => jawaban[s.id] !== undefined) && !esaiKurang;

  return (
    <Kerangka>
      <p className="font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">Kuis Sales Partner</p>
      <h1 className="mt-3 font-display text-3xl font-bold leading-tight">Halo {info.nama}, jawab {soal.length + soalEsai.length} soal ini ya</h1>
      <p className="mt-3 text-muted-foreground">
        Jawabannya ada di materi yang dikirim lewat WhatsApp. Kuis ini cuma bisa dikerjain sekali, jadi baca pelan-pelan.
      </p>
      <form
        className="mt-8 space-y-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setSibuk(true);
          try {
            setHasil(await kirimKuisFn({ data: { token, jawaban, esai, setuju } }));
          } catch (err) {
            setError((err as Error).message);
            setSibuk(false);
          }
        }}
      >
        {soal.map((s, i) => (
          <fieldset key={s.id} className="rounded-sm border border-border p-5">
            <legend className="px-1 font-display text-sm font-bold text-muted-foreground">Soal {i + 1}</legend>
            <p className="font-medium">{s.pertanyaan}</p>
            <div className="mt-3 space-y-2">
              {s.pilihan.map((p, j) => (
                <label
                  key={j}
                  className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 transition-colors ${
                    jawaban[s.id] === j ? "border-primary bg-primary/5" : "border-border hover:border-foreground/40"
                  }`}
                >
                  <input
                    type="radio"
                    name={`soal-${s.id}`}
                    className="h-4 w-4 accent-current"
                    checked={jawaban[s.id] === j}
                    onChange={() => setJawaban((x) => ({ ...x, [s.id]: j }))}
                  />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {soalEsai.map((s, i) => {
          const isi = esai[s.id] ?? "";
          return (
            <fieldset key={`e${s.id}`} className="rounded-sm border border-border p-5">
              <legend className="px-1 font-display text-sm font-bold text-muted-foreground">Soal {soal.length + i + 1} · esai</legend>
              <label htmlFor={`esai-${s.id}`} className="font-medium">
                {s.pertanyaan}
              </label>
              {s.petunjuk && <p className="mt-1 text-sm text-muted-foreground">{s.petunjuk}</p>}
              <textarea
                id={`esai-${s.id}`}
                rows={5}
                maxLength={s.maks}
                value={isi}
                onChange={(e) => setEsai((x) => ({ ...x, [s.id]: e.target.value }))}
                placeholder="Tulis jawabanmu pakai bahasa sendiri…"
                className="mt-3 w-full rounded-sm border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary"
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {isi.trim().length < minEsai ? `minimal ${minEsai} huruf · ` : ""}
                {isi.length}/{s.maks}
              </p>
            </fieldset>
          );
        })}
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1 h-4 w-4" checked={setuju} onChange={(e) => setSetuju(e.target.checked)} />
          <span>Saya paham dan setuju skema kerja Sales Partner: penghasilan dari bagi hasil toko yang saya bawa, bukan gaji tetap.</span>
        </label>
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={sibuk || !lengkap || !setuju}
          className="w-full rounded-sm bg-primary px-7 py-3.5 font-display text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {sibuk ? "Mengirim…" : lengkap ? "Kirim jawaban" : `Jawab semua soal dulu (${Object.keys(jawaban).length + soalEsai.length - esaiKurang}/${soal.length + soalEsai.length})`}
        </button>
      </form>
    </Kerangka>
  );
}
