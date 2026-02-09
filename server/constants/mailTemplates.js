export const welcomeMailTemplate = (name) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to Emote Technology</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">
          
          <!-- Main Container -->
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg, #4f46e5, #6366f1); padding:30px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:26px;">Welcome to Emote Technology 🚀</h1>
                <p style="color:#e0e7ff; margin-top:8px; font-size:14px;">
                  Learn smarter. Grow faster. Powered by AI.
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;">
                <h2 style="color:#111827; margin-bottom:10px;">Hi ${name}, 👋</h2>
                
                <p style="color:#374151; font-size:15px; line-height:1.6;">
                  We’re excited to have you onboard <strong>Emote Technology</strong> — your AI-powered learning platform
                  where education meets innovation.
                </p>

                <p style="color:#374151; font-size:15px; line-height:1.6;">
                  With Emote, you can:
                </p>

                <ul style="color:#374151; font-size:15px; line-height:1.8; padding-left:18px;">
                  <li>🤖 Practice with <strong>AI Interviews</strong> & get real-time feedback</li>
                  <li>💬 Learn faster using <strong>AI Chat Assistance</strong></li>
                  <li>🎥 Access high-quality <strong>video courses</strong></li>
                  <li>📈 Track your progress & upskill confidently</li>
                </ul>

                <p style="color:#374151; font-size:15px; line-height:1.6;">
                  Your learning journey starts now — and we’re here at every step.
                </p>

                <!-- CTA Button -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="https://emotetechnology.com/login"
                     style="background:#4f46e5; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:6px; font-size:15px; font-weight:bold; display:inline-block;">
                    Start Learning Now 🚀
                  </a>
                </div>

                <p style="color:#6b7280; font-size:13px;">
                  If the button doesn’t work, copy & paste this link into your browser:
                </p>
                <p style="word-break:break-all; color:#4f46e5; font-size:13px;">
                  https://emotetechnology.com/login
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; padding:20px; text-align:center;">
                <p style="margin:0; font-size:13px; color:#6b7280;">
                  © ${new Date().getFullYear()} Emote Technology. All rights reserved.
                </p>
                <p style="margin-top:6px; font-size:12px; color:#9ca3af;">
                  Empowering learning with AI.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};


export const otpMailTemplate = (name, otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>OTP Verification - Emote Technology</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:#4f46e5; padding:24px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:24px;">Emote Technology 🔐</h1>
                <p style="color:#e0e7ff; font-size:14px; margin-top:6px;">
                  Secure OTP Verification
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:30px;">
                <h2 style="color:#111827;">Hello ${name}, 👋</h2>

                <p style="color:#374151; font-size:15px; line-height:1.6;">
                  We received a request to verify your identity.  
                  Please use the OTP below to continue.
                </p>

                <!-- OTP Box -->
                <div style="margin:30px 0; text-align:center;">
                  <span style="
                    display:inline-block;
                    font-size:28px;
                    letter-spacing:6px;
                    font-weight:bold;
                    color:#4f46e5;
                    background:#eef2ff;
                    padding:14px 24px;
                    border-radius:8px;
                  ">
                    ${otp}
                  </span>
                </div>

                <p style="color:#374151; font-size:14px;">
                  ⏱ This OTP is valid for <strong>10 minutes</strong>.  
                  Do not share this code with anyone.
                </p>

                <p style="color:#6b7280; font-size:13px;">
                  If you didn’t request this, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; padding:18px; text-align:center;">
                <p style="font-size:12px; color:#6b7280; margin:0;">
                  © ${new Date().getFullYear()} Emote Technology
                </p>
                <p style="font-size:12px; color:#9ca3af; margin-top:4px;">
                  AI-Powered Learning Platform
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};


