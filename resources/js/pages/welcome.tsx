import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import {
    Leaf,
    Recycle,
    Coins,
    ShieldCheck,
    ArrowRight,
    UserPlus,
    LogIn,
    Menu,
    X,
    Sparkles,
    Calculator,
    TrendingUp,
    Award,
    HeartHandshake,
    CheckCircle2,
    Users,
    ChevronRight,
    ArrowUpRight,
    Check
} from 'lucide-react';
import { useState } from 'react';

const WASTE_SAMPLE_RATES = [
    { id: 1, name: 'Botol Plastik PET', pricePerKg: 3500, icon: '🍾', category: 'Plastik' },
    { id: 2, name: 'Kardus & Kertas Bekas', pricePerKg: 2000, icon: '📦', category: 'Kertas' },
    { id: 3, name: 'Besi / Logam Campur', pricePerKg: 4500, icon: '⚙️', category: 'Logam' },
    { id: 4, name: 'Kaleng Minuman (Aluminium)', pricePerKg: 12000, icon: '🥤', category: 'Logam' },
];

export default function Welcome() {
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Interactive Mini Calculator state
    const [calcWasteId, setCalcWasteId] = useState<number>(1);
    const [calcWeight, setCalcWeight] = useState<number>(5);

    const selectedWaste = WASTE_SAMPLE_RATES.find((w) => w.id === calcWasteId) || WASTE_SAMPLE_RATES[0];
    const estimatedIncome = calcWeight * selectedWaste.pricePerKg;
    const estimatedPoints = Math.floor(estimatedIncome / 1000);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);

    return (
        <>
            <Head title="Selamat Datang - SIBANDO Bank Sampah Doko" />

            {/* FORCE BRIGHT LIGHT MODE - NO DARK THEME FALLBACK */}
            <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-teal-50/40 font-sans text-slate-800 selection:bg-emerald-200 selection:text-emerald-900">

                {/* Top Notification Bar */}
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 px-4 py-2 text-center text-xs sm:text-sm font-semibold text-white shadow-xs">
                    <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4 animate-bounce text-amber-300" />
                        <span>Program Inovasi Lingkungan Digital &bull; Tim KKN Aktivis Desa Doko</span>
                        <Sparkles className="h-4 w-4 animate-bounce text-amber-300" />
                    </div>
                </div>

                {/* Header Navbar */}
                <header className="sticky top-0 z-50 w-full border-b border-emerald-100/80 bg-white/90 backdrop-blur-md transition-all shadow-xs">
                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                        {/* Logo SIBANDO & KKN Aktivis */}
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center rounded-2xl bg-white p-1.5 shadow-md border border-emerald-100 ring-2 ring-emerald-400/20">
                                <img
                                    src="/logo kkn pilihan.png"
                                    alt="Logo KKN Aktivis"
                                    className="h-10 w-auto object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-2xl font-black tracking-tight text-slate-900">
                                        SI<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">BANDO</span>
                                    </span>
                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800 border border-amber-300/60">
                                        KKN AKTIVIS
                                    </span>
                                </div>
                                <span className="text-[11px] font-medium text-slate-500">
                                    Bank Sampah Doko
                                </span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center gap-8 md:flex">
                            <a
                                href="#beranda"
                                className="text-sm font-semibold text-slate-700 transition hover:text-emerald-600"
                            >
                                Beranda
                            </a>
                            <a
                                href="#kalkulator"
                                className="text-sm font-semibold text-slate-700 transition hover:text-emerald-600"
                            >
                                Kalkulator Sampah
                            </a>
                            <a
                                href="#keunggulan"
                                className="text-sm font-semibold text-slate-700 transition hover:text-emerald-600"
                            >
                                Keunggulan
                            </a>
                            <a
                                href="#cara-kerja"
                                className="text-sm font-semibold text-slate-700 transition hover:text-emerald-600"
                            >
                                Cara Kerja
                            </a>
                            <a
                                href="#tentang-kkn"
                                className="text-sm font-semibold text-slate-700 transition hover:text-emerald-600"
                            >
                                KKN Aktivis
                            </a>
                        </nav>

                        {/* Auth Buttons */}
                        <div className="hidden items-center gap-3 md:flex">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/25 transition-all hover:scale-105 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                >
                                    <LayoutIcon />
                                    Dashboard Saya
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-600/80 bg-white px-5 py-2 text-sm font-bold text-emerald-700 transition-all hover:bg-emerald-50 hover:border-emerald-600 shadow-xs"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-600/30"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Daftar Nasabah
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none"
                            >
                                <span className="sr-only">Navigasi Utama</span>
                                {isMobileMenuOpen ? (
                                    <X className="h-7 w-7" />
                                ) : (
                                    <Menu className="h-7 w-7" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    {isMobileMenuOpen && (
                        <div className="border-t border-emerald-100 bg-white px-4 pt-3 pb-6 md:hidden shadow-lg animate-in slide-in-from-top-2">
                            <div className="flex flex-col space-y-3">
                                <a
                                    href="#beranda"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="rounded-xl px-4 py-3 text-base font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                    Beranda
                                </a>
                                <a
                                    href="#kalkulator"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="rounded-xl px-4 py-3 text-base font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                    Kalkulator Sampah
                                </a>
                                <a
                                    href="#keunggulan"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="rounded-xl px-4 py-3 text-base font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                    Keunggulan
                                </a>
                                <a
                                    href="#cara-kerja"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="rounded-xl px-4 py-3 text-base font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                    Cara Kerja
                                </a>
                                <a
                                    href="#tentang-kkn"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="rounded-xl px-4 py-3 text-base font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                    KKN Aktivis
                                </a>
                            </div>

                            <div className="mt-4 border-t border-slate-100 pt-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="flex w-full items-center justify-center rounded-2xl bg-emerald-600 py-3.5 text-base font-bold text-white shadow-md hover:bg-emerald-700"
                                    >
                                        Dashboard Saya
                                    </Link>
                                ) : (
                                    <div className="flex flex-col gap-2.5">
                                        <Link
                                            href={login()}
                                            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-emerald-600 py-3 text-base font-bold text-emerald-700 hover:bg-emerald-50"
                                        >
                                            <LogIn className="h-5 w-5" />
                                            Masuk
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-base font-bold text-white shadow-md hover:opacity-95"
                                        >
                                            <UserPlus className="h-5 w-5" />
                                            Daftar Sekarang
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                {/* Hero Section - Text & KKN Logo Side by Side */}
                <section
                    id="beranda"
                    className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32"
                >
                    {/* Ambient Decorative Background Glows */}
                    <div className="absolute top-10 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-300/30 blur-[120px] pointer-events-none"></div>
                    <div className="absolute top-40 right-10 -z-10 h-[400px] w-[400px] rounded-full bg-amber-200/30 blur-[100px] pointer-events-none"></div>

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">

                            {/* Left Side: Hero Text & CTAs */}
                            <div className="flex flex-col text-center lg:col-span-7 lg:text-left">

                                {/* Badge Pill */}
                                <div className="mx-auto mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-300/60 bg-white/90 px-4 py-2 shadow-sm backdrop-blur-md lg:mx-0">
                                    <span className="flex h-3 w-3 items-center justify-center">
                                        <span className="h-2.5 w-2.5 animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                                        <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                                    </span>
                                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider sm:text-sm">
                                        KKN Aktivis Doko &bull; Solusi Bank Sampah Modern
                                    </span>
                                </div>

                                {/* Main Title */}
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl leading-[1.15]">
                                    Ubah Sampah Jadi{' '}
                                    <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                                        Berkah, Saldo
                                    </span>{' '}
                                    & Hadiah Poin!
                                </h1>

                                {/* Description */}
                                <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl font-medium max-w-2xl mx-auto lg:mx-0">
                                    Selamat datang di <strong className="text-slate-900 font-bold">SIBANDO</strong> (Sistem Bank Sampah Doko). Program pengabdian masyarakat dari <strong className="text-emerald-700 font-bold">KKN Aktivis Desa Doko</strong> untuk menyulap sampah anorganik rumah tangga menjadi tabungan uang Rupiah dan Poin Reward yang menguntungkan.
                                </p>

                                {/* Action Buttons */}
                                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                                    <Link
                                        href={register()}
                                        className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-emerald-600/40 sm:w-auto"
                                    >
                                        <span>Mulai Menabung Sampah</span>
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>

                                    <a
                                        href="#kalkulator"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-emerald-200 bg-white/90 px-7 py-4 text-base font-bold text-emerald-800 shadow-sm transition-all hover:bg-emerald-50 hover:border-emerald-400 sm:w-auto"
                                    >
                                        <Calculator className="h-5 w-5 text-emerald-600" />
                                        <span>Cek Harga Sampah</span>
                                    </a>
                                </div>

                                {/* Trust Metrics Pills */}
                                <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-emerald-100 pt-8 text-xs sm:text-sm font-semibold text-slate-600 lg:justify-start">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                        <span>100% Transparan</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                        <span>Penimbangan Akurat</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                        <span>Klaim Hadiah Instan</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: KKN Aktivis Logo Showcase Side-by-Side */}
                            <div className="relative flex items-center justify-center lg:col-span-5">

                                {/* Outer Frame Card with Glassmorphism & Soft Shadow */}
                                <div className="relative w-full max-w-md rounded-3xl border-2 border-emerald-200/80 bg-white/80 p-6 shadow-2xl shadow-emerald-900/10 backdrop-blur-md sm:p-8 transition-transform hover:scale-[1.02] duration-300">

                                    {/* Decorative Badge Above Logo */}
                                    <div className="mb-4 flex items-center justify-between border-b border-emerald-100 pb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Inisiatif Resmi
                                            </span>
                                        </div>
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
                                            Desa Doko
                                        </span>
                                    </div>

                                    {/* Main Hero Logo Image: KKN Aktivis */}
                                    <div className="relative my-4 flex items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-50/50 to-teal-50/50 p-6 ring-1 ring-emerald-100">
                                        <img
                                            src="/kkn aktivis (5)(1).png"
                                            alt="Logo KKN Aktivis Doko"
                                            className="h-64 w-auto object-contain drop-shadow-xl transition-all duration-300 hover:scale-105 sm:h-72"
                                            onError={(e) => {
                                                // Fallback image display if filename spacing requires direct src
                                                e.currentTarget.src = "/logo kkn pilihan.png";
                                            }}
                                        />
                                    </div>

                                    {/* Caption Box */}
                                    <div className="mt-4 rounded-xl bg-emerald-600 p-4 text-center text-white shadow-md">
                                        <h4 className="text-base font-extrabold tracking-wide">
                                            TIM KKN AKTIVIS DESA DOKO
                                        </h4>
                                        <p className="mt-0.5 text-xs text-emerald-100 font-medium">
                                            Mengabdi & Clean Environment Movement
                                        </p>
                                    </div>

                                    {/* Floating Glass Badge 1 - Left */}
                                    <div className="absolute -left-6 top-16 hidden rounded-2xl border border-emerald-100 bg-white/95 p-3.5 shadow-xl backdrop-blur-md sm:flex items-center gap-3 animate-bounce-slow">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
                                            <Recycle className="h-6 w-6 animate-spin-slow" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-500 uppercase">Sampah Terdaur</p>
                                            <p className="text-sm font-extrabold text-emerald-700">500+ Kg Limbah</p>
                                        </div>
                                    </div>

                                    {/* Floating Glass Badge 2 - Right */}
                                    <div className="absolute -right-6 bottom-12 hidden rounded-2xl border border-emerald-100 bg-white/95 p-3.5 shadow-xl backdrop-blur-md sm:flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md">
                                            <Coins className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-500 uppercase">Tabungan Warga</p>
                                            <p className="text-sm font-extrabold text-amber-600">Rupiah & Poin</p>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                </section>

                {/* Counter Stats Bar - Bright & Cheerful Cards */}
                <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:grid-cols-4 sm:p-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                                <Leaf className="h-6 w-6" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-black text-slate-900">1,250+</span>
                            <span className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">Kg Sampah Disetor</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
                                <Users className="h-6 w-6" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-black text-slate-900">150+</span>
                            <span className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">Nasabah Warga Doko</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                                <Coins className="h-6 w-6" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-black text-slate-900">Rp 4.5M+</span>
                            <span className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">Total Tabungan Uang</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                                <Award className="h-6 w-6" />
                            </div>
                            <span className="text-2xl sm:text-3xl font-black text-slate-900">350+</span>
                            <span className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">Reward Hadiah Klaim</span>
                        </div>
                    </div>
                </section>

                {/* Interactive Price Calculator Quick Peek */}
                <section id="kalkulator" className="py-20 sm:py-28">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                        <div className="mx-auto max-w-3xl text-center">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                                <Calculator className="h-4 w-4" /> Simulasi Berat (KG) & Tabungan
                            </span>
                            <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
                                Hitung Potensi Tabungan Sampah Anda
                            </h2>
                            <p className="mt-3 text-base text-slate-600 font-medium">
                                Masukkan perkiraan berat (Kilogram / KG) sampah anorganik Anda untuk mengukur hasil tabungan Rupiah & perkiraan nilai penukarannya!
                            </p>
                        </div>

                        {/* Interactive Calculator Box */}
                        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border-2 border-emerald-200 bg-white p-6 shadow-2xl shadow-emerald-900/10 sm:p-10">
                            <div className="grid gap-8 md:grid-cols-12 md:items-center">

                                {/* Controls */}
                                <div className="space-y-6 md:col-span-7">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Pilih Jenis Sampah Anorganik:
                                        </label>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            {WASTE_SAMPLE_RATES.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => setCalcWasteId(item.id)}
                                                    className={`flex items-center gap-2.5 rounded-2xl border-2 p-3 text-left transition-all ${calcWasteId === item.id
                                                            ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 font-bold shadow-xs'
                                                            : 'border-slate-100 bg-slate-50/60 text-slate-700 hover:border-emerald-200'
                                                        }`}
                                                >
                                                    <span className="text-2xl">{item.icon}</span>
                                                    <div>
                                                        <p className="text-xs font-extrabold leading-tight">{item.name}</p>
                                                        <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                                                            {formatCurrency(item.pricePerKg)} / KG
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Slider Weight */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-bold text-slate-700">
                                                Estimasi Berat Penyetoran (KG):
                                            </label>
                                            <span className="rounded-xl bg-emerald-600 px-3.5 py-1 text-sm font-black text-white shadow-xs">
                                                {calcWeight} KG
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="50"
                                            step="1"
                                            value={calcWeight}
                                            onChange={(e) => setCalcWeight(Number(e.target.value))}
                                            className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-emerald-100 accent-emerald-600"
                                        />
                                        <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-1">
                                            <span>1 KG</span>
                                            <span>25 KG</span>
                                            <span>50 KG</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Results Box */}
                                <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-xl md:col-span-5 flex flex-col justify-between h-full">
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                                            Kalkulasi Penyetoran ({calcWeight} KG)
                                        </span>

                                        <div className="mt-4">
                                            <p className="text-xs text-emerald-100 font-medium">Estimasi Saldo Tabungan (Rp):</p>
                                            <p className="text-3xl font-black text-amber-300 mt-1">
                                                {formatCurrency(estimatedIncome)}
                                            </p>
                                        </div>

                                        <div className="mt-4 border-t border-emerald-500/50 pt-4">
                                            <p className="text-xs text-emerald-100 font-medium">Ukuran Kesetaraan Penukaran:</p>
                                            <p className="text-sm font-bold text-white mt-1 leading-snug">
                                                Setara tabungan <span className="text-amber-300 font-extrabold">{calcWeight} KG</span> {selectedWaste.name} untuk penukaran sembako / barang.
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        href={register()}
                                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 py-3.5 text-center text-sm font-extrabold text-slate-900 shadow-md transition-all hover:bg-amber-300 hover:scale-[1.02]"
                                    >
                                        <span>Setor Sampah Ini</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>

                            </div>

                            {/* Location Variation Disclaimer Note */}
                            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 font-medium flex items-start gap-3">
                                <span className="text-base leading-none">📌</span>
                                <div>
                                    <strong className="font-extrabold text-amber-950">Catatan Perbedaan Tiap Lokasi:</strong> Standardized harga per KG, kategori jenis sampah yang diterima, dan ketentuan penukaran dapat berbeda-beda di tiap lokasi / titik Bank Sampah di wilayah Anda. Hasil di atas merupakan kalkulasi estimasi rata-rata patokan.
                                </div>
                            </div>

                        </div>

                    </div>
                </section>

                {/* Keunggulan Section */}
                <section id="keunggulan" className="bg-white py-20 sm:py-28 border-y border-emerald-100">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <span className="rounded-full bg-teal-100 px-4 py-1.5 text-xs font-bold text-teal-800 uppercase tracking-wide">
                                Layanan Unggulan SIBANDO
                            </span>
                            <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
                                Mengapa Harus Menabung di Bank Sampah Doko?
                            </h2>
                            <p className="mt-3 text-base text-slate-600 font-medium">
                                Nikmati kemudahan pengelolaan limbah ramah lingkungan dengan sistem pencatatan digital yang transparan.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                            {/* Card 1 */}
                            <div className="group rounded-3xl border border-emerald-100 bg-emerald-50/40 p-8 transition-all hover:-translate-y-1 hover:bg-emerald-50 hover:shadow-xl hover:shadow-emerald-900/5">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md group-hover:scale-110 transition-transform">
                                    <Recycle className="h-7 w-7" />
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-slate-900">
                                    Lingkungan Bersih & Daur Ulang
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-600 font-medium">
                                    Membantu mengurangi tumpukan sampah plastik dan anorganik di pemukiman warga Desa Doko dengan sistem pemilahan yang tepat.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="group rounded-3xl border border-emerald-100 bg-teal-50/40 p-8 transition-all hover:-translate-y-1 hover:bg-teal-50 hover:shadow-xl hover:shadow-teal-900/5">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md group-hover:scale-110 transition-transform">
                                    <Coins className="h-7 w-7" />
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-slate-900">
                                    Konversi Rupiah & Poin Hadiah
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-600 font-medium">
                                    Setiap penimbangan sampah langsung dikonversi menjadi saldo uang Rupiah dan bonus Poin yang bisa ditukarkan dengan hadiah barang/sembako.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="group rounded-3xl border border-emerald-100 bg-amber-50/40 p-8 transition-all hover:-translate-y-1 hover:bg-amber-50 hover:shadow-xl hover:shadow-amber-900/5">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="h-7 w-7" />
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-slate-900">
                                    Pencatatan Digital Transparan
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-600 font-medium">
                                    Nasabah memiliki akses penuh ke Dashboard SPA pribadi untuk melihat riwayat penyetoran, saldo akumulasi, dan status penukaran secara real-time.
                                </p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Infografis Alur Bank Sampah */}
                <section id="infografis" className="py-16 bg-slate-50/80 border-y border-emerald-100">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                            Infografis Edukasi
                        </span>
                        <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
                            Alur & Manfaat Tabungan Bank Sampah
                        </h2>
                        <p className="mt-3 text-base text-slate-600 font-medium max-w-2xl mx-auto">
                            Panduan visual lengkap pemilahan sampah anorganik dari rumah hingga menjadi nilai tabungan Rupiah.
                        </p>
                        <div className="mt-10 overflow-hidden rounded-3xl border-4 border-white shadow-2xl max-w-5xl mx-auto">
                            <img
                                src="/images/infografis-bank-sampah.png"
                                alt="Infografis Bank Sampah"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="cara-kerja" className="py-20 sm:py-28">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                                Langkah Sederhana
                            </span>
                            <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
                                Cara Menabung Sampah di SIBANDO
                            </h2>
                            <p className="mt-3 text-base text-slate-600 font-medium">
                                Hanya butuh 3 langkah praktis untuk mulai mendapatkan manfaat finansial dan menjaga lingkungan.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-8 md:grid-cols-3">

                            {/* Step 1 */}
                            <div className="relative flex flex-col items-center rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-lg shadow-emerald-900/5">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-black text-white shadow-md ring-4 ring-emerald-100">
                                    1
                                </div>
                                <h3 className="mt-6 text-xl font-extrabold text-slate-900">
                                    Kumpulkan & Pilah
                                </h3>
                                <p className="mt-3 text-sm text-slate-600 font-medium leading-relaxed">
                                    Kumpulkan sampah anorganik (plastik, botol, kardus, besi) di rumah Anda dalam keadaan relatif bersih dan kering.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="relative flex flex-col items-center rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-lg shadow-emerald-900/5">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 text-2xl font-black text-white shadow-md ring-4 ring-teal-100">
                                    2
                                </div>
                                <h3 className="mt-6 text-xl font-extrabold text-slate-900">
                                    Setor ke Petugas SIBANDO
                                </h3>
                                <p className="mt-3 text-sm text-slate-600 font-medium leading-relaxed">
                                    Bawa sampah ke titik lokasi Bank Sampah Doko. Petugas akan menimbang secara akurat dan input langsung di POS aplikasi.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="relative flex flex-col items-center rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-lg shadow-emerald-900/5">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-2xl font-black text-white shadow-md ring-4 ring-amber-100">
                                    3
                                </div>
                                <h3 className="mt-6 text-xl font-extrabold text-slate-900">
                                    Terima Saldo & Poin
                                </h3>
                                <p className="mt-3 text-sm text-slate-600 font-medium leading-relaxed">
                                    Saldo Rupiah dan bonus Poin langsung bertambah di akun Anda! Gunakan saldo atau tukarkan poin dengan berbagai hadiah menarik.
                                </p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* About KKN Aktivis Section */}
                <section id="tentang-kkn" className="bg-gradient-to-r from-emerald-800 to-teal-900 py-20 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-12 lg:grid-cols-12">

                            <div className="flex justify-center lg:col-span-5">
                                <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-md ring-1 ring-white/20">
                                    <img
                                        src="/kkn aktivis (5)(1).png"
                                        alt="Logo KKN Aktivis Doko"
                                        className="h-64 w-auto object-contain drop-shadow-2xl"
                                    />
                                </div>
                            </div>

                            <div className="lg:col-span-7 text-center lg:text-left">
                                <span className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-black text-slate-900 uppercase">
                                    <HeartHandshake className="h-4 w-4" /> Pengabdian Masyarakat
                                </span>
                                <h2 className="mt-4 text-3xl font-black sm:text-4xl text-white">
                                    Inisiatif Tim KKN Aktivis Desa Doko
                                </h2>
                                <p className="mt-4 text-base text-emerald-100 font-medium leading-relaxed">
                                    SIBANDO dikembangkan oleh Tim KKN Aktivis sebagai wujud nyata pengabdian untuk membantu warga Desa Doko mengelola limbah rumah tangga dengan cara yang lebih modern, transparan, dan bernilai ekonomis.
                                </p>

                                <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                                    <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-xs text-sm font-semibold">
                                        <Check className="h-4 w-4 text-amber-300" /> Pemberdayaan Ekonomi Warga
                                    </div>
                                    <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-xs text-sm font-semibold">
                                        <Check className="h-4 w-4 text-amber-300" /> Edukasi Lingkungan Hidup
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Call to Action (CTA) */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 p-10 sm:p-16 text-center text-white shadow-2xl">
                            <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">
                                Siap Menjadi Nasabah Bank Sampah Doko?
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-emerald-100 font-medium">
                                Bergabunglah sekarang, kumpulkan sampah anorganik rumah tangga Anda, dan nikmati tabungan uang serta poin reward secara nyata.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    href={register()}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-8 py-4 text-base font-extrabold text-slate-900 shadow-lg transition-all hover:bg-amber-300 hover:scale-105"
                                >
                                    <span>Daftar Akun Sekarang</span>
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-emerald-100 bg-white py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                            <div className="flex items-center gap-3">
                                <div className="relative flex items-center justify-center rounded-xl bg-white p-1 border border-emerald-100 shadow-xs">
                                    <img
                                        src="/logo kkn pilihan.png"
                                        alt="Logo KKN Aktivis"
                                        className="h-8 w-auto object-contain"
                                    />
                                </div>
                                <span className="text-xl font-black text-slate-900">
                                    SI<span className="text-emerald-600">BANDO</span>
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm font-medium text-slate-500">
                                &copy; {new Date().getFullYear()} SIBANDO &bull; KKN Aktivis Desa Doko. Hak Cipta Dilindungi.
                            </p>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}

function LayoutIcon() {
    return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    );
}

