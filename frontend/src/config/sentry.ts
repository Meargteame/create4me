// Sentry configuration for frontend
// Add your Sentry DSN from https://sentry.io

// import * as Sentry from '@sentry/react';

export const initSentry = () => {
    console.log('Sentry disabled for now.');
    /*
    if (import.meta.env.VITE_SENTRY_DSN && import.meta.env.PROD) {
        Sentry.init({
            dsn: import.meta.env.VITE_SENTRY_DSN,
            environment: import.meta.env.MODE,
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration({
                    maskAllText: false,
                    blockAllMedia: false,
                }),
            ],

            // Performance Monitoring
            tracesSampleRate: 1.0,

            // Session Replay
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
        });

        console.log('✅ Sentry error monitoring initialized');
    } else {
        console.log('⚠️  Sentry not initialized (development mode or missing DSN)');
    }
    */
};

export const Sentry = {
    captureException: (e: any) => console.error(e)
};