export const verificationMailTemplate = (name, verifyLink) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Verify Your Email - Emote Technology</title>
  </head>

  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">

          <!-- Main Card -->
          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#4f46e5,#6366f1); padding:28px; text-align:center;">
                <h1 style="margin:0; color:#ffffff; font-size:26px;">
                  Verify Your Email ✉️
                </h1>
                <p style="margin-top:8px; color:#e0e7ff; font-size:14px;">
                  Emote Technology • AI-Powered Learning
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;">
                <h2 style="color:#111827; margin-bottom:10px;">
                  Hi ${name}, 👋
                </h2>

                <p style="color:#374151; font-size:15px; line-height:1.6;">
                  Welcome to <strong>Emote Technology</strong>!  
                  Please verify your email address to activate your account and
                  unlock AI-powered learning features.
                </p>

                <p style="color:#374151; font-size:15px; line-height:1.6;">
                  Click the button below to verify your email:
                </p>

                <!-- CTA -->
                <div style="text-align:center; margin:32px 0;">
                  <a href="${verifyLink}"
                    style="
                      background:#4f46e5;
                      color:#ffffff;
                      text-decoration:none;
                      padding:14px 30px;
                      border-radius:6px;
                      font-size:15px;
                      font-weight:bold;
                      display:inline-block;
                    ">
                    Verify Email Address ✅
                  </a>
                </div>

                <p style="color:#374151; font-size:14px;">
                  ⏱ This verification link is valid for <strong>24 hours</strong>.
                </p>

                <p style="color:#6b7280; font-size:13px;">
                  If the button doesn’t work, copy and paste this link into your browser:
                </p>

                <p style="word-break:break-all; font-size:13px; color:#4f46e5;">
                  ${verifyLink}
                </p>

                <p style="color:#6b7280; font-size:13px;">
                  If you didn’t create an account, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; padding:20px; text-align:center;">
                <p style="margin:0; font-size:12px; color:#6b7280;">
                  © ${new Date().getFullYear()} Emote Technology
                </p>
                <p style="margin-top:6px; font-size:12px; color:#9ca3af;">
                  Learn • Practice • Succeed with AI 🚀
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};

export const accountStatusMailTemplate = (name, status) => {
  const statusColor =
    status === "ACTIVE"
      ? "#16a34a"
      : status === "SUSPENDED"
      ? "#f59e0b"
      : "#ef4444";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Account Status Update</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" style="background:#fff;border-radius:10px;overflow:hidden;">
            
            <tr>
              <td style="background:#4f46e5;padding:24px;text-align:center;color:#fff;">
                <h1 style="margin:0;">Emote Technology</h1>
                <p style="margin-top:6px;font-size:14px;">Account Status Update</p>
              </td>
            </tr>

            <tr>
              <td style="padding:30px;">
                <h2>Hello ${name},</h2>

                <p style="font-size:15px;color:#374151;">
                  Your account status has been updated by our team.
                </p>

                <p style="font-size:16px;margin:20px 0;">
                  <strong>Status:</strong>
                  <span style="color:${statusColor};font-weight:bold;">
                    ${status}
                  </span>
                </p>

                <p style="font-size:14px;color:#6b7280;">
                  If you believe this was a mistake or need assistance, please contact our support team.
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#6b7280;">
                © ${new Date().getFullYear()} Emote Technology
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

export const accountDeletedMailTemplate = (name) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Account Deleted</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" style="background:#fff;border-radius:10px;overflow:hidden;">

            <tr>
              <td style="background:#ef4444;padding:24px;text-align:center;color:#fff;">
                <h1 style="margin:0;">Account Deleted</h1>
                <p style="margin-top:6px;font-size:14px;">Emote Technology</p>
              </td>
            </tr>

            <tr>
              <td style="padding:30px;">
                <h2>Goodbye ${name},</h2>

                <p style="font-size:15px;color:#374151;">
                  Your Emote Technology account has been successfully deleted.
                </p>

                <p style="font-size:14px;color:#6b7280;">
                  We’re sorry to see you go. If this was a mistake or you change your mind,
                  you can contact our support team within the recovery period.
                </p>

                <p style="font-size:14px;color:#6b7280;">
                  Thank you for learning with us and being part of our community.
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#6b7280;">
                © ${new Date().getFullYear()} Emote Technology
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

