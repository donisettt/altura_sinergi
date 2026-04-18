import { Head, useForm } from '@inertiajs/react';
import { Zap, Shield, Activity, BarChart3 } from 'lucide-react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';

const features = [
    { icon: Shield,    label: 'Secure Access',     desc: 'Enterprise-grade authentication' },
    { icon: Activity,  label: 'Real-time Data',    desc: 'Live monitoring & analytics' },
    { icon: BarChart3, label: 'Smart Analytics',   desc: 'Actionable insights at a glance' },
];

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email:    '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login.post'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Login" />

            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-brand-navy/20 rounded-full blur-3xl pointer-events-none" />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0,168,232,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,168,232,1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Logo */}
                <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center glow-blue">
                        <Zap size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg leading-tight">Altura Sinergi</p>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">Solusindo</p>
                    </div>
                </div>

                {/* Hero text */}
                <div className="relative space-y-6">
                    <div>
                        <h2 className="text-4xl font-bold text-white leading-snug">
                            Kendalikan Bisnis{' '}
                            <span className="gradient-text">Lebih Cerdas</span>
                        </h2>
                        <p className="mt-3 text-gray-400 text-base leading-relaxed max-w-sm">
                            Platform manajemen konten terintegrasi untuk PT Altura Sinergi Solusindo —
                            teknologi, kelistrikan, dan inovasi dalam satu dashboard.
                        </p>
                    </div>

                    {/* Feature pills */}
                    <div className="space-y-3">
                        {features.map(({ icon: Icon, label, desc }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 glass rounded-xl px-4 py-3 glass-hover transition-all duration-200"
                            >
                                <div className="w-9 h-9 rounded-lg bg-brand-blue/15 flex items-center justify-center shrink-0">
                                    <Icon size={17} className="text-brand-blue" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-200">{label}</p>
                                    <p className="text-xs text-gray-500">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="relative">
                    <p className="text-xs text-gray-600">
                        © {new Date().getFullYear()} PT Altura Sinergi Solusindo · All rights reserved
                    </p>
                </div>
            </div>

            {/* Right Panel (Form) */}
            <div className="flex-1 flex items-center justify-center p-6 relative">
                {/* Subtle glow behind form */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center gap-2.5 justify-center mb-8">
                        <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center glow-blue">
                            <Zap size={18} className="text-white" strokeWidth={2.5} />
                        </div>
                        <p className="text-white font-bold text-lg">Altura Sinergi CMS</p>
                    </div>

                    {/* Card */}
                    <div className="glass rounded-2xl p-8 shadow-2xl glow-blue-lg">
                        <div className="mb-7">
                            <h1 className="text-2xl font-bold text-white">Selamat Datang</h1>
                            <p className="mt-1 text-gray-400 text-sm">
                                Masuk ke Admin Panel untuk melanjutkan
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            <Input
                                id="email"
                                type="email"
                                label="Alamat Email"
                                placeholder="admin@alturasinergi.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                                autoComplete="email"
                                autoFocus
                            />

                            <Input
                                id="password"
                                type="password"
                                label="Password"
                                placeholder="Masukkan password Anda"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                error={errors.password}
                                autoComplete="current-password"
                            />

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-surface-600 bg-surface-800 accent-brand-blue cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                        Ingat saya
                                    </span>
                                </label>
                                <a
                                    href="#"
                                    className="text-sm text-brand-blue hover:text-brand-blue-dark transition-colors"
                                >
                                    Lupa password?
                                </a>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                loading={processing}
                                className="w-full mt-2"
                            >
                                {processing ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
                            </Button>
                        </form>

                        {/* Security note */}
                        <div className="mt-6 flex items-center gap-2 p-3 bg-brand-blue/5 border border-brand-blue/10 rounded-lg">
                            <Shield size={14} className="text-brand-blue shrink-0" />
                            <p className="text-xs text-gray-500">
                                Sesi ini dilindungi dengan enkripsi SSL. Data Anda aman.
                            </p>
                        </div>
                    </div>

                    {/* Version badge */}
                    <p className="mt-5 text-center text-xs text-gray-600">
                        Altura Sinergi CMS v1.0 · Powered by Laravel &amp; React
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
