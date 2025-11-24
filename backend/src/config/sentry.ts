// Sentry configuration for backend
// Add your Sentry DSN from https://sentry.io

import * as Sentry from '@sentry/node';

export const initSentry = () => {
    if (process.env.SENTRY_DSN && process.env.NODE_ENV === 'production') {
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV || 'development',
            tracesSampleRate: 1.0,

            // Set sampling rate for profiling
            profilesSampleRate: 1.0,

            integrations: [
                // Automatically instrument Node.js libraries and frameworks
                ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
            ],
        });

        console.log('✅ Sentry error monitoring initialized');
    } else {
        console.log('⚠️  Sentry not initialized (missing DSN or not in production)');
    }
};

export { Sentry };
