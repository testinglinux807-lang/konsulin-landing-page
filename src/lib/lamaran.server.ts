// Server-only: nerusin form lamaran Sales Partner ke Makalin Ops (sistem rekrutmen internal Konsulin).
// Browser pelamar cuma ngobrol sama server landing ini - alamat Makalin nggak pernah kebuka ke publik.
// Makalin jalan di VPS yang sama, jadi default-nya lewat loopback.
function ensureEnvLoaded() {
  if (process.env["MAKALIN_API_URL"]) return;
  try {
    process.loadEnvFile?.();
  } catch {
    // Nggak ada .env - pakai default.
  }
}

function baseUrl() {
  ensureEnvLoaded();
  return (process.env["MAKALIN_API_URL"] || "http://127.0.0.1:4100").replace(/\/+$/, "");
}

async function panggil(path: string, init: RequestInit & { ipPelamar?: string | undefined }) {
  const { ipPelamar, ...opsi } = init;
  let res: Response;
  try {
    res = await fetch(baseUrl() + "/api/publik" + path, {
      ...opsi,
      headers: {
        "Content-Type": "application/json",
        // Biar batas percobaan di Makalin dihitung per pelamar, bukan per server landing.
        ...(ipPelamar ? { "X-Pelamar-IP": ipPelamar } : {}),
      },
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error("Sistem lamaran lagi nggak bisa dihubungi. Coba lagi beberapa menit lagi.");
  }
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(data.error || "Gagal memproses lamaran. Coba lagi sebentar lagi.");
  return data;
}

export type InfoLamaran = {
  kampanye: { nama: string; area: string | null } | null;
  pilihanSumber: string[];
  pilihan: Partial<
    Record<
      | "jenisKelamin"
      | "pendidikan"
      | "pekerjaan"
      | "pengalamanSales"
      | "waktuKerja"
      | "kendaraan"
      | "kenalWarung"
      | "skemaKerja"
      | "waktuHubungi"
      | "tempatProspek",
      string[]
    >
  >;
};

export function ambilInfo(s: string) {
  return panggil(`/daftar/info?s=${encodeURIComponent(s)}`, {
    method: "GET",
  }) as Promise<InfoLamaran>;
}

export function kirim(data: Record<string, unknown>, ipPelamar?: string | undefined) {
  return panggil("/daftar", { method: "POST", body: JSON.stringify(data), ipPelamar });
}

// ---- Kuis product & pilih jadwal interview (link unik per kandidat, dikirim tim rekrutmen via WA) ----
export type SoalKuis = { id: number; pertanyaan: string; pilihan: string[] };
export type EsaiKuis = { id: number; pertanyaan: string; petunjuk: string | null; maks: number };
export type InfoKuis = { nama: string; selesai: boolean; soal?: SoalKuis[]; esai?: EsaiKuis[]; minEsai?: number; benar?: number; dari?: number; lulus?: boolean };
export type Slot = { id: number; mulai: string; durasi: number; lokasi: string | null; pewawancara: string };
export type InfoJadwal = { nama: string; tutup: boolean; terpilih: Slot | null; slot: Slot[] };

const jalur = (t: string) => encodeURIComponent(t);
export function ambilKuis(token: string) {
  return panggil(`/kuis/${jalur(token)}`, { method: "GET" }) as Promise<InfoKuis>;
}
export function kirimKuis(token: string, data: { jawaban: Record<string, number>; esai: Record<string, string>; setuju: boolean }, ip?: string) {
  return panggil(`/kuis/${jalur(token)}`, { method: "POST", body: JSON.stringify(data), ipPelamar: ip }) as Promise<{ benar: number; dari: number; lulus: boolean }>;
}
export function ambilJadwal(token: string) {
  return panggil(`/jadwal/${jalur(token)}`, { method: "GET" }) as Promise<InfoJadwal>;
}
export function pilihJadwal(token: string, slot: number, ip?: string) {
  return panggil(`/jadwal/${jalur(token)}`, { method: "POST", body: JSON.stringify({ slot }), ipPelamar: ip }) as Promise<Slot>;
}
