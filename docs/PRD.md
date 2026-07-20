# Product Requirement Document (PRD) - Banksampah

## 1. Document Overview
- **Project Name**: Banksampah (Sistem Informasi Manajemen Bank Sampah)
- **Version**: 2.0.0
- **Target Stack**: **PHP 8.5**, **Laravel 13**, **React Starter Kit (Inertia.js v3 + React 19)**
- **Target Platform**: Modern Responsive Single Page Application (SPA) & Admin Dashboard

---

## 2. Executive Summary & Goals
**Banksampah** adalah platform pengelolaan limbah bank sampah berbasis website dengan arsitektur modern berkinerja tinggi menggunakan **PHP 8.5**, **Laravel 13**, dan **React Starter Kit** (Inertia.js v3 + React 19 + Tailwind CSS v4).

Tujuan Utama:
1. **Developer Experience & Modern Stack**: Menggunakan fitur PHP 8.5 dan kapabilitas Laravel 13.
2. **Seamless User Experience (SPA)**: Menggunakan React Starter Kit dengan Inertia.js untuk navigasi cepat tanpa reload halaman.
3. **Desain Aesthetic & Responsive**: Tampilan modern, sleek dark/light mode, micro-animations, dan komponen UI React reusable.
4. **Keamanan & Scalability**: Menggunakan React Admin Dashboard modern dan Laravel Fortify untuk sistem autentikasi yang aman.

---

## 3. Technology Stack Architecture

| Layer | Technology Specification |
| :--- | :--- |
| **Language Runtime** | **PHP 8.5** |
| **Backend Framework** | **Laravel 13.x** |
| **Frontend Framework** | **React 19** (via Laravel React Starter Kit / Inertia.js v3) |
| **Styling & Design** | **Tailwind CSS v4** + Lucide React Icons |
| **Adapter / Glue Layer** | **Inertia.js v3** (Bridges Laravel controller directly to React components) |
| **Database** | **MariaDB 10.11 / PostgreSQL 16 / MySQL 8.0** |
| **Authentication** | **Laravel Fortify** (Session-based Stateful Authentication) |
| **Build Tool** | **Vite 6+** (Lightning fast HMR bundling) |

---

## 4. User Roles & Access Control Matrix

### 4.1 Roles Definition
1. **Guest (Pengunjung Umum)**: Pengguna anonim yang dapat mengeksplorasi landing page, fitur kalkulator sampah, dan pendaftaran.
2. **Nasabah (Member / User)**: Warga terdaftar yang memiliki dashboard React SPA untuk memantau tabungan sampah, transaksi, dan melakukan klaim reward poin.
3. **Admin (Petugas Bank Sampah)**: Petugas operasional dengan portal React Admin khusus untuk pencatatan transaksi penimbangan dan validasi klaim poin.
4. **Super Admin**: Pengelola utama sistem dengan kendali penuh atas user management, role privileges, dan statistik analitik.

### 4.2 Matrix Fitur Berdasarkan Role (React SPA)
| Fitur / Modul | Guest | Nasabah | Admin | Super Admin |
| :--- | :---: | :---: | :---: | :---: |
| Landing Page Interactive & Swiper | ✅ | ✅ | ✅ | ✅ |
| Register & Auth (React Hook Form + Zod) | ✅ | ❌ | ❌ | ❌ |
| Login Portal Nasabah (SPA) | ✅ | ✅ | ❌ | ❌ |
| Login Portal Admin (SPA) | ❌ | ❌ | ✅ | ✅ |
| Dashboard Interactive Nasabah (Balance Cards & Charts) | ❌ | ✅ | ❌ | ❌ |
| Katalog Sampah & Interactive Price Calculator | ✅ | ✅ | ✅ | ✅ |
| Katalog Reward & Instant Claim Modal | ❌ | ✅ | ❌ | ❌ |
| History Transaksi (Real-time Filtering & Datatable) | ❌ | ✅ | ❌ | ❌ |
| React Admin Panel (Manage Waste, Rewards & Members) | ❌ | ❌ | ✅ | ✅ |
| Penyetoran Sampah (Quick POS / Transaction Form) | ❌ | ❌ | ✅ | ✅ |
| Verifikasi Status Penukaran Poin (*Pending/Process/Done*) | ❌ | ❌ | ✅ | ✅ |
| Role Management & System Audit Log | ❌ | ❌ | ❌ | ✅ |

---

## 5. Detailed Functional Requirements

### 5.1 Portal Publik & Nasabah (React SPA Frontend)
- **FR-U01 - Landing Page & Hero Section**: Built with React + Tailwind CSS, animasi smooth micro-interactions, Swiper carousel untuk galeri sampah/mitra, dan counter pencapaian animasi.
- **FR-U02 - Authentication (Inertia React)**:
  - Form Login & Register menggunakan **React Hook Form** + client-side validation.
  - Fitur Password Reset & Email Verification.
- **FR-U03 - User Dashboard SPA**:
  - Stat card interaktif (Saldo Rupiah, Saldo Poin, Total Penyetoran kg).
  - Grafik tren penyetoran menggunakan **Recharts / Chart.js** dalam komponen React.
- **FR-U04 - Katalog Sampah & Price Calculator**:
  - Filter kategori sampah secara instant tanpa reload.
  - Simulasi kalkulator potensi perolehan uang & poin berdasarkan perkiraan kg.
- **FR-U05 - Store & Redeem Reward**:
  - Modal konfirmasi penukaran poin langsung di React UI.
  - Penanganan error state jika poin atau stok tidak mencukupi.
- **FR-U06 - History & Detail Dialog**:
  - Data-table dengan pencarian dan pagination instant.
  - Modal detail rincian item sampah per transaksi.

### 5.2 Portal Admin (React Admin Dashboard)
- **FR-A01 - Modern React Admin UI**: UI clean berbasis Tailwind CSS dengan Dark Mode support.
- **FR-A02 - CRUD Kategori & Sampah**: Form modal React untuk penambahan/pengubahan jenis sampah dan upload foto via Drag & Drop.
- **FR-A03 - CRUD Reward & Inventory Tracking**: Manajemen stok barang reward dengan indicator status stok menipis.
- **FR-A04 - Management Nasabah**: Tabel data warga terdaftar dengan pencarian cepat, status akun, dan reset password.
- **FR-A05 - Quick POS Penyetoran Sampah**:
  - Form pencatatan kasir/petugas bank sampah: Pilih Nasabah ➔ Pilih Sampah ➔ Input Berat (Kg).
  - Otomatis melakukan kalkulasi live saldo dan poin.
- **FR-A06 - Approval System Tukar Poin**: Badges status interaktif (`Pending`, `On Process`, `Diterima`) dengan 1-click update.

---

## 6. System Architecture Diagram

```mermaid
flowchart TD
    subgraph Frontend (React SPA)
        A[React 19 Components] -->|Inertia.js Request| B[Inertia.js Adapter]
        A -->|Styling| C[Tailwind CSS v4]
    end
    
    subgraph Backend (Laravel 13)
        B -->|Route Routing| D[Laravel Controllers]
        D -->|ORM| E[Eloquent Models]
        F[Laravel Fortify] -->|Authentication| D
    end

    subgraph Database
        E -->|Read/Write| G[(Database MySQL/PostgreSQL/MariaDB)]
    end
```
