import { Linking } from 'react-native';
import { useCartStore } from '../store/cartStore';

export const sendWhatsAppOrder = (phone: string) => {
  const items = useCartStore.getState().items;

  if (items.length === 0) return;

  let message = '🛒 *Novo Pedido*\n\n';

  let total = 0;

  items.forEach((item) => {
    message += `• ${item.nome} x${item.qty} = ${item.preco * item.qty} FCFA\n`;
    total += item.preco * item.qty;
  });

  message += `\n💰 *Total: ${total} FCFA*`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  Linking.openURL(url);
};