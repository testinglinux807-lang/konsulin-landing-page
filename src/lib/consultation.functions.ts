import { createServerFn } from "@tanstack/react-start";
import { consultationSchema } from "./consultation.schema";
import { sendConsultationNotification } from "./consultation.server";

// RPC endpoint the "Talk to Us" form calls. Safe to import from client code —
// the build swaps this for a network-call stub in the client bundle, so the
// Resend API key in consultation.server.ts never ships to the browser.
export const submitConsultation = createServerFn({ method: "POST" })
  .validator(consultationSchema)
  .handler(async ({ data }) => {
    await sendConsultationNotification(data);
    return { success: true as const };
  });
