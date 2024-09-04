import { polygon, optimism, arbitrum, base } from 'wagmi/chains';
import ArbitrumIcon from "../assets/networks/arbitrum.svg";
import OptimismIcon from "../assets/networks/optimism.svg";
import PolygonIcon from "../assets/networks/polygon.svg";
import BaseIcon from "../assets/networks/base.svg";


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

export function getChainIcon(chainId: number) {
  switch (chainId) {
    case 42161:
      return ArbitrumIcon;
    case 137:
      return PolygonIcon;
    case 10:
      return OptimismIcon;
    case 8453:
      return BaseIcon;
    default:
      return null;
  }
};