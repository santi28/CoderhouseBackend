"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsApp = exports.sendSMS = exports.sendEmail = void 0;
const app_config_1 = __importDefault(require("../config/app.config"));
const gmail_transport_1 = __importDefault(require("../utils/gmail.transport"));
const twilio_1 = __importDefault(require("twilio"));
const twilioClient = (0, twilio_1.default)(app_config_1.default.app.twilio.accountSid, app_config_1.default.app.twilio.authToken);
const sendEmail = async (email, subject, html) => {
    console.log(`📧 Sending email to ${email} from ${app_config_1.default.app.mailer.auth.user}`);
    const mail = await gmail_transport_1.default.sendMail({
        from: 'SantiagoDN <santidenicolas@gmail.com>',
        to: email,
        subject,
        html
    });
    return mail;
};
exports.sendEmail = sendEmail;
const sendSMS = async (phone, message) => {
    console.log(`📱 Sending sms to ${phone} from ${app_config_1.default.app.twilio.phoneNumber}`);
    const sms = await twilioClient.messages.create({
        to: phone,
        body: message,
        from: app_config_1.default.app.twilio.phoneNumber
    });
    return sms;
};
exports.sendSMS = sendSMS;
const sendWhatsApp = async (phone, message) => {
    console.log(`📱 Sending whatsapp message to ${phone} from ${app_config_1.default.app.twilio.whatsappNumber}`);
    const sms = await twilioClient.messages.create({
        to: `whatsapp:${phone}`,
        body: message,
        from: `whatsapp:${app_config_1.default.app.twilio.whatsappNumber}`
    });
    return sms;
};
exports.sendWhatsApp = sendWhatsApp;
