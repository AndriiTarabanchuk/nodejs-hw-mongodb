import nodemailer from 'nodemailer';
import { env } from './env.js';
import { SMTP } from '../constants/index.js';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: env(SMTP.SMTP_PORT),
  secure: false, // true for port 465, false for other ports
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmailClient = async (options) => {
  return await transporter.sendMail(options);
};
