import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email templates
const templates = {
  welcome: (name: string) => ({
    subject: 'Welcome to Create4Me! 🚀',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Welcome to Create4Me!</h1>
        </div>
        <div style="padding: 40px; background: #f9fafb;">
          <h2>Hi ${name}! 👋</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            We're excited to have you join Ethiopia's #1 influencer marketing platform!
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Get started by completing your profile and exploring opportunities.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280;">
            Need help? Reply to this email or visit our help center.
          </p>
        </div>
        <div style="padding: 20px; text-align: center; background: #e5e7eb; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            © 2024 Create4Me. Made with ❤️ in Ethiopia
          </p>
        </div>
      </div>
    `
  }),

  emailVerification: (name: string, token: string) => ({
    subject: 'Verify Your Email - Create4Me',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Verify Your Email</h1>
        </div>
        <div style="padding: 40px; background: #f9fafb;">
          <h2>Hi ${name}!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Please verify your email address to activate your Create4Me account.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/verify-email/${token}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280;">
            Or copy this link: ${process.env.FRONTEND_URL}/verify-email/${token}
          </p>
          <p style="font-size: 14px; color: #6b7280;">
            This link will expire in 24 hours.
          </p>
        </div>
        <div style="padding: 20px; text-align: center; background: #e5e7eb; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            © 2024 Create4Me. Made with ❤️ in Ethiopia
          </p>
        </div>
      </div>
    `
  }),

  campaignNotification: (name: string, campaignTitle: string, campaignId: string) => ({
    subject: `New Campaign: ${campaignTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">New Campaign Alert! 🎯</h1>
        </div>
        <div style="padding: 40px; background: #f9fafb;">
          <h2>Hi ${name}!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            A new campaign matching your profile has been posted:
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">${campaignTitle}</h3>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/campaigns/${campaignId}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View Campaign
            </a>
          </div>
        </div>
        <div style="padding: 20px; text-align: center; background: #e5e7eb; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            © 2024 Create4Me. Made with ❤️ in Ethiopia
          </p>
        </div>
      </div>
    `
  }),

  applicationUpdate: (name: string, campaignTitle: string, status: string) => ({
    subject: `Application ${status}: ${campaignTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, ${status === 'accepted' ? '#10b981' : '#ef4444'} 0%, ${status === 'accepted' ? '#059669' : '#dc2626'} 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Application ${status === 'accepted' ? 'Accepted! 🎉' : 'Update'}</h1>
        </div>
        <div style="padding: 40px; background: #f9fafb;">
          <h2>Hi ${name}!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Your application for "${campaignTitle}" has been ${status}.
          </p>
          ${status === 'accepted' ? `
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Congratulations! The brand will contact you soon to discuss next steps.
            </p>
          ` : ''}
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View Dashboard
            </a>
          </div>
        </div>
        <div style="padding: 20px; text-align: center; background: #e5e7eb; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            © 2024 Create4Me. Made with ❤️ in Ethiopia
          </p>
        </div>
      </div>
    `
  })
};

// Email service functions
export const EmailService = {
  async sendWelcomeEmail(email: string, name: string) {
    try {
      const { subject, html } = templates.welcome(name);
      await transporter.sendMail({
        from: `"Create4Me" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html
      });
      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  },

  async sendVerificationEmail(email: string, name: string, token: string) {
    try {
      const { subject, html } = templates.emailVerification(name, token);
      await transporter.sendMail({
        from: `"Create4Me" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html
      });
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }
  },

  async sendCampaignNotification(email: string, name: string, campaignTitle: string, campaignId: string) {
    try {
      const { subject, html } = templates.campaignNotification(name, campaignTitle, campaignId);
      await transporter.sendMail({
        from: `"Create4Me" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html
      });
      console.log(`Campaign notification sent to ${email}`);
    } catch (error) {
      console.error('Failed to send campaign notification:', error);
    }
  },

  async sendApplicationUpdate(email: string, name: string, campaignTitle: string, status: string) {
    try {
      const { subject, html } = templates.applicationUpdate(name, campaignTitle, status);
      await transporter.sendMail({
        from: `"Create4Me" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html
      });
      console.log(`Application update email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send application update email:', error);
    }
  }
};
