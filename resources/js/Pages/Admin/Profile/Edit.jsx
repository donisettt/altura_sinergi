import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { User, Lock, Save, Camera } from 'lucide-react';
import { ImageUpload } from '@/Components/cms/ImageUpload';

export default function Edit({ user, status }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const profileForm = useForm({
        name: user.name,
        email: user.email,
        avatar: null,
        remove_avatar: false,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updateProfile = (e) => {
        e.preventDefault();
        profileForm.post(route('admin.profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                alert('Profil berhasil diperbarui!');
            },
            onError: (errors) => {
                if(errors.avatar) alert(errors.avatar);
                if(errors.email) alert(errors.email);
            }
        });
    };

    const updatePassword = (e) => {
        e.preventDefault();
        passwordForm.put(route('admin.profile.password'), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                alert('Kata sandi berhasil diperbarui!');
            },
            onError: () => {
                if (passwordForm.errors.password) {
                    passwordForm.reset('password', 'password_confirmation');
                }
                if (passwordForm.errors.current_password) {
                    passwordForm.reset('current_password');
                }
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Pengaturan Profil" />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Profil Saya</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        Kelola informasi profil dasar dan keamanan akun Anda.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Information Block */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6">
                        <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                                <User size={20} className="text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-text-primary">Informasi Dasar</h2>
                                <p className="text-xs text-text-muted">Perbarui foto, nama, dan alamat email akun.</p>
                            </div>
                        </div>

                        <form onSubmit={updateProfile} className="space-y-6">
                            {/* Avatar Section */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-3">Foto Profil</label>
                                <div className="flex items-center gap-6">
                                    {/* Preview avatar yang aktif */}
                                    {!profileForm.data.avatar && !profileForm.data.remove_avatar && (
                                         <img
                                             src={user.avatar_url}
                                             alt={user.name}
                                             className="w-24 h-24 rounded-full object-cover ring-4 ring-bg-hover"
                                         />
                                    )}
                                    {profileForm.data.remove_avatar && !profileForm.data.avatar && (
                                         <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed border-border text-text-muted">
                                            <User size={30}/>
                                         </div>
                                    )}

                                    <div className="flex-1 max-w-sm">
                                        <ImageUpload
                                            value={user.avatar} // Nilai awal (jika tidak ada data baru)
                                            onChange={(file) => {
                                                if (file === null) {
                                                    profileForm.setData('remove_avatar', true);
                                                    profileForm.setData('avatar', null);
                                                } else {
                                                    profileForm.setData('remove_avatar', false);
                                                    profileForm.setData('avatar', file);
                                                }
                                            }}
                                            label="Pilih Foto Baru"
                                        />
                                    </div>
                                </div>
                                {profileForm.errors.avatar && <p className="text-error text-xs mt-1">{profileForm.errors.avatar}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileForm.data.name}
                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                        className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                                    />
                                    {profileForm.errors.name && <p className="text-error text-xs mt-1">{profileForm.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Alamat Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                        className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                                    />
                                    {profileForm.errors.email && <p className="text-error text-xs mt-1">{profileForm.errors.email}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end border-t border-border mt-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-brand-blue-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    {profileForm.processing ? 'Menyimpan...' : (
                                        <><Save size={18} /> Simpan Perubahan</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Password Secion */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card p-6">
                        <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-error/10">
                                <Lock size={20} className="text-error" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-text-primary">Ganti Sandi</h2>
                                <p className="text-xs text-text-muted">Pastikan menggunakan sandi acak panjang.</p>
                            </div>
                        </div>

                        <form onSubmit={updatePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1.5">Sandi Saat Ini</label>
                                <input
                                    type="password"
                                    name="current_password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                                />
                                {passwordForm.errors.current_password && <p className="text-error text-xs mt-1">{passwordForm.errors.current_password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1.5">Sandi Baru</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                                />
                                {passwordForm.errors.password && <p className="text-error text-xs mt-1">{passwordForm.errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1.5">Konfirmasi Sandi Baru</label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                                />
                                {passwordForm.errors.password_confirmation && <p className="text-error text-xs mt-1">{passwordForm.errors.password_confirmation}</p>}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="w-full justify-center flex items-center gap-2 px-6 py-2 bg-bg-hover hover:bg-border text-text-primary rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    {passwordForm.processing ? 'Menyimpan...' : 'Perbarui Sandi'}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    {/* Info Card */}
                    <div className="card p-5 bg-gradient-to-br from-bg-card to-bg-hover border-l-4 border-primary">
                        <h3 className="text-sm font-bold text-text-primary mb-2">Informasi Akun Anda</h3>
                        <div className="space-y-2 text-xs text-text-secondary">
                            <p><strong>Hierarki Peran: </strong> <span className="capitalize">{user.roles.join(', ')}</span></p>
                            <p><strong>Akses: </strong> Administrator Panel & Content Manager.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
