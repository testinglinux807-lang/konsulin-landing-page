import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { ambilInfoLamaran, kirimLamaran } from "@/lib/lamaran.functions";
import { keWebp } from "@/lib/gambar";

// Form lamaran Sales Partner (3 langkah). Kiriman diterusin server landing ke Makalin Ops, tempat tim rekrutmen
// ngeproses kandidat. ?s=KODE = titik sebar (poster, postingan grup, dst), ?ref=REF-XXXXXX = diajak teman.
const LANGKAH = ["Data diri", "Pengalaman & kesiapan", "Dokumen & persetujuan"];
const MAKS_FILE = 3 * 1024 * 1024;
const PROSPEK_LAIN = "Saya memiliki ide lain";

type Berkas = { nama: string; ukuran: number; data: string } | null;
type Info = Awaited<ReturnType<typeof ambilInfoLamaran>>;
type Isi = {
  nama: string;
  noHp: string;
  email: string;
  tanggalLahir: string;
  jenisKelamin: string;
  kota: string;
  kecamatan: string;
  pendidikan: string;
  pekerjaan: string;
  pengalamanSales: string;
  bidangPengalaman: string;
  waktuKerja: string;
  ketersediaan: string;
  kendaraan: string;
  hpAndroid: boolean | null;
  area: string;
  kenalWarung: string;
  alasan: string;
  skemaKerja: string;
  tempatProspek: string[];
  tempatProspekLain: string;
  waktuHubungi: string;
  sosmed: string;
  referral: string;
  dropdown: string;
  setujuData: boolean;
  setujuWa: boolean;
};
const AWAL: Isi = {
  nama: "",
  noHp: "",
  email: "",
  tanggalLahir: "",
  jenisKelamin: "",
  kota: "",
  kecamatan: "",
  pendidikan: "",
  pekerjaan: "",
  pengalamanSales: "",
  bidangPengalaman: "",
  waktuKerja: "",
  ketersediaan: "",
  kendaraan: "",
  hpAndroid: null,
  area: "",
  kenalWarung: "",
  alasan: "",
  skemaKerja: "",
  tempatProspek: [],
  tempatProspekLain: "",
  waktuHubungi: "",
  sosmed: "",
  referral: "",
  dropdown: "",
  setujuData: false,
  setujuWa: true,
};

const kelasInput =
  "mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";
const kelasLabel = "font-display text-xs uppercase tracking-widest text-muted-foreground";

