import React from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCartStore } from '../../src/store/cartStore';

export default function CartScreen() {
  const items = useCartStore((state) => state.items);

  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  );

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const getTotal = useCartStore(
    (state) => state.getTotal
  );

  const increaseQty = useCartStore(
    (state) => state.addToCart
  );

  const decreaseQty = useCartStore(
    (state) => state.decreaseQty
  );

  const total = getTotal();

  const sendWhatsAppOrder = () => {
    if (items.length === 0) {
      Alert.alert('Carrinho vazio');
      return;
    }

    let message =
      '🛒 *Novo Pedido*\n\n';

    items.forEach((item) => {
      message += `• ${item.nome} x${item.qty} = ${
        item.preco * item.qty
      } FCFA\n`;
    });

    message += `\n💰 *Total:* ${total} FCFA`;

    const phone = '245957780807';

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;

    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* VOLTAR */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/home');
          }
        }}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="#111"
        />
      </TouchableOpacity>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../img/cabaz vazio.png')}
            style={styles.emptyImage}
            resizeMode="contain"
          />

          <Text style={styles.empty}>
            Carrinho vazio
          </Text>

          <Text style={styles.emptySubText}>
            Adicione produtos ao seu carrinho
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 140,
          }}
        >
          {items.map((item) => (
            <View
              key={item.id}
              style={styles.card}
            >
              {/* REMOVER */}
              <TouchableOpacity
                style={styles.removeIcon}
                onPress={() =>
                  removeFromCart(item.id)
                }
              >
                <Ionicons
                  name="close"
                  size={20}
                  color="#ff3b30"
                />
              </TouchableOpacity>

              <Image
                source={{
                  uri: item.imagem,
                }}
                style={styles.image}
              />

              <View
                style={{
                  flex: 1,
                  marginLeft: 10,
                }}
              >
                <Text style={styles.name}>
                  {item.nome}
                </Text>

                <Text style={styles.price}>
                  {item.preco} FCFA
                </Text>

                <Text style={styles.subTotal}>
                  Subtotal:{' '}
                  {item.preco * item.qty}{' '}
                  FCFA
                </Text>

                {/* QUANTIDADE */}
                <View
                  style={styles.actions}
                >
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() =>
                      decreaseQty(
                        item.id
                      )
                    }
                  >
                    <Text
                      style={
                        styles.qtyText
                      }
                    >
                      −
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={
                      styles.qtyNumber
                    }
                  >
                    {item.qty}
                  </Text>

                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() =>
                      increaseQty(
                        {
                          id: item.id,
                          nome: item.nome,
                          preco:
                            item.preco,
                          imagem:
                            item.imagem,
                        },
                        1
                      )
                    }
                  >
                    <Text
                      style={
                        styles.qtyText
                      }
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.totalBox}>
            <Text
              style={styles.totalText}
            >
              Total: {total} FCFA
            </Text>
          </View>
        </ScrollView>
      )}

      {items.length > 0 && (
        <>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={
              sendWhatsAppOrder
            }
          >
            <Ionicons
              name="logo-whatsapp"
              size={20}
              color="#fff"
            />

            <Text
              style={
                styles.checkoutText
              }
            >
              Finalizar no WhatsApp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={clearCart}
            style={styles.clearBtn}
          >
            <Text
              style={{
                color: '#ff3b30',
                textAlign:
                  'center',
                fontWeight:
                  '600',
              }}
            >
              Limpar carrinho
            </Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    padding: 15,
  },

  backBtn: {
    marginBottom: 15,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyImage: {
    width: 280,
    height: 130,
  },

  empty: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 10,
  },

  emptySubText: {
    color: '#999',
    fontSize: 14,
    marginTop: 5,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
    position: 'relative',
  },

  removeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  name: {
    fontWeight: 'bold',
    fontSize: 15,
  },

  price: {
    color: '#666',
    marginTop: 4,
  },

  subTotal: {
    color: '#c78200',
    fontWeight: 'bold',
    marginTop: 4,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#F0C838',
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },

  qtyNumber: {
    marginHorizontal: 14,
    fontSize: 16,
    fontWeight: 'bold',
  },

  totalBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  checkoutBtn: {
    position: 'absolute',
    bottom: 60,
    left: 15,
    right: 15,
    backgroundColor: '#25D366',
    padding: 15,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkoutText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },

  clearBtn: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
  },
});