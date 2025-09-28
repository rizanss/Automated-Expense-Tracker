# 💸 FinanceTracker - AI-Powered Expense Scanner

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwindcss)
![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-green?logo=google)

*Tonton Demo Aplikasi di Bawah Ini!*

![Demo Aplikasi](./assets/automated_expense_tracker_demo.mkv)

## ✨ Project Overview

FinanceTracker adalah aplikasi web modern yang dirancang untuk menyederhanakan manajemen keuangan pribadi. Mengatasi masalah utama pencatatan manual yang membosankan dan rawan kesalahan, aplikasi ini mengimplementasikan fitur pemindai struk/invoice berbasis AI, memungkinkan pengguna untuk mendigitalkan pengeluaran mereka hanya dengan satu foto.

Proyek ini mendemonstrasikan integrasi antara *frontend* modern dengan *multimodal AI* canggih untuk menciptakan solusi praktis bagi masalah sehari-hari.

---

## 🚀 Key Features

* **AI-Powered Receipt Scanner**: Unggah foto struk, dan biarkan **Google Gemini Pro Vision** mengekstrak detail transaksi secara otomatis (nama toko, tanggal, total, item, dll).
* **Interactive Dashboard**: Visualisasikan kesehatan finansial dalam sekejap dengan ringkasan total saldo, pemasukan, dan pengeluaran.
* **Full CRUD Transaction Management**: Tambah, lihat, edit, dan hapus transaksi pemasukan/pengeluaran dengan mudah.
* **Advanced Filtering & Search**: Temukan transaksi spesifik dengan filter berdasarkan tipe, kategori, rentang waktu, atau kata kunci.
* **Secure Local Storage**: Semua data finansial Anda disimpan dengan aman di `localStorage` browser Anda, memastikan privasi penuh tanpa memerlukan server atau akun.

---

## 🏛️ Tech Stack & Architecture

Aplikasi ini menggunakan alur kerja yang modern untuk ekstraksi data dari gambar:

**User Uploads Receipt ➔ 1. Send Image + Prompt to LLM ➔ 2. Google Gemini Pro Vision ➔ 3. Parse JSON Response ➔ 4. Display to User ➔ 5. Save to `localStorage`**

* **Frontend Framework**: **React** (with **TypeScript** for type safety)
* **Build Tool**: **Vite** (untuk development yang super cepat)
* **Styling**: **Tailwind CSS**
* **AI Model**: **Google Generative AI (Gemini Pro Vision)**
* **Icons**: Lucide React
* **Linting & Formatting**: ESLint, Prettier

---

## ⚙️ How to Run Locally

Pastikan Anda sudah meng-install Node.js (v18.0.0 atau lebih tinggi).

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/rizanss/Automated-Expense-Tracker.git](https://github.com/rizanss/Automated-Expense-Tracker.git)
    cd Automated-Expense-Tracker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application:**
    ```bash
    npm run dev
    ```
    Buka `http://localhost:5173` (atau port lain yang tersedia) di browser Anda.

4.  **Set up Google Gemini API Key:**
    * Kunjungi [Google AI Studio (Makersuite)](https://aistudio.google.com/app/apikey) untuk mendapatkan API Key gratis Anda.
    * Saat menggunakan aplikasi, klik tombol "Scan" pada formulir tambah transaksi.
    * Akan muncul dialog untuk memasukkan API Key Gemini Anda. Masukkan *key* tersebut untuk mengaktifkan fitur pemindaian.

---

## 📬 Contact
* **Author:** Riza Nursyah
* **GitHub:** [rizanss](https://github.com/rizanss)
* **LinkedIn:** [Riza Nursyah](https://www.linkedin.com/in/riza-nursyah-31a6a7221/)
