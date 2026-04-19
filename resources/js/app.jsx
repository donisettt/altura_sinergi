import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route as ziggyRoute } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Altura Sinergi CMS';

// Make route() globally available with Ziggy config (injected by @routes in blade)
window.route = (name, params, absolute, config = window.Ziggy) =>
    ziggyRoute(name, params, absolute, config);

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#00A8E8',
        showSpinner: false,
    },
});
