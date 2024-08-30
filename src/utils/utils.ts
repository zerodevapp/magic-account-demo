import { polygon, optimism, arbitrum, base } from 'wagmi/chains';

export function chainNameFromId(chainId: number): string {
  switch (chainId) {
    case polygon.id:
      return 'Polygon';
    case optimism.id:
      return 'Optimism';
    case arbitrum.id:
      return 'Arbitrum';
    case base.id:
      return 'Base';
    default:
      return 'Unknown Chain';
  }
}