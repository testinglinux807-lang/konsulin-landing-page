import type { ReactNode } from "react";
import dashboardKafeImg from "@/assets/blog-dashboard-kafe.jpg";
import ugorexImg from "@/assets/ugorex.jpg";

export type FaqItem = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  dateIso: string;
  dateLabel: string;
  image: string;
  imageAlt: string;
  excerpt: string;
  faq: FaqItem[];
  /** Intro sentence(s) for the closing CTA, before the "Hubungi kami" link. */
  closingText: string;
  Content: () => ReactNode;
};

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-8 font-display text-lg font-bold tracking-tight text-foreground">
      {children}
    </h3>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-base leading-relaxed text-muted-foreground">{children}</p>;
}

function Ul({ children }: { children: ReactNode }) {
  return <ul className="mt-4 space-y-2.5 text-base leading-relaxed text-muted-foreground">{children}</ul>;
}

function Li({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-1 shrink-0 opacity-40">-</span>
      <span>{children}</span>
    </li>
  );
}

/** Article inline image. Caps height instead of forcing full-width, so both
 * landscape screenshots and portrait phone photos display without cropping. */
function PostImage({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="mt-8 overflow-hidden border border-border bg-muted">
      <img
        src={src}
        alt={alt}
        className="mx-auto max-h-[640px] w-auto max-w-full object-contain"
        loading="lazy"
      />
      <figcaption className="border-t border-border bg-card px-4 py-2.5 text-xs text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

function DashboardKafeContent() {
  return (
    <>
      <P>
        Coba bayangin lu punya kafe. Tiap hari kejar setoran: nyatet penjualan di buku tulis,
        itung stok bahan baku pake feeling, gaji karyawan dihitung manual di Excel yang formulanya
        berantakan, dan pas akhir bulan owner cuma bisa nebak-nebak "untung apa buntung ya bulan
        ini?"
      </P>

      <H2>Kenapa Kafe Kecil-Menengah Butuh Sistem Manajemen Kafe yang Proper?</H2>
      <P>
        Menurut data{" "}
        <a
          href="https://djpb.kemenkeu.go.id/kanwil/ntt/id/data-publikasi/artikel/2886-umkm-goes-digital.html"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Kemenkeu (DJPB)
        </a>
        , 87% UMKM di Indonesia udah pakai internet buat jualan, tapi cuma 73% yang punya akun
        marketplace - artinya banyak yang "online" di depan tapi operasional di belakangnya masih
        manual. Kelihatan dari luar udah modern (ada Instagram, ada GoFood), tapi pembukuan, stok,
        sama gajian karyawan masih jalan sendiri-sendiri, nggak nyambung satu sama lain.
      </P>

      <H3>Masalah yang Sering Kejadian di Lapangan</H3>
      <P>
        Ini masalah klasik yang hampir semua bisnis F&amp;B skala kecil-menengah alami - bukan
        karena mereka nggak niat rapi, tapi karena tools yang ada di pasaran seringnya kemahalan,
        atau malah kebanyakan fitur yang nggak kepake. Nah, dari situ salah satu project kita di
        Konsulin lahir: <strong className="font-semibold text-foreground">Dashboard Kafe</strong> -
        sistem manajemen kafe yang dibangun custom, end-to-end, dari kasir sampai laporan keuangan
        resmi.
      </P>

      <PostImage
        src={dashboardKafeImg}
        alt="Tampilan dashboard Kafe Konsulin dengan modul Menu, Stok Bahan, Keuangan, Aset Tetap, Anggaran, Gaji, Pelanggan, hingga Ekspor Data"
        caption="Tampilan dashboard Kafe Konsulin - semua modul operasional dan keuangan dalam satu layar."
      />

      <H2>Bukan Cuma Aplikasi Kasir: Kenalan Sama Dashboard Kafe</H2>
      <P>
        Banyak yang ngira "sistem kasir" itu ya cuma buat nyatet pesanan sama nge-print struk.
        Dashboard Kafe jauh lebih dari itu. Struktur besarnya dibagi per peran - Owner, Kasir, dan
        Barista masing-masing punya tampilan sendiri sesuai kebutuhan kerjanya - dan semuanya
        nyambung ke satu sumber data yang sama, real-time.
      </P>

      <H3>Kasir &amp; Barista</H3>
      <P>
        Buat <strong className="font-semibold text-foreground">Kasir</strong>: ada modul
        transaksi, pantau pesanan yang lagi berjalan, sampai laci kasir per shift biar nggak ada
        selisih uang yang nggak ketahuan.
      </P>
      <P>
        Buat <strong className="font-semibold text-foreground">Barista</strong>: ada layar dapur
        yang nampilin antrian pesanan masuk, jadi nggak perlu teriak-teriak manggil nomer meja.
      </P>

      <H3>Owner</H3>
      <P>
        Buat <strong className="font-semibold text-foreground">Owner</strong>, ini yang paling
        "berat" - dan paling seru dibangunnya. Di balik layar Owner, ada belasan modul yang saling
        kesambung.
      </P>

      <H2>Fitur-Fitur di Balik Layar Owner</H2>
      <P>
        <strong className="font-semibold text-foreground">Operasional:</strong>
      </P>
      <Ul>
        <Li>
          <strong className="font-semibold text-foreground">Menu, Denah &amp; Meja, Stok Bahan</strong> -
          atur kategori menu, layout meja lengkap sama QR code buat self-order, sampai resep &amp;
          bahan baku biar stok nggak tiba-tiba habis pas jam sibuk.
        </Li>
        <Li>
          <strong className="font-semibold text-foreground">Supplier &amp; Pesanan Beli</strong> -
          catat pemasok, hutang belanja, sampai bikin PO ke supplier langsung dari sistem.
        </Li>
      </Ul>
      <P>
        Nah, ngomong-ngomong soal stok, ini yang biasanya jadi titik lemah kafe kecil - bahan abis
        pas jam ramai, terus baru sadar pas customer udah order. Makanya modul stok sengaja
        disambungin langsung ke resep tiap menu, bukan berdiri sendiri.
      </P>

      <P>
        <strong className="font-semibold text-foreground">Keuangan &amp; Aset:</strong>
      </P>
      <Ul>
        <Li>
          <strong className="font-semibold text-foreground">Keuangan</strong> - ini jantungnya.
          Buku kas otomatis ngerender jadi{" "}
          <strong className="font-semibold text-foreground">Laba Rugi, Neraca, dan Arus Kas</strong>{" "}
          beneran (bukan cuma rekap transaksi mentah) - format yang biasa dipakai akuntan, bukan
          cuma angka acak-acakan.
        </Li>
        <Li>
          <strong className="font-semibold text-foreground">Aset Tetap</strong> - daftar aset kafe
          (kulkas, mesin kopi, meja-kursi) lengkap dengan penyusutan otomatis tiap bulan, biar
          nilai aset di neraca nggak ngasal.
        </Li>
        <Li>
          <strong className="font-semibold text-foreground">Anggaran</strong> - target vs realisasi
          bulanan. Owner set budget "Iklan bulan ini max 2 juta", sistem otomatis ngitung udah
          kepake berapa persen dari transaksi yang beneran kejadian.
        </Li>
      </Ul>

      <P>
        <strong className="font-semibold text-foreground">Tim &amp; Pelanggan:</strong>
      </P>
      <Ul>
        <Li>
          <strong className="font-semibold text-foreground">Gaji &amp; Slip Gaji</strong> - payroll
          staff lengkap sampai bisa cetak slip gaji per karyawan.
        </Li>
        <Li>
          <strong className="font-semibold text-foreground">Pelanggan &amp; Poin Loyalitas</strong> -
          pelanggan yang order lewat QR ngumpulin poin otomatis, bisa ditukar jadi voucher.
        </Li>
        <Li>
          <strong className="font-semibold text-foreground">
            Booking, Promo, Kinerja, Aktivitas, Ekspor Data
          </strong>{" "}
          - reservasi meja dengan DP, voucher &amp; diskon, pantau performa kasir/barista, jejak
          audit tiap aksi staff, sampai ekspor data buat kebutuhan akuntan dan pajak.
        </Li>
      </Ul>

      <P>
        Semuanya itu bukan modul kepake sekali terus mati - tiap fitur beneran kesambung.
        Transaksi yang kasir bikin, langsung ikut ke-hitung di Laba Rugi, ikut mempengaruhi
        progress Anggaran, dan kalau lewat QR order, otomatis nambahin poin loyalitas pelanggan.
        Satu sumber kebenaran, bukan data yang kececer di banyak tempat.
      </P>
      <P>
        Anyway, balik ke topik utama - kenapa ini semua dibangun kesambung gitu, bukan
        modul-modul lepas?
      </P>

      <H2>Cara Kita Bikinnya: Spec Dulu, Baru Ngoding</H2>
      <P>
        Salah satu prinsip yang kita pegang di tim{" "}
        <a href="/" className="underline underline-offset-4 hover:text-foreground">
          Konsulin
        </a>{" "}
        waktu bangun Dashboard Kafe: <strong className="font-semibold text-foreground">nggak ada
        kode yang ditulis sebelum ada spesifikasi yang jelas.</strong> Tiap fitur baru - sekecil
        apapun - ditulis dulu requirement-nya, kriteria "selesai"-nya, sampai kasus-kasus tepi
        yang mungkin bikin sistem error. Baru setelah itu diimplementasi dan diverifikasi ketat.
      </P>
      <P>
        Hasilnya: sistem yang tumbuh cepat (belasan modul dibangun bertahap) tanpa jadi rapuh -
        tiap fitur baru ketambahan, fitur lama tetep jalan normal karena semua perubahan diuji
        balik sebelum dianggap kelar. Lu bisa lihat contoh project lain yang kita kerjain di{" "}
        <a href="/#top" className="underline underline-offset-4 hover:text-foreground">
          halaman demo produk Konsulin
        </a>
        .
      </P>

      <H2>Kenapa Ini Penting Buat Bisnis F&amp;B</H2>
      <P>
        Intinya, Dashboard Kafe ngebuktiin satu hal:{" "}
        <strong className="font-semibold text-foreground">
          sistem manajemen kafe yang proper itu nggak harus mahal dan nggak harus generic.
        </strong>{" "}
        Bisnis kafe kecil-menengah bisa punya tools setara yang dipake resto-resto besar - laporan
        keuangan yang bisa dipercaya, kontrol stok yang rapi, sampai insight budget bulanan - asal
        dibangun sesuai kebutuhan aslinya, bukan dipaksa muat ke template generic.
      </P>
      <P>
        Ini juga cerminan gimana Konsulin kerja: kita nggak jual "software jadi", kita bangun
        sistem yang beneran ngerti proses bisnis klien dari dalam.
      </P>
    </>
  );
}

function UgorexTrackerContent() {
  return (
    <>
      <P>
        Bayangin lu punya bisnis yang produknya dijual lewat ratusan konter kecil tersebar di
        banyak kecamatan - bukan lewat toko sendiri, tapi nitip ke konter HP, minimarket, atau
        reseller. Tim sales lu keliling tiap hari buat ngecek konter mana yang udah "panas" (mau
        ambil banyak stok) dan mana yang masih "dingin" (belum yakin). Pertanyaannya: gimana
        caranya lu, sebagai owner, tau progress ratusan konter itu tanpa harus nelepon satu-satu
        tiap sore?
      </P>

      <H2>Kenapa Bisnis Distribusi Butuh Sistem Tracking Sales Lapangan?</H2>
      <P>
        Menurut{" "}
        <a
          href="https://apjii.or.id/berita/d/apjii-jumlah-pengguna-internet-indonesia-tembus-221-juta-orang"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:text-foreground"
        >
          survei APJII
        </a>
        , pengguna internet Indonesia tahun 2024 udah tembus{" "}
        <strong className="font-semibold text-foreground">221,5 juta orang</strong> (penetrasi
        79,5%) - dan smartphone jadi barang yang nyaris wajib dipunya. Konsekuensinya, pasar
        aksesoris kayak tempered glass/antigores otomatis raksasa. Tapi justru di situ
        masalahnya: produk sekecil itu biasanya didistribusikan lewat ribuan konter kecil yang
        tersebar, bukan lewat channel besar yang gampang dipantau dari satu dashboard.
      </P>

      <H3>Masalah Klasik Tim Sales Lapangan</H3>
      <P>
        Tanpa sistem yang jelas, biasanya kejadiannya begini: progress tiap konter cuma ada di
        kepala sales masing-masing (atau di notes HP pribadi), owner nggak tau konter mana yang
        perlu di-follow-up lagi, dan pas mau ngitung komisi/bonus sales di akhir bulan, semua
        orang sibuk buka-buka chat WhatsApp buat rekap manual. Dari masalah persis kayak gini,{" "}
        <strong className="font-semibold text-foreground">Konsulin</strong> bangun{" "}
        <strong className="font-semibold text-foreground">Ugorex Tracker</strong> - sistem
        tracking sales lapangan yang dibikin custom, bukan CRM generic yang dipaksa muat ke alur
        bisnis distribusi konter.
      </P>

      <PostImage
        src={ugorexImg}
        alt="Kolase foto stok barang di gudang, dashboard Sales Distribution Ugorex Tracker, dan rak konter"
        caption="Stok gudang, dashboard Sales Distribution, dan rak konter Ugorex - satu alur data dari lapangan sampai laporan."
      />

      <H2>Bukan Cuma Absensi Sales: Kenalan Sama Ugorex Tracker</H2>
      <P>
        Banyak yang ngira "sistem tracking sales" itu ya cuma absen check-in GPS doang. Ugorex
        Tracker jauh lebih dari itu - dia nge-track{" "}
        <strong className="font-semibold text-foreground">progress bisnis di tiap konter</strong>,
        bukan cuma lokasi orangnya.
      </P>

      <H3>Tiga Peran, Satu Data</H3>
      <Ul>
        <Li>
          <strong className="font-semibold text-foreground">Admin</strong> - kelola semua barang,
          konter, dan akun sales; lihat semua laporan dari pusat.
        </Li>
        <Li>
          <strong className="font-semibold text-foreground">Sales</strong> - keliling ke konter,
          input update funnel tiap kunjungan, bahkan bisa bikinin akun buat owner toko begitu
          mereka setuju jadi mitra.
        </Li>
        <Li>
          <strong className="font-semibold text-foreground">Owner Toko</strong> - dapat akun
          sendiri (dibuatkan sales), bisa mantau data tokonya sendiri secara read-only - jadi
          nggak perlu nanya-nanya ke sales buat tau progress konternya.
        </Li>
      </Ul>

      <H3>Funnel AIDA + Loyalty: Bukan Sekadar "Sudah Kunjungan atau Belum"</H3>
      <P>
        Ini bagian yang paling custom - tiap konter ditandai posisinya di funnel{" "}
        <strong className="font-semibold text-foreground">
          Awareness → Interest → Desire → Action → Loyalty
        </strong>
        . Jadi bukan cuma "udah dikunjungin belum", tapi "konter ini udah sejauh mana niatnya
        buat jadi mitra tetap". Tiap kunjungan dicatat sebagai <code className="text-foreground">StageLog</code> -
        tahap, hasil (Ditolak/Netral/Positif), catatan, sampai jumlah barang - jadi ada jejak
        historis, bukan cuma status terkini.
      </P>

      <H2>Fitur-Fitur Utama Ugorex Tracker</H2>
      <P>
        <strong className="font-semibold text-foreground">Tracking &amp; Peta:</strong>
      </P>
      <Ul>
        <Li>
          <strong className="font-semibold text-foreground">Funnel &amp; Prospek</strong> - pantau
          tahap tiap konter, riwayat kunjungan lengkap dengan hasilnya.
        </Li>
        <Li>
          <strong className="font-semibold text-foreground">Peta Konter</strong> - lokasi konter
          ditampilin di peta, biar sales bisa atur rute kunjungan yang efisien (nggak bolak-balik
          ke wilayah yang sama).
        </Li>
      </Ul>
      <P>
        Nah, ngomong-ngomong soal rute, ini yang biasanya bikin waktu sales kebuang - tanpa peta
        terpusat, dua sales bisa aja nggak sadar ngunjungin konter yang sama minggu itu juga.
      </P>

      <P>
        <strong className="font-semibold text-foreground">Transaksi &amp; Gudang:</strong>
      </P>
      <Ul>
        <Li>
          <strong className="font-semibold text-foreground">POS &amp; Order</strong> - transaksi,
          cetak resi, sampai integrasi pembayaran online lewat{" "}
          <strong className="font-semibold text-foreground">Midtrans</strong>; ada juga alur
          refund/retur kalau barang dikembaliin.
        </Li>
        <Li>
          <strong className="font-semibold text-foreground">Gudang &amp; Stok</strong> - kelola
          inventori pusat, penyesuaian stok kalau ada selisih.
        </Li>
      </Ul>

      <P>
        <strong className="font-semibold text-foreground">Keuangan &amp; Tim:</strong>
      </P>
      <Ul>
        <Li>
          <strong className="font-semibold text-foreground">Keuangan</strong> - laporan keuangan
          (mirip Laba Rugi) yang ke-generate dari transaksi beneran, bukan direkap manual.
        </Li>
        <Li>
          <strong className="font-semibold text-foreground">Payroll, Komisi &amp; Bonus</strong> -
          gaji, komisi penjualan, bonus target bulanan, sampai sesi lembur - semua dihitung dari
          data transaksi yang sama.
        </Li>
        <Li>
          <strong className="font-semibold text-foreground">KPI &amp; Skor Sales</strong> - tiap
          sales dapet skor evaluasi per 3 bulan, jadi owner bisa lihat siapa yang performanya
          konsisten bagus.
        </Li>
      </Ul>

      <P>
        <strong className="font-semibold text-foreground">Komunikasi:</strong>
      </P>
      <Ul>
        <Li>
          <strong className="font-semibold text-foreground">Notifikasi WhatsApp &amp; Push</strong> -
          update penting (pembayaran, tugas baru) langsung kekirim, bukan owner yang harus buka
          aplikasi terus-terusan buat ngecek.
        </Li>
        <Li>
          <strong className="font-semibold text-foreground">Tiket, Request &amp; Tugas</strong> -
          semacam sistem support internal buat koordinasi antar tim.
        </Li>
      </Ul>

      <P>
        Anyway, balik ke poin utamanya - semua modul ini bukan berdiri sendiri-sendiri. Satu
        kunjungan sales ke satu konter bisa mempengaruhi posisi funnel, jadi dasar komisi,
        sekaligus kecatat di riwayat buat evaluasi KPI-nya.
      </P>

      <H2>Kenapa Dibangun Custom, Bukan CRM/Sales-Tracking Siap Pakai?</H2>
      <P>
        Poin yang bikin Ugorex Tracker beda dari aplikasi sales-tracking generic yang banyak
        beredar:{" "}
        <strong className="font-semibold text-foreground">
          funnel AIDA + Loyalty-nya didesain khusus buat model bisnis "titip barang ke konter"
        </strong>
        , bukan hasil ngoprek fitur CRM off-the-shelf yang sebenernya dibikin buat B2B sales
        kantoran. Prinsip yang kita pegang di{" "}
        <a href="/" className="underline underline-offset-4 hover:text-foreground">
          Konsulin
        </a>
        : bangun sistem yang ngerti alur bisnis klien dari dalam, bukan nyodorin template yang
        klien harus nyesuaiin diri ke situ.
      </P>
      <P>
        Lu bisa lihat pendekatan yang sama di project custom lain yang kita kerjain di{" "}
        <a href="/#top" className="underline underline-offset-4 hover:text-foreground">
          halaman demo produk Konsulin
        </a>{" "}
        - termasuk{" "}
        <a href="/blog/dashboard-kafe" className="underline underline-offset-4 hover:text-foreground">
          Dashboard Kafe
        </a>
        , sistem manajemen kafe yang juga kita bangun dengan filosofi serupa.
      </P>
    </>
  );
}

export const blogPosts: BlogPost[] = [
  {
    slug: "dashboard-kafe",
    title: "Dashboard Kafe: Contoh Nyata Sistem Manajemen Kafe yang Bikin Owner Nggak Pusing Lagi",
    metaTitle: "Sistem Manajemen Kafe: Studi Kasus Dashboard Kafe by Konsulin",
    description:
      "Kenalan sama Dashboard Kafe, sistem manajemen kafe custom bikinan Konsulin - dari kasir, stok, sampai laporan keuangan resmi, semua nyambung jadi satu.",
    dateIso: "2026-09-02",
    dateLabel: "2 September 2026",
    image: dashboardKafeImg,
    imageAlt: "Tampilan dashboard Kafe Konsulin dengan modul Menu, Stok Bahan, Keuangan, dan lainnya",
    excerpt:
      "Coba bayangin lu punya kafe - kejar setoran nyatet manual, stok pake feeling, gajian berantakan di Excel. Kenalan sama Dashboard Kafe, sistem manajemen kafe custom yang nyambungin semuanya jadi satu.",
    closingText:
      "Punya bisnis yang masih ngandelin buku tulis dan Excel buat operasional harian? Konsulin bisa bantu bikinin sistem custom yang sesuai alur kerja lu - bukan lu yang harus nyesuaiin diri ke software orang lain.",
    faq: [
      {
        question: "Apa itu sistem manajemen kafe?",
        answer:
          "Sistem manajemen kafe adalah software yang menggabungkan operasional kafe sehari-hari - kasir, stok bahan, keuangan, gaji karyawan, sampai data pelanggan - dalam satu platform yang saling terhubung, bukan aplikasi-aplikasi terpisah yang datanya harus disatuin manual.",
      },
      {
        question: "Bedanya sama aplikasi kasir (POS) biasa apa?",
        answer:
          "Aplikasi kasir/POS cuma nanganin transaksi penjualan. Sistem manajemen kafe cakupannya lebih luas: dari situ, data transaksi otomatis ngalir ke laporan keuangan (Laba Rugi/Neraca/Arus Kas), pengelolaan stok, payroll, sampai program loyalitas pelanggan - semua dari satu sumber data yang sama.",
      },
      {
        question: "Berapa biaya bikin sistem manajemen kafe custom?",
        answer:
          "Tergantung cakupan fitur yang dibutuhin - kafe kecil dengan kebutuhan dasar (kasir + stok + laporan) beda scope-nya sama yang butuh payroll, multi-cabang, atau integrasi lain. Konsulin biasanya mulai dari konsultasi kebutuhan dulu sebelum kasih estimasi.",
      },
      {
        question: "Kenapa pilih sistem custom, bukan software siap pakai (SaaS)?",
        answer:
          "Software siap pakai (SaaS) biasanya generic - cocok buat banyak bisnis sekaligus, jadi ada fitur yang nggak kepake dan ada kebutuhan spesifik yang nggak ke-cover. Sistem custom dibangun sesuai alur kerja kafe itu sendiri, jadi nggak ada proses yang harus \"dipaksa muat\". Trade-off-nya, waktu pengembangan awal biasanya lebih lama dibanding tinggal daftar akun SaaS.",
      },
      {
        question: "Apakah datanya bisa dipakai buat kebutuhan pajak/akuntan?",
        answer:
          "Bisa. Modul Keuangan di Dashboard Kafe ngerender laporan dalam format standar (Laba Rugi, Neraca, Arus Kas) dan ada fitur ekspor data yang memang didesain buat kebutuhan akuntan dan pelaporan pajak.",
      },
    ],
    Content: DashboardKafeContent,
  },
  {
    slug: "ugorex-tracker",
    title: "Ugorex Tracker: Studi Kasus Sistem Tracking Sales Lapangan buat Bisnis Distribusi",
    metaTitle: "Sistem Tracking Sales Lapangan: Studi Kasus Ugorex Tracker by Konsulin",
    description:
      "Kenalan sama Ugorex Tracker, sistem tracking sales lapangan & distribusi custom bikinan Konsulin - dari funnel konter, POS, gudang, sampai payroll sales, semua satu platform.",
    dateIso: "2026-09-02",
    dateLabel: "2 September 2026",
    image: ugorexImg,
    imageAlt: "Kolase foto stok barang di gudang, dashboard Sales Distribution Ugorex Tracker, dan rak konter",
    excerpt:
      "Jualan lewat ratusan konter tersebar susah dipantau? Kenalan sama Ugorex Tracker, sistem tracking sales lapangan dengan funnel AIDA + Loyalty yang nyambungin kunjungan sales sampai komisi dan KPI.",
    closingText:
      "Bisnis lu juga jualan lewat jaringan konter/reseller yang tersebar dan susah dipantau? Konsulin bisa bantu bikinin sistem tracking yang sesuai model distribusi lu sendiri - bukan CRM generic yang setengah cocok.",
    faq: [
      {
        question: "Apa itu sistem tracking sales lapangan?",
        answer:
          "Sistem tracking sales lapangan adalah software yang mencatat aktivitas tim sales yang keliling ke banyak lokasi (toko/konter/outlet) - termasuk progress tiap lokasi, hasil kunjungan, sampai transaksi yang terjadi - supaya owner bisa mantau semuanya dari satu dashboard tanpa harus menghubungi tiap sales satu-satu.",
      },
      {
        question: "Bedanya sama aplikasi absensi/GPS tracking karyawan biasa apa?",
        answer:
          "Aplikasi absensi cuma mencatat lokasi dan waktu check-in. Sistem tracking sales lapangan seperti Ugorex Tracker mencatat progress bisnis di tiap lokasi (mis. tahap funnel konter), hasil tiap kunjungan, transaksi, sampai menghubungkannya ke perhitungan komisi dan evaluasi kinerja sales.",
      },
      {
        question: "Cocok buat bisnis apa aja?",
        answer:
          "Paling cocok buat bisnis yang mendistribusikan produk lewat banyak titik penjualan pihak ketiga (konter, reseller, outlet mitra) dan punya tim sales yang keliling secara rutin - bukan cuma bisnis aksesoris smartphone, tapi model distribusi serupa di industri lain juga bisa pakai pendekatan yang sama.",
      },
      {
        question: "Apakah bisa terintegrasi dengan pembayaran online?",
        answer:
          "Bisa. Ugorex Tracker sudah terintegrasi dengan Midtrans untuk pembayaran online, termasuk pencatatan status pembayaran otomatis ke data order.",
      },
      {
        question: "Data funnel/kunjungan sales bisa dipakai buat hitung komisi otomatis?",
        answer:
          "Bisa. Hasil kunjungan dan transaksi yang tercatat jadi dasar perhitungan komisi, bonus target, dan skor KPI sales - semuanya dihitung dari data yang sama, bukan direkap manual terpisah.",
      },
    ],
    Content: UgorexTrackerContent,
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
