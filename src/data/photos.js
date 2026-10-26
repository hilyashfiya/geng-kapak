// ============================================================
// GENG KAPAK — Curated Photo & Documentation Archive
// ============================================================
// Koleksi foto kurasi perjalanan persahabatan berlima:
// - Braga Diaries
// - Kampus & Gerlong
// - Momen Spesial & Basecamp
// - Dokumentasi Lengkap (42 foto candid dari assets/photos/dokumentasi/)
// ============================================================

import { dokumentasiList } from './dokumentasi.js';

// Foto Kurasi Utama dengan Kisah Nyata & Tanggal Autentik
export const curatedPhotos = [
  // --- BRAGA DIARIES (11 April 2025) ---
  {
    id: "braga-1",
    src: "assets/photos/Braga Diaries - Berlima.jpeg",
    fallbackSrc: "assets/photos/braga-1.jpg",
    title: "Braga Diaries — Berlima",
    shortNote: "kumpul lengkap di braga",
    date: "11 April 2025",
    category: "braga",
    categoryLabel: "Braga Diaries",
    caption: "Akhirnya kumpul lengkap juga di luar kampus. Susah banget ternyata ngatur jadwal lima kepala.",
    aspect: "portrait",
    filmStamp: "'25 04 11"
  },
  {
    id: "braga-2",
    src: "assets/photos/Sudut Jalan Braga.jpeg",
    fallbackSrc: "assets/photos/braga-2.jpg",
    title: "Sudut Jalan Braga",
    shortNote: "sudut jalan braga",
    date: "11 April 2025",
    category: "braga",
    categoryLabel: "Braga Diaries",
    caption: "Jalan santai, foto sana-sini sampai kaki pegal tapi nggak ada yang mau udahan duluan.",
    aspect: "landscape",
    filmStamp: "'25 04 11"
  },
  {
    id: "braga-3",
    src: "assets/photos/Candid di Braga.jpeg",
    fallbackSrc: "assets/photos/braga-3.jpg",
    title: "Candid di Braga",
    shortNote: "candid jalan santai",
    date: "11 April 2025",
    category: "braga",
    categoryLabel: "Braga Diaries",
    caption: "Momen langka bisa jalan santai tanpa ada yang panik mikirin revisi tugas kuliah.",
    aspect: "portrait",
    filmStamp: "'25 04 11"
  },

  // --- KAMPUS & GERLONG ---
  {
    id: "kampus-1",
    src: "assets/photos/selasar-fpips.jpeg",
    fallbackSrc: "assets/photos/kampus-1.jpg",
    title: "Selasar FPIPS",
    shortNote: "nunggu kelas di selasar",
    date: "Hari Kuliah",
    category: "campus",
    categoryLabel: "Kampus & Gerlong",
    caption: "Nugas, nunggu kelas berikutnya, ngobrol ngalor-ngidul. Begitu terus sampai sore.",
    aspect: "portrait",
    filmStamp: "CAMPUS '23"
  },
  {
    id: "kampus-2",
    src: "assets/photos/garnadi-days.jpeg",
    fallbackSrc: "assets/photos/kampus-2.jpg",
    title: "Garnadi Days",
    shortNote: "bengong di garnadi",
    date: "Rutinitas Nugas",
    category: "campus",
    categoryLabel: "Kampus & Gerlong",
    caption: "Tempat andalan buat bengong atau pura-pura ngetik tugas pas otak udah buntu.",
    aspect: "portrait",
    filmStamp: "GARNADI '24"
  },
  {
    id: "gerlong-1",
    src: "assets/photos/Jalan Menuju Gerlong.jpeg",
    fallbackSrc: "assets/photos/gerlong-1.jpg",
    title: "Jalan Menuju Gerlong",
    shortNote: "otw gerlong kecapekan",
    date: "Jeda Kuliah",
    category: "campus",
    categoryLabel: "Kampus & Gerlong",
    caption: "Udah capek-capek jalan mendaki bukit, ujung-ujungnya tetep bingung mau jajan apa. Klasik.",
    aspect: "portrait",
    filmStamp: "GERLONG"
  },
  {
    id: "pmb-1",
    src: "assets/photos/pmb.jpeg",
    fallbackSrc: "assets/photos/pmb-1.jpg",
    title: "Awal Mula PMB",
    shortNote: "awal dari segalanya ('23)",
    date: "Agustus 2023",
    category: "campus",
    categoryLabel: "Kampus & Gerlong",
    caption: "Dari sinilah semuanya dimulai. Belum saling kenal akrab, masih pada canggung.",
    aspect: "landscape",
    filmStamp: "'23 08 28"
  },
  {
    id: "random-1",
    src: "assets/photos/spin-dulu.jpeg",
    fallbackSrc: "assets/photos/random-1.jpg",
    title: "Debat Makanan (Spin Dulu)",
    shortNote: "spin dulu (tetep mencar wkwk)",
    date: "Rutinitas Kuliah",
    category: "campus",
    categoryLabel: "Kampus & Gerlong",
    caption: "Udah muter spin roda makanan, udah pasrah nerima hasil... lima menit kemudian tetep beli sendiri-sendiri.",
    aspect: "portrait",
    filmStamp: "SPIN TIME"
  },

  // --- MOMEN SPESIAL & BASECAMP ---
  {
    id: "bioskop-1",
    src: "assets/photos/bioskop.jpeg",
    fallbackSrc: "assets/photos/bioskop-1.jpg",
    title: "Movie Night & Nginep",
    shortNote: "movie night & kos nass",
    date: "19 Desember 2023",
    category: "moments",
    categoryLabel: "Momen Spesial",
    caption: "Nonton bioskop bareng, lalu lanjut nge-basecamp di kos Nass. Salah satu malam paling hangat.",
    aspect: "portrait",
    filmStamp: "'23 12 19"
  },

  {
    id: "p2m-1",
    src: "assets/photos/p2m-bersama.jpeg",
    fallbackSrc: "assets/photos/p2m-1.jpg",
    title: "P2M Bersama",
    shortNote: "rehat proker bareng",
    date: "15 Januari 2025",
    category: "moments",
    categoryLabel: "Momen Spesial",
    caption: "Beda divisi dan sibuk sendiri-sendiri, tapi tetap nyempetin punya waktu bareng di sela proker.",
    aspect: "portrait",
    filmStamp: "'25 01 15"
  },
  {
    id: "p2m-2",
    src: "assets/photos/p2m-2.jpeg",
    fallbackSrc: "assets/photos/p2m-2.jpg",
    title: "Di Balik Layar P2M",
    shortNote: "ketawa receh di lorong",
    date: "15 Januari 2025",
    category: "moments",
    categoryLabel: "Momen Spesial",
    caption: "Capek proker langsung berkurang tiap ketemu di lorong dan ngetawain hal receh bareng.",
    aspect: "portrait",
    filmStamp: "'25 01 15"
  },
  {
    id: "surprise-1",
    src: "assets/photos/surprise-1.jpeg",
    fallbackSrc: "assets/photos/surprise-1.jpg",
    title: "Birthday Planning Group",
    shortNote: "grup rahasia ultah",
    date: "Tradisi Rahasia",
    category: "moments",
    categoryLabel: "Momen Spesial",
    caption: "Grup WA rahasia tanpa yang lagi ulang tahun. Selalu ribet nentuin kue, kado, dan jam surprise.",
    aspect: "portrait",
    filmStamp: "BDAY RUSH"
  },
  {
    id: "surprise-2",
    src: "assets/photos/surprise-2.jpeg",
    fallbackSrc: "assets/photos/surprise-2.jpg",
    title: "Surprise!",
    shortNote: "muka kaget tapi seneng",
    date: "Tradisi Ulang Tahun",
    category: "moments",
    categoryLabel: "Momen Spesial",
    caption: "Walau rencananya sering agak berantakan, ekspresi kaget dan senengnya selalu sepadan.",
    aspect: "portrait",
    filmStamp: "CELEBRATE"
  },
  {
    id: "rumah-uwa",
    src: "assets/photos/rumah-uwa.jpeg",
    fallbackSrc: "assets/photos/chaos-3.jpg",
    title: "Nugas di Rumah Uwa",
    shortNote: "niat nugas realita ghibah",
    date: "Nugas Wacana",
    category: "moments",
    categoryLabel: "Momen Spesial",
    caption: "Niatnya nugas, realitanya rebahan dan ngeghibah sampai lupa tujuan awal kumpul.",
    aspect: "landscape",
    filmStamp: "RUMAH UWA"
  },
  {
    id: "random-2",
    src: "assets/photos/komuk.jpeg",
    fallbackSrc: "assets/photos/random-2.jpg",
    title: "Galeri Hilya (Unfiltered)",
    shortNote: "galeri aib & komuk",
    date: "Arsip HP Hilya",
    category: "moments",
    categoryLabel: "Momen Spesial",
    caption: "Banyak foto yang nggak pernah lolos seleksi buat medsos, tapi justru paling bikin kangen.",
    aspect: "portrait",
    filmStamp: "UNFILTERED"
  }
];

