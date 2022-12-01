import { ChainId } from "app/config/chain";

const KardiaLogo = 'https://raw.githubusercontent.com/kardia-solutions/kaidex-v3-tokens/master/token-logos/0xAF984E23EAA3E7967F3C5E007fbe397D8566D23d.png';
const BNBLogo = 'https://raw.githubusercontent.com/kardia-solutions/kaidex-v3-tokens/master/token-logos/0xB44a9B6905aF7c801311e8F4E76932ee959c663C.png';

const LOGO: Record<number, string> = {
  [ChainId.KARDIACHAIN]: KardiaLogo,
  [ChainId.BSC]: BNBLogo
}

export const CHAIN_LOGOS = LOGO;