export function FormLamaran() {
  const [s, setS] = useState("");
  const [info, setInfo] = useState<Info | null>(null);
  const [gagalInfo, setGagalInfo] = useState("");
  const [isi, setIsi] = useState<Isi>(AWAL);
  const [cv, setCv] = useState<Berkas>(null);
  const [foto, setFoto] = useState<Berkas>(null);
  const [langkah, setLangkah] = useState(0);
  const [error, setError] = useState("");
  const [sibuk, setSibuk] = useState(false);
  const [selesai, setSelesai] = useState(false);
  const atasRef = useRef<HTMLDivElement>(null);

  // Kode sumber dibaca dari alamat di browser (halaman ini dirender server tanpa query).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const kode = (q.get("s") || "").trim().toUpperCase().slice(0, 30);
    setS(kode);
    const ref = q.get("ref");
    if (ref) setIsi((x) => ({ ...x, referral: ref.slice(0, 20) }));
    ambilInfoLamaran({ data: { s: kode } })
      .then(setInfo)
      .catch((e: unknown) => setGagalInfo(e instanceof Error ? e.message : "Gagal memuat form"));
  }, []);

  const P = info?.pilihan ?? {};
  const kodeDikenal = !!(s && info?.kampanye);
  const perluDropdown = !kodeDikenal && !isi.referral.trim();
  const set = <K extends keyof Isi>(k: K, v: Isi[K]) => {
    setError("");
    setIsi((x) => ({ ...x, [k]: v }));
  };

  const cekLangkah = (i: number) => {
    const kosong = (k: keyof Isi, label: string) =>
      !String(isi[k] ?? "").trim() ? `${label} wajib diisi` : null;
    const cek: Record<number, (string | null)[]> = {
      0: [
        kosong("nama", "Nama lengkap"),
        isi.noHp.replace(/\D/g, "").length < 10 ? "Nomor WhatsApp belum benar" : null,
        kosong("tanggalLahir", "Tanggal lahir"),
        !isi.jenisKelamin ? "Pilih jenis kelamin" : null,
        kosong("kota", "Kota / kabupaten"),
        kosong("kecamatan", "Kecamatan"),
        !isi.pendidikan ? "Pilih pendidikan terakhir" : null,
      ],
      1: [
        !isi.pekerjaan ? "Pilih pekerjaan sekarang" : null,
        !isi.pengalamanSales ? "Pilih pengalaman jualan" : null,
        !isi.waktuKerja ? "Pilih waktu kerja" : null,
        kosong("ketersediaan", "Hari & jam tersedia"),
        !isi.kendaraan ? "Pilih kendaraan" : null,
        isi.hpAndroid === null ? "Jawab soal HP Android" : null,
        kosong("area", "Area yang mau digarap"),
        !isi.kenalWarung ? "Pilih jumlah warung yang kamu kenal" : null,
        isi.alasan.trim().length < 20 ? "Ceritain alasanmu minimal 20 huruf" : null,
        !isi.skemaKerja ? "Pilih skema kerja yang paling nyaman buat kamu" : null,
        !isi.tempatProspek.length ? "Pilih tempat terbaik buat nemuin pemilik usaha" : null,
        isi.tempatProspek.includes(PROSPEK_LAIN) && isi.tempatProspekLain.trim().length < 5
          ? "Tulis ide tempatmu (minimal 5 huruf)"
          : null,
      ],
      2: [
        !cv ? "Upload CV kamu dulu" : null,
        !isi.waktuHubungi ? "Pilih waktu terbaik buat dihubungi" : null,
        perluDropdown && !isi.dropdown ? "Pilih tahu Konsulin dari mana" : null,
        !isi.setujuData ? "Centang persetujuan pemakaian data" : null,
      ],
    };
    return (cek[i] ?? []).find(Boolean) || "";
  };

  const keAtas = () => atasRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  const lanjut = () => {
    const e = cekLangkah(langkah);
    setError(e);
    if (!e) {
      setLangkah((x) => x + 1);
      keAtas();
    }
  };

  const pilihFile =
    (setB: (b: Berkas) => void, jenis: "cv" | "foto") =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      e.target.value = "";
      setError("");
      if (!f) return;
      const gambar = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].includes(
        f.type,
      );
      if (jenis === "foto" && !gambar) return setError("Foto harus berupa gambar (JPG, PNG, WEBP)");
      if (jenis === "cv" && !gambar && f.type !== "application/pdf")
        return setError("CV harus PDF atau gambar (JPG, PNG, WEBP)");
      // Gambar diubah ke WEBP + dikecilin dulu (lib/gambar); PDF dikirim apa adanya.
      if (gambar) {
        try {
          const h = await keWebp(f, jenis === "foto" ? 1200 : 2000);
          if (h.ukuran > MAKS_FILE)
            return setError(
              `${jenis === "cv" ? "CV" : "Foto"} masih lebih dari 3 MB setelah dikecilin`,
            );
          return setB(h);
        } catch {
          return setError("Gambar nggak kebaca. Coba pilih ulang atau pakai JPG.");
        }
      }
      if (f.size > MAKS_FILE) return setError("CV PDF maksimal 3 MB");
      const r = new FileReader();
      r.onload = () => setB({ nama: f.name, ukuran: f.size, data: String(r.result) });
      r.readAsDataURL(f);
    };

  const kirim = async (e: React.FormEvent) => {
    e.preventDefault();
    const salah = cekLangkah(0) || cekLangkah(1) || cekLangkah(2);
    if (salah) return setError(salah);
    setError("");
    setSibuk(true);
    try {
      await kirimLamaran({ data: { ...isi, s, cv, foto } });
      setSelesai(true);
      keAtas();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengirim lamaran. Coba lagi sebentar lagi.",
      );
    } finally {
      setSibuk(false);
    }
  };

  const teks = (
    k: keyof Isi,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <label className="block">
      <span className={kelasLabel}>{label}</span>
      <input
        value={String(isi[k] ?? "")}
        onChange={(e) => set(k, e.target.value as never)}
        className={kelasInput}
        {...props}
      />
    </label>
  );
  const pilih = (k: keyof Isi, label: string, opsi?: string[]) => (
    <label className="block">
      <span className={kelasLabel}>{label}</span>
      <select
        value={String(isi[k] ?? "")}
        onChange={(e) => set(k, e.target.value as never)}
        className={kelasInput}
      >
        <option value="">Pilih</option>
        {(opsi ?? []).map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
  // Pertanyaan yang opsinya panjang: radio (satu) atau centang (banyak, dengan batas).
  const opsi = (
    k: "skemaKerja" | "waktuHubungi" | "tempatProspek",
    label: string,
    daftar?: string[],
    maks?: number,
  ) => {
    const banyak = k === "tempatProspek";
    const nilai = isi[k];
    const penuh = banyak && maks ? (nilai as string[]).length >= maks : false;
    return (
      <fieldset className="block">
        <legend className={kelasLabel + " leading-relaxed"}>
          {label}
          {maks ? (
            <span className="normal-case tracking-normal"> (pilih maksimal {maks})</span>
          ) : null}
        </legend>
        <div className="mt-3 space-y-2">
          {(daftar ?? []).map((o) => {
            const dipilih = banyak ? (nilai as string[]).includes(o) : nilai === o;
            const mati = !dipilih && penuh;
            return (
              <label
                key={o}
                className={`flex cursor-pointer items-start gap-3 rounded-sm border px-4 py-3 text-sm transition-colors ${
                  dipilih
                    ? "border-primary bg-accent"
                    : "border-input bg-background hover:border-primary"
                } ${mati ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <input
                  type={banyak ? "checkbox" : "radio"}
                  name={k}
                  checked={dipilih}
                  disabled={mati}
                  onChange={() => {
                    if (!banyak) return set(k, o as never);
                    const arr = nilai as string[];
                    set("tempatProspek", dipilih ? arr.filter((y) => y !== o) : [...arr, o]);
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[oklch(0.14_0_0)]"
                />
                <span>{o === PROSPEK_LAIN ? "Saya memiliki ide lain (tulis di bawah)" : o}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  };
  const berkas = (
    label: string,
    nilai: Berkas,
    setB: (b: Berkas) => void,
    jenis: "cv" | "foto",
  ) => (
    <div>
      <span className={kelasLabel}>{label}</span>
      {nilai ? (
        <div className="mt-2 flex items-center justify-between gap-3 rounded-sm border border-input bg-background px-3 py-2.5 text-sm">
          <span className="break-all">
            {nilai.nama}{" "}
            <span className="text-muted-foreground">
              ({nilai.ukuran < 1024 ? `${nilai.ukuran} B` : `${Math.round(nilai.ukuran / 1024)} KB`}
              )
            </span>
          </span>
          <button
            type="button"
            onClick={() => setB(null)}
            className="shrink-0 font-display text-xs font-medium underline underline-offset-4 hover:text-foreground"
          >
            Hapus
          </button>
        </div>
      ) : (
        <label className="mt-2 flex cursor-pointer flex-col items-center gap-1 rounded-sm border border-dashed border-input bg-background px-4 py-6 text-center text-sm transition-colors hover:border-primary focus-within:border-primary">
          <input
            type="file"
            className="sr-only"
            accept={jenis === "cv" ? "application/pdf,image/*" : "image/*"}
            onChange={pilihFile(setB, jenis)}
          />
          <span className="font-display font-medium">Pilih file</span>
          <span className="text-xs text-muted-foreground">
            {jenis === "cv" ? "PDF (maks 3 MB) atau foto dokumen" : "Foto dari kamera atau galeri"}
          </span>
        </label>
      )}
    </div>
  );
  const centang = (k: "setujuData" | "setujuWa", children: ReactNode) => (
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted-foreground">
      <input
        type="checkbox"
        checked={isi[k]}
        onChange={(e) => set(k, e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-[oklch(0.14_0_0)]"
      />
      <span>{children}</span>
    </label>
  );

  return (
    <div ref={atasRef} className="scroll-mt-24 border border-border bg-card p-6 md:p-10">
      {selesai ? (
        <div className="flex flex-col items-center gap-4 py-10 text-center animate-in fade-in-0 zoom-in-95 duration-300">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-7 w-7" />
          </div>
          <p className="font-display text-lg font-bold tracking-tight">Lamaran kamu udah masuk</p>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Makasih, {isi.nama.split(" ")[0]}. Tim Konsulin bakal ngecek lamaranmu dan ngehubungin
            lewat WhatsApp <span className="font-medium text-foreground">{isi.noHp}</span> buat
            tahap berikutnya.
          </p>
        </div>
      ) : gagalInfo ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          <p className="font-display font-bold text-foreground">Form lamaran belum bisa dimuat.</p>
          <p className="mt-2">{gagalInfo}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-sm border border-primary px-6 py-2.5 font-display text-sm font-medium hover:bg-accent"
          >
            Coba lagi
          </button>
        </div>
      ) : !info ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Memuat form lamaran…</p>
      ) : (
        <form onSubmit={kirim} noValidate className="space-y-5">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Form lamaran
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">
              Daftar jadi Sales Partner
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sekitar 5 menit.
              {info.kampanye
                ? ` Program: ${info.kampanye.nama}${info.kampanye.area ? `, ${info.kampanye.area}` : ""}.`
                : ""}
            </p>
          </div>

          <ol
            className="grid gap-px border border-border bg-border sm:grid-cols-3"
            aria-label="Langkah pengisian"
          >
            {LANGKAH.map((l, i) => (
              <li
                key={l}
                aria-current={i === langkah ? "step" : undefined}
                className={`flex items-center gap-3 px-4 py-3 font-display text-xs uppercase tracking-widest ${
                  i === langkah
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                    i === langkah
                      ? "border-primary-foreground"
                      : i < langkah
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                  }`}
                >
                  {i < langkah ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                {l}
              </li>
            ))}
          </ol>

          {langkah === 0 && (
            <>
              {teks("nama", "Nama lengkap (sesuai KTP)", { autoComplete: "name" })}
              <div className="grid gap-5 sm:grid-cols-2">
                {teks("noHp", "Nomor WhatsApp", {
                  inputMode: "tel",
                  autoComplete: "tel",
                  placeholder: "08xxxxxxxxxx",
                })}
                {teks("email", "Email (opsional)", { type: "email", autoComplete: "email" })}
                {teks("tanggalLahir", "Tanggal lahir", { type: "date" })}
                {pilih("jenisKelamin", "Jenis kelamin", P.jenisKelamin)}
                {teks("kota", "Kota / kabupaten domisili", { placeholder: "Bandung" })}
                {teks("kecamatan", "Kecamatan", { placeholder: "Coblong" })}
              </div>
              {pilih("pendidikan", "Pendidikan terakhir", P.pendidikan)}
            </>
          )}

          {langkah === 1 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                {pilih("pekerjaan", "Pekerjaan sekarang", P.pekerjaan)}
                {pilih("pengalamanSales", "Pengalaman jualan / sales", P.pengalamanSales)}
              </div>
              {teks("bidangPengalaman", "Pernah jualan apa? (opsional)", {
                placeholder: "Misal: sales FMCG, jualan pulsa, reseller online",
              })}
              <div className="grid gap-5 sm:grid-cols-2">
                {pilih("waktuKerja", "Bisa kerja", P.waktuKerja)}
                {teks("ketersediaan", "Hari & jam tersedia", {
                  placeholder: "Senin-Sabtu, 09.00-16.00",
                })}
                {pilih("kendaraan", "Kendaraan buat keliling", P.kendaraan)}
                <fieldset className="block">
                  <legend className={kelasLabel}>Punya HP Android + kuota?</legend>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {[
                      [true, "Punya"],
                      [false, "Belum"],
                    ].map(([v, t]) => (
                      <button
                        key={String(v)}
                        type="button"
                        aria-pressed={isi.hpAndroid === v}
                        onClick={() => set("hpAndroid", v as boolean)}
                        className={`rounded-sm border px-3 py-2.5 font-display text-sm font-medium transition-colors ${
                          isi.hpAndroid === v
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background hover:border-primary"
                        }`}
                      >
                        {t as string}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
              {teks("area", "Area yang mau kamu garap", {
                placeholder: "Kecamatan / kelurahan sekitar rumah",
              })}
              {pilih(
                "kenalWarung",
                "Kira-kira kenal berapa pemilik warung di sekitarmu?",
                P.kenalWarung,
              )}
              <label className="block">
                <span className={kelasLabel}>Kenapa tertarik jadi Sales Partner?</span>
                <textarea
                  rows={4}
                  value={isi.alasan}
                  onChange={(e) => set("alasan", e.target.value)}
                  placeholder="Ceritain singkat: pengalamanmu, target penghasilan, atau kenapa kamu cocok"
                  className={kelasInput}
                />
                <span className="mt-1 block text-[11px] text-muted-foreground">
                  {isi.alasan.trim().length}/20 huruf minimal
                </span>
              </label>
              {opsi("skemaKerja", "Skema kerja mana yang paling bikin kamu nyaman?", P.skemaKerja)}
              {opsi(
                "tempatProspek",
                "Menurut kamu, di mana tempat terbaik buat nemuin pemilik usaha / UMKM yang butuh solusi software?",
                P.tempatProspek,
                2,
              )}
              {isi.tempatProspek.includes(PROSPEK_LAIN) &&
                teks("tempatProspekLain", "Ide tempat lainnya", {
                  placeholder: "Misal: pasar tradisional, grup WA RT",
                  maxLength: 200,
                })}
            </>
          )}

          {langkah === 2 && (
            <>
              {berkas("CV / riwayat hidup", cv, setCv, "cv")}
              {berkas("Foto diri (opsional)", foto, setFoto, "foto")}
              {teks("sosmed", "Link Instagram / Facebook / LinkedIn (opsional)", {
                placeholder: "https://",
              })}
              {teks("referral", "Kode referral (kalau diajak teman)", {
                placeholder: "REF-A1B2C3",
                autoCapitalize: "characters",
              })}
              {perluDropdown && pilih("dropdown", "Tahu Konsulin dari mana?", info.pilihanSumber)}
              {opsi(
                "waktuHubungi",
                "Kalau kamu terpilih, kapan waktu terbaik tim kami ngehubungin lewat WhatsApp?",
                P.waktuHubungi,
              )}
              <div className="space-y-3 pt-1">
                {centang(
                  "setujuData",
                  "Saya setuju data di lamaran ini dipakai Konsulin buat proses seleksi Sales Partner. Data pelamar yang nggak lolos dihapus setelah 2 tahun.",
                )}
                {centang("setujuWa", "Boleh dihubungi lewat WhatsApp soal lamaran ini.")}
              </div>
            </>
          )}

          {error && (
            <p role="alert" className="text-sm font-medium text-foreground">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            {langkah > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setLangkah((x) => x - 1);
                }}
                className="rounded-sm border border-primary px-6 py-3 font-display text-sm font-medium transition-colors hover:bg-accent"
              >
                Kembali
              </button>
            ) : (
              <span />
            )}
            {langkah < LANGKAH.length - 1 ? (
              <button
                type="button"
                onClick={lanjut}
                className="rounded-sm bg-primary px-7 py-3 font-display text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
              >
                Lanjut
              </button>
            ) : (
              <button
                type="submit"
                disabled={sibuk}
                className="rounded-sm bg-primary px-7 py-3 font-display text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-50"
              >
                {sibuk ? "Mengirim…" : "Kirim lamaran"}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