// Konversi 42 Foto Dokumentasi WhatsApp ke Format Foto Ringkas & Spontan
const dokPhotosFormatted = (dokumentasiList || []).map((item, idx) => ({
  id: `dok-${idx + 1}`,
  src: `assets/photos/dokumentasi/${encodeURIComponent(item.filename)}`,
  title: item.caption || `Kenangan #${idx + 1}`,
  shortNote: item.caption || '',
  date: "Arsip Bersama",
  category: "candid",
  categoryLabel: "Koleksi Candid",
  aspect: item.orientation || (item.width >= item.height ? "landscape" : "portrait"),
  filmStamp: `CANDID #${String(idx + 1).padStart(2, '0')}`
}));

// Gabungan Seluruh Foto untuk Galeri & Lightbox
export const photos = [
  ...curatedPhotos,
  ...dokPhotosFormatted
];

// Profil kelima anggota geng kapak
export const memberProfiles = {
  hilya: {
    id: "hilya",
    name: "Hilya",
    initial: "H",
    fullName: "Hilyatul Ashfiya",
    role: "Kurator & pembuat arsip ini",
    tagline: "yang menyimpan semua cerita",
    photo: "assets/photos/member-aku.jpeg",
    placeholder: "#B8858A",
    desc: "yang diam-diam selalu bersyukur punya empat sahabat setulus ini, dan ingin merangkum cerita kebersamaan kita di tengah hari-hari yang makin sibuk."
  },
  uswa: {
    id: "uswa",
    name: "Uwa",
    initial: "Uw",
    fullName: "Uswatun Hasanah",
    role: "Teman pertama di kampus",
    tagline: "pembawa tenang sejak awal kuliah",
    photo: "assets/photos/member-uwa.jpeg",
    placeholder: "#C2A878",
    desc: "sosok yang paling dewasa dan mandiri di antara kita berlima, yang ketenangannya selalu berhasil bikin suasana panik jadi lebih terkendali."
  },
  salwa: {
    id: "salwa",
    name: "Umi",
    initial: "Um",
    fullName: "Salwa Izdihar Jinan",
    role: "Partner bertumbuh & rekan magang",
    tagline: "rekan satu tim & teman se-frekuensi",
    photo: "assets/photos/member-umi.jpeg",
    placeholder: "#8A9E7E",
    desc: "sosok yang selalu ceria dan penuh energi, teman yang sekarang lagi berjuang bareng menghadapi dunia magang dan semester akhir."
  },
  tyan: {
    id: "tyan",
    name: "Tyan",
    initial: "T",
    fullName: "Destyani Dwi Nur Haliza",
    role: "Sahabat yang selalu siap sedia",
    tagline: "ketulusan tanpa banyak bicara",
    photo: "assets/photos/member-tyan.jpeg",
    placeholder: "#A86749",
    desc: "sosok yang perhatiannya selalu nyata lewat tindakan, yang nggak pernah hitung-hitungan kalau temannya lagi butuh bantuan di kampus."
  },
  nazwa: {
    id: "nazwa",
    name: "Nass",
    initial: "N",
    fullName: "RD Nazwa Ghaitsa Yosefa",
    role: "Pemilik basecamp & teman ngobrol",
    tagline: "sesama anak Garut yang se-frekuensi",
    photo: "assets/photos/member-nass.jpeg",
    placeholder: "#D4B483",
    desc: "teman sesama perantau dari Garut yang paling santai, tempat kita selalu berkumpul pas butuh jeda dari padatnya rutinitas kuliah."
  }
};
