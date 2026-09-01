import { z } from "zod";

// Shared between client (form) and server (validator) — no secrets here.
export const consultationSchema = z.object({
  nama: z.string().trim().min(1, "Nama wajib diisi"),
  email: z.string().trim().email("Email tidak valid"),
  hp: z.string().trim().min(8, "No HP tidak valid"),
  tanggal: z.string().trim().min(1, "Tanggal wajib diisi"),
  jam: z.string().trim().min(1, "Jam wajib diisi"),
  catatan: z.string().trim().optional(),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;
