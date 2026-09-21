import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { ambilInfo, kirim } from "./lamaran.server";

// RPC buat form lamaran Sales Partner di /karir. Validasi isi lengkapnya di Makalin (satu sumber aturan);
// di sini cuma bentuk dasarnya + batas ukuran biar request aneh nggak diterusin.
const berkas = z
  .object({
    nama: z.string().max(200),
    ukuran: z.number().optional(),
    data: z.string().max(4_500_000),
  })
  .nullable()
  .optional();

const lamaranSchema = z
  .object({
    nama: z.string().max(100),
    noHp: z.string().max(20),
    email: z.string().max(120).optional(),
    s: z.string().max(30).optional(),
    referral: z.string().max(20).optional(),
    tempatProspek: z.array(z.string().max(120)).max(6).optional(),
    cv: berkas,
    foto: berkas,
  })
  .passthrough();

export const ambilInfoLamaran = createServerFn({ method: "GET" })
  .validator(z.object({ s: z.string().max(30) }))
  .handler(async ({ data }) => ambilInfo(data.s));

export const kirimLamaran = createServerFn({ method: "POST" })
  .validator(lamaranSchema)
  .handler(async ({ data }) => {
    // X-Real-IP diisi reverse proxy (nginx: $remote_addr) dan nggak bisa dipalsuin pengunjung.
    await kirim(data, getRequestHeader("x-real-ip") || getRequestIP());
    return { ok: true as const };
  });
