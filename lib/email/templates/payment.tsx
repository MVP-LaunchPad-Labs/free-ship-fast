import React from 'react';

interface PaymentEmailProps {
	userEmail: string;
	userName: string;
	amount: string;
	transactionId: string;
	planName?: string;
}

export const PaymentSuccessEmail = ({
	userEmail,
	userName,
	amount,
	transactionId,
	planName = 'Premium Plan'
}: PaymentEmailProps) => (
	<div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
		<h1 style={{ color: '#22c55e' }}>Payment Successful!</h1>
		<p>Hi {userName},</p>
		<p>Your payment has been processed successfully.</p>
		<div style={{ backgroundColor: '#f9f9f9', padding: '20px', margin: '20px 0' }}>
			<h3>Payment Details:</h3>
			<p><strong>Plan:</strong> {planName}</p>
			<p><strong>Amount:</strong> ${amount}</p>
			<p><strong>Transaction ID:</strong> {transactionId}</p>
		</div>
		<p>Thank you for your purchase!</p>
	</div>
);

export const PaymentProcessingEmail = ({
	userEmail,
	userName,
	amount,
	transactionId
}: PaymentEmailProps) => (
	<div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
		<h1 style={{ color: '#f59e0b' }}>Payment Processing</h1>
		<p>Hi {userName},</p>
		<p>We're currently processing your payment.</p>
		<div style={{ backgroundColor: '#fef3c7', padding: '20px', margin: '20px 0' }}>
			<h3>Payment Details:</h3>
			<p><strong>Amount:</strong> ${amount}</p>
			<p><strong>Transaction ID:</strong> {transactionId}</p>
		</div>
		<p>You'll receive a confirmation email once the payment is complete.</p>
	</div>
);

export const PaymentFailedEmail = ({
	userEmail,
	userName,
	amount,
	transactionId
}: PaymentEmailProps) => (
	<div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
		<h1 style={{ color: '#ef4444' }}>Payment Failed</h1>
		<p>Hi {userName},</p>
		<p>Unfortunately, we were unable to process your payment.</p>
		<div style={{ backgroundColor: '#fee2e2', padding: '20px', margin: '20px 0' }}>
			<h3>Payment Details:</h3>
			<p><strong>Amount:</strong> ${amount}</p>
			<p><strong>Transaction ID:</strong> {transactionId}</p>
		</div>
		<p>Please check your payment method and try again, or contact support if the issue persists.</p>
		<a href="/billing" style={{ color: '#3b82f6', textDecoration: 'none' }}>Try Again</a>
	</div>
);

export const PaymentRefundedEmail = ({
	userEmail,
	userName,
	amount,
	transactionId
}: PaymentEmailProps) => (
	<div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
		<h1 style={{ color: '#6b7280' }}>Payment Refunded</h1>
		<p>Hi {userName},</p>
		<p>Your payment has been refunded successfully.</p>
		<div style={{ backgroundColor: '#f3f4f6', padding: '20px', margin: '20px 0' }}>
			<h3>Refund Details:</h3>
			<p><strong>Amount:</strong> ${amount}</p>
			<p><strong>Original Transaction ID:</strong> {transactionId}</p>
		</div>
		<p>The refund will appear in your account within 3-5 business days.</p>
	</div>
);
