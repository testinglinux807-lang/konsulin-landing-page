// Server-only: reads secrets from process.env and calls the Resend API.
// Never import this from client code — createServerFn keeps it out of the
// client bundle as long as it's only reached through consultation.functions.ts.
import type { ConsultationInput } from "./consultation.schema";

/** Loads .env into process.env for local `npm run dev`. Safe no-op if the
 * file doesn't exist or the runtime doesn't support it (e.g. Cloudflare
 * Workers, where secrets come from platform bindings instead). Retries on
 * every call until the key actually shows up, so editing .env after the
 * dev server started (or after an earlier failed attempt) still works. */
function ensureEnvLoaded() {
  if (process.env["RESEND_API_KEY"]) return;
  try {
    process.loadEnvFile?.();
  } catch {
    // No .env file (or unsupported runtime) — fall back to real process.env.
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendEmail(opts: { to: string[]; subject: string; html: string; replyTo?: string }) {
  ensureEnvLoaded();

  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY belum diset. Tambahkan ke file .env di root project (lihat .env.example).",
    );
  }

  const fromEmail = process.env["RESEND_FROM_EMAIL"] || "Konsulin <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: opts.to,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      subject: opts.subject,
      html: opts.html,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Gagal mengirim email (${response.status}): ${body}`);
  }
}

function internalNotificationHtml(input: ConsultationInput) {
  return `
    <div style="font-family: sans-serif; font-size: 14px; color: #111;">
      <h2 style="margin: 0 0 16px;">Permintaan konsultasi baru - Konsulin</h2>
      <table style="border-collapse: collapse;">
        <tr><td style="padding: 4px 12px 4px 0; color: #666;">Nama</td><td>${escapeHtml(input.nama)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; color: #666;">Email</td><td>${escapeHtml(input.email)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; color: #666;">No HP</td><td>${escapeHtml(input.hp)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; color: #666;">Tanggal preferensi</td><td>${escapeHtml(input.tanggal)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; color: #666;">Jam preferensi</td><td>${escapeHtml(input.jam)}</td></tr>
      </table>
      ${
        input.catatan
          ? `<p style="margin-top:16px;"><strong>Catatan:</strong><br/>${escapeHtml(input.catatan).replace(/\n/g, "<br/>")}</p>`
          : ""
      }
    </div>
  `.trim();
}

function customerConfirmationHtml(input: ConsultationInput) {
  return `
    <div style="font-family: sans-serif; font-size: 14px; color: #111; line-height: 1.6;">
      <h2 style="margin: 0 0 16px;">Jadwal konsultasi Anda sudah kami terima</h2>
      <p>Halo ${escapeHtml(input.nama)},</p>
      <p>
        Terima kasih sudah mengajukan jadwal konsultasi dengan tim Konsulin.
        Permintaan Anda untuk <strong>${escapeHtml(input.tanggal)} pukul ${escapeHtml(input.jam)}</strong>
        sudah kami terima dan sedang diproses.
      </p>
      <p>Tinggal tunggu ya — tim kami akan segera menghubungi Anda untuk memastikan jadwalnya.</p>
      <p style="margin-top: 24px; color: #666;">Salam,<br/>Tim Konsulin</p>
    </div>
  `.trim();
}

export async function sendConsultationNotification(input: ConsultationInput) {
  const notifyTo = process.env["CONSULTATION_NOTIFY_EMAIL"] || "konsulinsupport@gmail.com";

  // Notify the Konsulin team — this one must succeed, it's the whole point
  // of the form.
  await sendEmail({
    to: [notifyTo],
    replyTo: input.email,
    subject: `Permintaan konsultasi baru dari ${input.nama}`,
    html: internalNotificationHtml(input),
  });

  // Confirmation copy to the customer — best-effort. Doesn't fail the
  // request if it errors: Resend's shared sandbox sender (onboarding@resend.dev)
  // can only deliver to the Resend account's own verified address until a
  // custom domain is verified, so this can legitimately fail in dev/testing.
  try {
    await sendEmail({
      to: [input.email],
      subject: "Jadwal konsultasi Anda dengan Konsulin sudah diterima",
      html: customerConfirmationHtml(input),
    });
  } catch (err) {
    console.error("Gagal mengirim email konfirmasi ke customer:", err);
  }
}
