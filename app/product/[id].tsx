import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

import { useCartStore } from '../../src/store/cartStore';



const { width } = Dimensions.get('window');

export default function ProductDetails() {
  const addToCart = useCartStore((state) => state.addToCart);
  const { id } = useLocalSearchParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const ref = doc(db, 'products', id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F0C838" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Nenhum Produto Encontrado</Text>
      </View>
    );
  }

  const images = product.images?.length
    ? product.images
    : [product.imagem];

  const price = Number(product.preco || 0);

  return (
    <ScrollView style={styles.container}>
      {/* BOTÃO VOLTAR */}
<TouchableOpacity
  style={styles.backButton}
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

      {/* IMAGEM PRINCIPAL */}
      <Image
        source={{ uri: images[activeImage] }}
        style={styles.mainImage}
      />
      

      {/* THUMBNAILS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbRow}>
        {images.map((img: string, index: number) => (
          <TouchableOpacity key={index} onPress={() => setActiveImage(index)}>
            <Image
              source={{ uri: img }}
              style={[
                styles.thumb,
                activeImage === index && styles.thumbActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* INFO */}
      <View style={styles.infoBox}>

        <Text style={styles.name}>{product.nome}</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#F0C838" />
          <Text style={styles.rating}>4.8 (128 avaliações)</Text>
        </View>

        <Text style={styles.desc}>
          {product.descricao || 'Produto sem descrição'}
        </Text>

        {/* PRICE */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {price.toLocaleString()} FCFA
          </Text>

          <Text style={styles.oldPrice}>
            {(price * 1.15).toLocaleString()} FCFA
          </Text>

          <View style={styles.discount}>
            <Text style={{ color: '#fff', fontSize: 12 }}>
              -15%
            </Text>
          </View>
        </View>

        {/* QTY */}
        <View style={styles.qtyRow}>
          <Text style={{ fontWeight: 'bold' }}>Quantidade</Text>

          <View style={styles.qtyBox}>
            <TouchableOpacity onPress={() => setQty(qty > 1 ? qty - 1 : 1)}>
              <Text style={styles.qtyBtn}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qty}>{qty}</Text>

            <TouchableOpacity onPress={() => setQty(qty + 1)}>
              <Text style={styles.qtyBtn}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ADD CART */}
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() =>
          addToCart({
          id: product.id,
          nome: product.nome,
          preco: product.preco,
          imagem: product.imagem,
          }, qty)
        }
      >
      <Ionicons name="cart" size={18} color="#fff" />
      <Text style={styles.cartText}>Adicionar ao carrinho</Text>
      </TouchableOpacity>

        <View style={styles.features}>

  <View style={styles.featureItem}>
    <Ionicons
      name="rocket-outline"
      size={18}
      color="#c78200"
    />
    <Text style={styles.featureText}>
      Entrega Rápida
    </Text>
  </View>

  <View style={styles.featureItem}>
    <Ionicons
      name="shield-checkmark-outline"
      size={18}
      color="#c78200"
    />
    <Text style={styles.featureText}>
      Compra Segura
    </Text>
  </View>

  <View style={styles.featureItem}>
    <Ionicons
      name="refresh-circle-outline"
      size={18}
      color="#c78200"
    />
    <Text style={styles.featureText}>
      Devolução facil
    </Text>
  </View>

  </View>

  </View>


  </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  mainImage: {
    width: width,
    height: 320,
    resizeMode: 'cover',
  },

  thumbRow: {
    padding: 10,
  },

  thumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  thumbActive: {
    borderColor: '#F0C838',
  },

  infoBox: {
    padding: 15,
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },

  rating: {
    marginLeft: 5,
    color: '#777',
  },

  desc: {
    marginTop: 10,
    color: '#555',
    lineHeight: 20,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c78200',
  },

  oldPrice: {
    textDecorationLine: 'line-through',
    marginLeft: 10,
    color: '#999',
  },

  discount: {
    backgroundColor: '#F0C838',
    padding: 5,
    borderRadius: 6,
    marginLeft: 10,
  },

  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },

  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 10,
  },

  qtyBtn: {
    fontSize: 20,
    paddingHorizontal: 10,
  },

  qty: {
    fontSize: 16,
    marginHorizontal: 10,
  },

  cartBtn: {
    flexDirection: 'row',
    backgroundColor: '#F0C838',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cartText: {
    marginLeft: 10,
    fontWeight: 'bold',
  },

 features: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
  marginBottom: 20,
},

featureItem: {
  flex: 1,
  alignItems: 'center',
  backgroundColor: '#FFF9E8',
  paddingVertical: 12,
  borderRadius: 12,
  marginHorizontal: 4,
  borderWidth: 1,
  borderColor: '#F5E1A4',
},

featureText: {
  marginTop: 5,
  fontSize: 12,
  fontWeight: '600',
  color: '#444',
},


  backButton: {
  position: 'absolute',
  top: 20,
  left: 20,
  zIndex: 999,
  backgroundColor: 'rgba(255,255,255,0.95)',
  width: 42,
  height: 42,
  borderRadius: 21,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 5,
},
});