import { MagicLinkLogin } from "./templates/MagicLink";
import { PaymentSuccessEmail, PaymentProcessingEmail, PaymentFailedEmail, PaymentRefundedEmail } from "./templates/payment";

import resend from ".";
import { rateLimit } from "../redis/ratelimit";

export async function sendMagicLinkEmail(
	email: string,
	url: string,
	user: { name?: string; email: string },
) {
	try {
		await rateLimit({ actionType: "auth", identifier: email });
		const { data, error } = await resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL!,
			to: [email],
			subject: "Sign in to your account",
			react: MagicLinkLogin({ url, user }),
		});

		if (error) {
			console.error("Failed to send magic link email:", error);
			throw new Error("Failed to send magic link email");
		}

		return data;
	} catch (error) {
		console.error("Error sending magic link email:", error);
		throw error;
	}
}

export async function sendPaymentSuccessEmail(
	userEmail: string,
	userName: string,
	amount: string,
	transactionId: string,
) {
	try {
		const { data, error } = await resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL!,
			to: [userEmail],
			subject: "Payment Successful",
			react: PaymentSuccessEmail({ userEmail, userName, amount, transactionId }),
		});

		if (error) {
			console.error("Failed to send payment success email:", error);
			throw new Error("Failed to send payment success email");
		}

		return data;
	} catch (error) {
		console.error("Error sending payment success email:", error);
		throw error;
	}
}

export async function sendPaymentProcessingEmail(
	userEmail: string,
	userName: string,
	amount: string,
	transactionId: string,
) {
	try {
		const { data, error } = await resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL!,
			to: [userEmail],
			subject: "Payment Processing",
			react: PaymentProcessingEmail({ userEmail, userName, amount, transactionId }),
		});

		if (error) {
			console.error("Failed to send payment processing email:", error);
			throw new Error("Failed to send payment processing email");
		}

		return data;
	} catch (error) {
		console.error("Error sending payment processing email:", error);
		throw error;
	}
}

export async function sendPaymentFailedEmail(
	userEmail: string,
	userName: string,
	amount: string,
	transactionId: string,
) {
	try {
		const { data, error } = await resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL!,
			to: [userEmail],
			subject: "Payment Failed",
			react: PaymentFailedEmail({ userEmail, userName, amount, transactionId }),
		});

		if (error) {
			console.error("Failed to send payment failed email:", error);
			throw new Error("Failed to send payment failed email");
		}

		return data;
	} catch (error) {
		console.error("Error sending payment failed email:", error);
		throw error;
	}
}

export async function sendPaymentRefundedEmail(
	userEmail: string,
	userName: string,
	amount: string,
	transactionId: string,
) {
	try {
		const { data, error } = await resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL!,
			to: [userEmail],
			subject: "Payment Refunded",
			react: PaymentRefundedEmail({ userEmail, userName, amount, transactionId }),
		});

		if (error) {
			console.error("Failed to send payment refunded email:", error);
			throw new Error("Failed to send payment refunded email");
		}

		return data;
	} catch (error) {
		console.error("Error sending payment refunded email:", error);
		throw error;
	}
}
