import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "StudyHub"}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

const BRAND_COLOR = "#3B82F6"; // Accent Blue
const TEXT_DARK = "#0C0A09";
const TEXT_MUTED = "#475569";
const BORDER_COLOR = "#E2E8F0";

const getEmailWrapper = (content: string) => `
  <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #F8FAFC; color: ${TEXT_DARK};">
    <div style="background-color: #FFFFFF; border-radius: 16px; border: 1px solid ${BORDER_COLOR}; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      <div style="padding: 32px 40px; text-align: center; border-bottom: 1px solid ${BORDER_COLOR};">
         <div style="font-size: 24px; font-weight: 800; letter-spacing: -1px; display: inline-flex; align-items: center; gap: 8px;">
            <div style="background: ${BRAND_COLOR}; color: white; width: 36px; height: 36px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; font-size: 20px;">S</div>
            Study<span style="color: ${BRAND_COLOR};">Hub</span>
         </div>
      </div>
      <div style="padding: 40px;">
        ${content}
      </div>
      <div style="padding: 24px 40px; background-color: #F1F5F9; text-align: center; font-size: 13px; color: ${TEXT_MUTED};">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} StudyHub. Shaping the future of education.</p>
        <p style="margin: 8px 0 0;">This email was sent to notify you about your community submission status.</p>
      </div>
    </div>
  </div>
`;

export const getSubmissionReceivedEmail = (userName: string, title: string) => {
  return getEmailWrapper(`
    <h2 style="font-size: 24px; font-weight: 700; margin-top: 0; color: ${TEXT_DARK};">Submission Received! 📝</h2>
    <p style="font-size: 16px; line-height: 1.6; color: ${TEXT_MUTED};">Hi <strong>${userName}</strong>,</p>
    <p style="font-size: 16px; line-height: 1.6; color: ${TEXT_MUTED};">Thank you for contributing to the community! We've received your material "<strong>${title}</strong>" and it's now in line for review.</p>
    <div style="margin: 32px 0; padding: 20px; background-color: #EFF6FF; border-radius: 12px; border: 1px solid #DBEAFE;">
       <p style="margin: 0; font-size: 14px; font-weight: 600; color: ${BRAND_COLOR}; text-transform: uppercase; letter-spacing: 0.05em;">Status Update</p>
       <p style="margin: 8px 0 0; font-size: 16px; color: ${TEXT_DARK};"><strong>Verification in progress</strong></p>
       <p style="margin: 4px 0 0; font-size: 14px; color: ${TEXT_MUTED}; text-italic">Our moderators will ensure the content matches our standards before it goes live.</p>
    </div>
    <p style="font-size: 15px; line-height: 1.6; color: ${TEXT_MUTED};">We'll let you know as soon as there's an update. Thanks for being part of our community!</p>
  `);
};

export const getSubmissionStatusEmail = (userName: string, title: string, status: "approved" | "rejected", feedback?: string) => {
  const isApproved = status === "approved";
  const icon = isApproved ? "✅" : "❌";
  const statusLabel = isApproved ? "Successfully Approved" : "Submission Update";
  const accentColor = isApproved ? "#10B981" : "#EF4444";
  const statusBg = isApproved ? "#F0FDF4" : "#FEF2F2";
  const statusBorder = isApproved ? "#DCFCE7" : "#FEE2E2";

  return getEmailWrapper(`
    <h2 style="font-size: 24px; font-weight: 700; margin-top: 0; color: ${TEXT_DARK};">${statusLabel} ${icon}</h2>
    <p style="font-size: 16px; line-height: 1.6; color: ${TEXT_MUTED};">Hi <strong>${userName}</strong>,</p>
    <p style="font-size: 16px; line-height: 1.6; color: ${TEXT_MUTED};">We've completed the review of your submission "<strong>${title}</strong>".</p>
    
    <div style="margin: 32px 0; padding: 24px; background-color: ${statusBg}; border-radius: 12px; border: 1px solid ${statusBorder}; text-align: center;">
       <p style="margin: 0; font-size: 14px; font-weight: 600; color: ${accentColor}; text-transform: uppercase;">Final Status</p>
       <p style="margin: 8px 0 0; font-size: 20px; font-weight: 800; color: ${TEXT_DARK}; text-transform: capitalize;">${status}</p>
    </div>

    ${feedback ? `
    <div style="margin: 32px 0; padding: 20px; background-color: #F8FAFC; border-radius: 12px; border: 1px solid ${BORDER_COLOR};">
       <p style="margin: 0; font-size: 14px; font-weight: 600; color: ${TEXT_MUTED};">ADMIN FEEDBACK</p>
       <p style="margin: 8px 0 0; font-size: 15px; color: ${TEXT_DARK}; line-height: 1.5;">${feedback}</p>
    </div>
    ` : ""}

    <div style="margin-top: 32px; text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/community" style="display: inline-block; background-color: ${BRAND_COLOR}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">
        ${isApproved ? "View in Library" : "Visit Community"}
      </a>
    </div>
  `);
};
;
