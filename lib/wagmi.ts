import { createConfig, http } from 'wagmi';
import { polygon, mainnet } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [polygon, mainnet],
  connectors: [metaMask()],
  transports: {
    [polygon.id]: http(),
    [mainnet.id]: http(),
  },
});
