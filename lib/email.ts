import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '');

const FROM_EMAIL = process.env.FROM_EMAIL ?? 'noreply@polyodin.com';

export async function sendWelcomeEmail(to: string, displayName: string): Promise<void> {
  await sgMail.send({
    to,
    from: FROM_EMAIL,
    subject: 'Welcome to PolyOdin',
    html: `
      <h1>Welcome to PolyOdin, ${displayName}!</h1>
      <p>Your account has been created successfully. Start trading prediction markets today.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Go to Dashboard</a></p>
    `,
  });
}

export async function sendTradeConfirmation(params: {
  to: string;
  marketName: string;
  outcome: string;
  amount: number;
  price: number;
}): Promise<void> {
  await sgMail.send({
    to: params.to,
    from: FROM_EMAIL,
    subject: `Trade Confirmed: ${params.marketName}`,
    html: `
      <h1>Trade Confirmed</h1>
      <p>Your trade has been executed successfully.</p>
      <ul>
        <li>Market: ${params.marketName}</li>
        <li>Outcome: ${params.outcome}</li>
        <li>Amount: $${params.amount.toFixed(2)}</li>
        <li>Price: ${(params.price * 100).toFixed(1)}¢</li>
      </ul>
    `,
  });
}

export async function sendWithdrawalConfirmation(params: {
  to: string;
  amount: number;
  method: string;
  transactionId: string;
}): Promise<void> {
  await sgMail.send({
    to: params.to,
    from: FROM_EMAIL,
    subject: 'Withdrawal Confirmed',
    html: `
      <h1>Withdrawal Confirmed</h1>
      <p>Your withdrawal of $${params.amount.toFixed(2)} via ${params.method} has been processed.</p>
      <p>Transaction ID: ${params.transactionId}</p>
    `,
  });
}

export async function sendContactFormNotification(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
}): Promise<void> {
  await sgMail.send({
    to: process.env.SUPPORT_EMAIL ?? FROM_EMAIL,
    from: FROM_EMAIL,
    replyTo: params.email,
    subject: `[${params.type.toUpperCase()}] ${params.subject}`,
    html: `
      <h1>New Contact Form Submission</h1>
      <p><strong>From:</strong> ${params.name} (${params.email})</p>
      <p><strong>Type:</strong> ${params.type}</p>
      <p><strong>Subject:</strong> ${params.subject}</p>
      <hr />
      <p>${params.message.replace(/\n/g, '<br>')}</p>
    `,
  });
}
