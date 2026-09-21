// Foto & CV berupa gambar dikecilin & diubah ke WEBP di browser sebelum dikirim, jadi foto kamera HP 5-10 MB
// tetap muat di batas 3 MB. canvas.toDataURL() diam-diam balikin PNG kalau WEBP nggak didukung (Safari lama),
// makanya dicek sekali dan jatuh ke JPEG.
let format: string | null = null;
function formatGambar() {
  if (format) return format;
  try {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 1;
    format = c.toDataURL("image/webp").startsWith("data:image/webp") ? "image/webp" : "image/jpeg";
  } catch {
    format = "image/jpeg";
  }
  return format;
}

export async function keWebp(file: File, maks = 1600, kualitas = 0.82) {
  const bmp = await createImageBitmap(file);
  const skala = Math.min(1, maks / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * skala);
  c.height = Math.round(bmp.height * skala);
  c.getContext("2d")?.drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close?.();
  const f = formatGambar();
  const data = c.toDataURL(f, kualitas);
  return {
    data,
    ukuran: Math.round((data.length - data.indexOf(",") - 1) * 0.75),
    nama: file.name.replace(/\.[^.]+$/, "") + (f === "image/webp" ? ".webp" : ".jpg"),
  };
}
