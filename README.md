# Customer Management System

Aplikasi web berbasis browser untuk mengelola data pelanggan secara rapi dan efisien. Dibangun menggunakan teknologi web dasar tanpa framework tambahan, sehingga ringan dan dapat langsung dibuka di browser tanpa instalasi apapun.

---

## 📋 Deskripsi

**Customer Management System** adalah sistem manajemen pelanggan yang dirancang untuk memudahkan admin dalam mencatat, melihat, mengubah, dan menghapus informasi pelanggan. Semua data tersimpan secara permanen di browser menggunakan LocalStorage, sehingga data tetap ada meskipun halaman di-refresh.

---

## 🚀 Cara Menjalankan

1. Buka folder `customer-management/`
2. Klik dua kali pada file `index.html`
3. Aplikasi akan terbuka langsung di browser
4. Tidak memerlukan server, instalasi, atau koneksi internet

---

## 📁 Struktur File

```
customer-management/
├── index.html    → Struktur halaman dan komponen UI
├── style.css     → Desain tampilan (layout, warna, responsif)
├── script.js     → Logika aplikasi (CRUD, validasi, LocalStorage)
└── README.md     → Dokumentasi proyek ini
```

---

## ✨ Fitur Utama

### Dashboard
- Menampilkan jumlah **total seluruh pelanggan**
- Menampilkan jumlah **pelanggan baru yang ditambahkan hari ini**
- Tabel ringkasan 5 pelanggan terbaru
- Tombol shortcut untuk menambah pelanggan baru

### Data Pelanggan
- Menampilkan seluruh data pelanggan dalam bentuk tabel
- Kolom yang ditampilkan: **ID, Nama, Nomor Telepon, Email, Alamat**
- Tombol **Edit** dan **Hapus** pada setiap baris data

### Tambah Pelanggan
- Form input: Nama Lengkap, Nomor Telepon, Email, Alamat
- ID pelanggan di-generate otomatis dengan format `CST-XXXX`
- Validasi seluruh field wajib diisi

### Edit Pelanggan
- Mengubah informasi pelanggan yang sudah tersimpan
- Form terisi otomatis dengan data pelanggan yang dipilih
- Data diperbarui langsung di LocalStorage

### Hapus Pelanggan
- Modal konfirmasi muncul sebelum data dihapus
- Menampilkan nama pelanggan yang akan dihapus pada pesan konfirmasi

### Pencarian
- Pencarian real-time berdasarkan **nama pelanggan**
- Menampilkan pesan "Tidak ada pelanggan ditemukan" jika hasil kosong
- Tombol clear (×) untuk mereset pencarian

### Notifikasi
- Notifikasi muncul di sudut kanan atas setelah setiap aksi:
  - ✅ Hijau — berhasil tambah atau edit
  - ℹ️ Biru — berhasil hapus
  - ❌ Merah — terjadi kesalahan validasi

---

## 🛠️ Teknologi

| Teknologi | Keterangan |
|-----------|------------|
| HTML5 | Struktur dan semantik halaman |
| CSS3 | Desain tampilan, layout, dan responsif |
| JavaScript Vanilla | Logika aplikasi, DOM manipulation, event handling |
| LocalStorage | Penyimpanan data persisten di browser |

---

## 🎨 Desain UI/UX

- **Tema warna:** Biru (`#2563eb`) dan Putih
- **Sidebar:** Navigasi vertikal dengan warna biru gelap (`#1e3a8a`)
- **Dashboard:** Kartu statistik dengan ikon dan angka besar
- **Tabel:** Bersih dengan hover highlight dan badge ID berwarna
- **Modal:** Animasi slide-in untuk form tambah, edit, dan konfirmasi hapus
- **Responsif:** Mendukung tampilan desktop dan mobile (hamburger menu + overlay)
- **Font:** System font (`-apple-system`, `Segoe UI`, `sans-serif`)

---

## ✅ Validasi Input

| Field | Aturan |
|-------|--------|
| Nama Lengkap | Wajib diisi, tidak boleh kosong |
| Nomor Telepon | Wajib diisi, hanya angka/karakter `+`, `-`, spasi, panjang 7–20 karakter |
| Email | Wajib diisi, harus berformat `xxx@xxx.xxx` |
| Alamat | Wajib diisi, tidak boleh kosong |

Setiap field yang tidak valid akan ditandai dengan **border merah** dan **pesan error** di bawahnya.

---

## 💾 Penyimpanan Data

- Data disimpan di **LocalStorage** browser dengan key `cms_customers`
- Data bertahan setelah halaman di-refresh atau browser ditutup
- Data akan terhapus jika cache/localStorage browser dibersihkan

---

## 👥 Data Dummy

Aplikasi dilengkapi dengan **5 data pelanggan dummy** yang otomatis dimuat saat pertama kali dibuka:

| ID | Nama | Kota |
|----|------|------|
| CST-0001 | Andi Pratama | Jakarta Pusat |
| CST-0002 | Siti Rahayu | Bandung |
| CST-0003 | Budi Santoso | Surabaya |
| CST-0004 | Dewi Anggraeni | Semarang |
| CST-0005 | Rizky Firmansyah | Yogyakarta |

---

## ⌨️ Shortcut Keyboard

| Tombol | Fungsi |
|--------|--------|
| `Escape` | Menutup modal yang sedang terbuka |

---

## 🌐 Kompatibilitas Browser

Aplikasi ini kompatibel dengan semua browser modern:

- Google Chrome (direkomendasikan)
- Mozilla Firefox
- Microsoft Edge
- Safari

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan belajar dan demonstrasi. Bebas digunakan dan dimodifikasi sesuai kebutuhan.

---

*Customer Management System &copy; 2026*
