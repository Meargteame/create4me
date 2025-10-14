# Create4Me Backend Deployment Guide

This guide will help you deploy the complete Create4Me backend using Supabase.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Supabase CLI**: Install the CLI tool
   ```bash
   npm install -g supabase
   ```
3. **API Keys**: You'll need API keys for integrations:
   - OpenAI API key (for AI features)
   - Stripe keys (for billing)
   - Email provider keys (Postmark, SendGrid, etc.)

## 1. Create Supabase Project

1. Go to your Supabase dashboard
2. Click "New Project"
3. Choose your organization
4. Set project name: "create4me"
5. Set database password (save this!)
6. Choose region closest to your users
7. Click "Create new project"

## 2. Initialize Local Development

```bash
# Clone your project and navigate to it
cd /home/meareg/Desktop/create4me/react-frontend

# Initialize Supabase
supabase init

# Link to your remote project
supabase link --project-ref YOUR_PROJECT_REF
# Get PROJECT_REF from your Supabase dashboard URL

# Start local development (optional)
supabase start
```

## 3. Deploy Database Schema

```bash
# Deploy the main schema
supabase db push

# Or apply manually via dashboard:
# 1. Go to SQL Editor in your Supabase dashboard
# 2. Copy and run schema.sql
# 3. Copy and run policies.sql
# 4. Copy and run functions.sql
# 5. Copy and run seed-data.sql
```

## 4. Deploy Edge Functions

```bash
# Deploy all Edge Functions
supabase functions deploy ai-assistant
supabase functions deploy stripe-webhooks
supabase functions deploy send-campaign
supabase functions deploy analytics
supabase functions deploy notifications

# Or deploy all at once
supabase functions deploy
```

## 5. Configure Environment Variables

### For Edge Functions
Create environment variables in your Supabase dashboard:

1. Go to Settings > Edge Functions
2. Add the following environment variables:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email Configuration (choose one)
POSTMARK_API_TOKEN=your-postmark-token
SENDGRID_API_KEY=your-sendgrid-key
RESEND_API_KEY=your-resend-key

# Push Notifications
EXPO_ACCESS_TOKEN=your-expo-token

# App Configuration
APP_URL=https://your-app-domain.com
FROM_EMAIL=noreply@your-domain.com
```

### For React App
Create `.env.local` in your React project:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
VITE_APP_URL=http://localhost:5173
```

## 6. Configure Authentication

1. Go to Authentication > Settings in Supabase dashboard
2. Configure providers you want to use:
   - **Email**: Already enabled
   - **Google**: Add OAuth credentials
   - **GitHub**: Add OAuth credentials
   - **Magic Links**: Configure email templates

3. Set up email templates:
   - Confirmation email
   - Password reset
   - Magic link

## 7. Configure Storage

1. Go to Storage in Supabase dashboard
2. Create buckets:
   ```sql
   -- Run in SQL Editor
   INSERT INTO storage.buckets (id, name, public) VALUES 
   ('avatars', 'avatars', true),
   ('content-media', 'content-media', true),
   ('landing-page-assets', 'landing-page-assets', true);
   ```

3. Set up storage policies:
   ```sql
   -- Allow authenticated users to upload their own files
   CREATE POLICY "Users can upload their own files" ON storage.objects
   FOR INSERT TO authenticated
   WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

   -- Allow public access to view files
   CREATE POLICY "Anyone can view files" ON storage.objects
   FOR SELECT TO public
   USING (bucket_id IN ('avatars', 'content-media', 'landing-page-assets'));
   ```

## 8. Configure Stripe Webhooks

1. In your Stripe dashboard, go to Webhooks
2. Create endpoint: `https://your-project-ref.supabase.co/functions/v1/stripe-webhooks`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated` 
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. Copy webhook secret to environment variables

## 9. Set Up Custom Domain (Optional)

1. Configure your domain DNS:
   ```
   CNAME: your-app.com -> your-project-ref.supabase.co
   ```

2. In Supabase dashboard:
   - Go to Settings > Custom Domains
   - Add your domain
   - Verify DNS

## 10. Test Deployment

### Test Database Connection
```sql
-- Run in SQL Editor to verify setup
SELECT 
  schemaname, 
  tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

### Test Edge Functions
```bash
# Test AI Assistant
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/ai-assistant' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"action": "generate", "type": "blog_post", "prompt": "Write about productivity"}'

# Test Analytics
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/analytics' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"event_type": "page_view", "page_id": "test"}'
```

## 11. Production Checklist

- [ ] Database schema deployed
- [ ] RLS policies enabled
- [ ] Edge Functions deployed
- [ ] Environment variables configured
- [ ] Authentication providers set up
- [ ] Storage buckets created
- [ ] Stripe webhooks configured
- [ ] Custom domain configured (if applicable)
- [ ] Email templates customized
- [ ] API rate limits configured
- [ ] Monitoring and alerts set up

## 12. Monitoring and Maintenance

### Set Up Alerts
1. Go to Settings > Database in Supabase
2. Configure connection and query monitoring
3. Set up email alerts for high usage

### Regular Maintenance
- Monitor database size and performance
- Review and optimize slow queries
- Update Edge Function dependencies
- Backup critical data regularly

## Troubleshooting

### Common Issues

1. **Edge Function Deployment Fails**
   ```bash
   # Check function logs
   supabase functions logs ai-assistant
   ```

2. **RLS Policies Too Restrictive**
   ```sql
   -- Temporarily disable to test
   ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
   -- Don't forget to re-enable after testing!
   ```

3. **Environment Variables Not Working**
   - Restart Edge Functions after changing variables
   - Verify variable names match exactly

### Getting Help

- **Supabase Docs**: [docs.supabase.com](https://docs.supabase.com)
- **Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **Discord**: Join the Supabase Discord server

## Next Steps

After deploying the backend:

1. **Frontend Integration**: Update your React app to use the new backend
2. **Mobile App**: Use the same backend for React Native/Flutter app
3. **Testing**: Set up comprehensive testing for all features
4. **Performance**: Monitor and optimize database queries
5. **Security**: Regular security audits and updates

Your Create4Me backend is now ready for production! 🚀
