// import nodemailer from 'nodemailer';
// import { EmailTemplate } from '../templates/welcome';

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT || '587'),
//   secure: process.env.SMTP_SECURE === 'true',
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// export async function sendWelcomeEmail(email: string, name: string) {
//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_FROM,
//       to: email,
//       subject: 'Welcome to StayActive Waitlist!',
//       html: EmailTemplate(name)
//     });
//   } catch (error) {
//     console.error('Failed to send welcome email:', error);
//     // Don't throw - we don't want to break the signup flow if email fails
//   }
// }
