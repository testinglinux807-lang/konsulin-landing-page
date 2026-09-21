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
