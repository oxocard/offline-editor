import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

/* Interfaces */
interface Cartridge {
  id: string;
  name: string;
}

/* Styles */
const CartridgeInfoContainer = styled('div')`
  width: 40rem;
  margin-left: 2rem;
  font-size: 1.6rem;

  h1 {
    /* text-align: center; */
    color: #fff;
    font-size: 1.8rem;
  }
`;

export default function CartridgeInfo({ cartridge }: { cartridge: Cartridge }) {
  const { t } = useTranslation();

  let name = cartridge.name;

  switch (cartridge.id) {
    case '00000010':
      name = 'Veroboard';
      break;
    case '00000015':
      name = 'Breadboard';
      break;
    case '00000020':
      name = 'ToF';
      break;
    case '00000030':
      name = 'Air';
      break;
    case '00000040':
      name = 'Connector';
      break;
    case '00000050':
      name = 'Expansion';
      break;
    case '00000060':
      name = 'Pixelmatrix';
      break;
    case '00000070':
      name = 'Synthesizer';
      break;
  }

  return (
    <CartridgeInfoContainer>
      <h1>{t('cartridge_info_title', { name })}</h1>
    </CartridgeInfoContainer>
  );
}
