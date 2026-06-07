import { generateNonce, SiweMessage } from 'siwe';
import { db } from './db';

export { generateNonce };

export async function verifyEthSignature(params: {
  walletAddress: string;
  signature: string;
  message: string;
}): Promise<boolean> {
  try {
    const siweMessage = new SiweMessage(params.message);
    const result = await siweMessage.verify({
      signature: params.signature,
      domain: process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '') ?? 'localhost:3000',
    });

    if (!result.success) return false;
    if (result.data.address.toLowerCase() !== params.walletAddress.toLowerCase()) return false;

    const user = await db.user.findUnique({
      where: { walletAddress: params.walletAddress.toLowerCase() },
    });

    if (!user || siweMessage.nonce !== user.nonce) return false;

    return true;
  } catch {
    return false;
  }
}

export function buildSiweMessage(params: {
  walletAddress: string;
  nonce: string;
  chainId: number;
}): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const domain = appUrl.replace('https://', '').replace('http://', '');

  const message = new SiweMessage({
    domain,
    address: params.walletAddress,
    statement: 'Sign in to PolyOdin - Prediction Market Trading Platform',
    uri: appUrl,
    version: '1',
    chainId: params.chainId,
    nonce: params.nonce,
    issuedAt: new Date().toISOString(),
    expirationTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });

  return message.prepareMessage();
}
