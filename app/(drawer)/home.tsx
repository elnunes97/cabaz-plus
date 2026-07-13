import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  collection,
  getDocs,
} from 'firebase/firestore';

import {
  auth,
  db,
} from '../../services/firebase';

import { useCartStore } from '../../src/store/cartStore';

export default function HomeScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const { width } = useWindowDimensions();

  const categoriesAnim = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);
  const [categoriesVisible, setCategoriesVisible] = useState(true);

  // 🛒 CART STORE
  const addToCart = useCartStore((state) => state.addToCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  const totalItems = getTotalItems ? getTotalItems() : 0;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, 'products'));

      const lista: any[] = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setProdutos(lista);
    } catch (error) {
      console.log('Erro Firestore:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event: any) => {
    const currentY = event.nativeEvent.contentOffset.y;

    if (currentY > lastScrollY.current && currentY > 50) {
      setCategoriesVisible(false);
      Animated.timing(categoriesAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      setCategoriesVisible(true);
      Animated.timing(categoriesAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }

    lastScrollY.current = currentY;
  };

  let numColumns = 2;
  if (width >= 768) numColumns = 3;
  if (width >= 1024) numColumns = 4;
  if (width >= 1440) numColumns = 5;

  const gap = 10;
  const cardWidth = (width - 40 - (numColumns - 1) * gap) / numColumns;

  const categorias = [
    'Todos',
    ...new Set(produtos.map((item) => item.categoria).filter(Boolean)),
  ];

  const filteredProducts = produtos.filter((produto) => {
    const categoryMatch =
      selectedCategory === 'Todos' ||
      produto.categoria === selectedCategory;

    const normalize = (v: any) =>
      String(v ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const terms = search
      .trim()
      .split(/\s+/)
      .map(normalize)
      .filter(Boolean);

    const haystack = [
      produto.nome,
      produto.categoria,
      produto.descricao,
      //produto.marca,
      Array.isArray(produto.tags) ? produto.tags.join(' ') : produto.tags,
      produto.preco,
    ]
      .map(normalize)
      .join(' ');

    function levenshtein(a: string, b: string) {
      const m = a.length;
      const n = b.length;
      if (m === 0) return n;
      if (n === 0) return m;
      const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;
      for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
        );
      }
      }
      return dp[m][n];
    }

    const searchMatch =
      terms.length === 0 ||
      terms.every((t) => {
      if (haystack.includes(t)) return true;

      const words = haystack.split(/\s+/).filter(Boolean);

      // aceitável até 1 erro ou 25% do tamanho do termo (mínimo 1)
      const maxDist = Math.max(1, Math.floor(t.length * 0.25));

      return words.some((w) => {
        if (w.includes(t)) return true;
        return levenshtein(w, t) <= maxDist;
      });
      });

    return categoryMatch && searchMatch;
  });

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDrawerVisible(true)}>
          <Ionicons name="menu" size={28} color="#111" />
        </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/home')}>
        <Image source={require('../img/cabaz.png')} style={styles.logo}/>
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            placeholder="Pesquisar..."
            placeholderTextColor="#888"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* ❤️ FAVORITOS */}
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart-outline" size={24} color="#111" />
        </TouchableOpacity>

        {/* 🛒 CART COM BADGE */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/cart')}
        >
          <Ionicons name="cart-outline" size={24} color="#111" />

          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* CATEGORIAS */}
      <Animated.View style={[styles.categories, { opacity: categoriesAnim }]}>
        {categoriesVisible && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categorias.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedCategory(item)}
                style={[
                  styles.categoryButton,
                  selectedCategory === item && { backgroundColor: '#111111ff' },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item && { color: '#fff' },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </Animated.View>

      {/* PRODUTOS */}
      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: 15, paddingBottom: 40 }}
      >
        <Image source={require('../img/BANNER.png')} style={styles.banner} />

        {/* <Text style={styles.sectionTitle}>Produtos</Text> */}

        {loading ? (
          <ActivityIndicator size="large" color="#F0C838" />
        ) : (
          <View style={styles.cardContainer}>
            {filteredProducts.map((item) => (
              <View
                key={item.id}
                style={[styles.card, { width: cardWidth }]}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/product/${item.id}`)}
                >
                  <Image
                    source={{
                      uri: item.imagem || 'https://via.placeholder.com/300',
                    }}
                    style={styles.productImage}
                  />

                  <Text numberOfLines={1} style={styles.productTitle}>
                    {item.nome}
                  </Text>

                  <Text style={styles.productCategory}>
                    {item.categoria}
                  </Text>

                  <Text style={styles.productPrice}>
                    {Number(item.preco || 0).toLocaleString()} FCFA
                  </Text>
                </TouchableOpacity>

                {/* ➕ ADD TO CART */}
                <TouchableOpacity
                  onPress={() =>
                    addToCart(
                      {
                        id: item.id,
                        nome: item.nome,
                        preco: Number(item.preco),
                        imagem: item.imagem,
                      },
                      1
                    )
                  }
                  style={styles.addBtn}
                >
                  <Text style={{ fontWeight: 'bold', color: '#111' }}>
                    Adicionar
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </Animated.ScrollView>

      {/* DRAWER (mantido igual) */}
      <Modal animationType="slide" transparent visible={drawerVisible}>
        <View style={styles.overlay}>
            <View style={styles.drawer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDrawerVisible(false)}
            >
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>

            <Text style={styles.userName}>Bem-vindo 👋</Text>

            <MenuItem icon="person-outline" title="Perfil" onPress={()=> router.push("/profile")}/>
            <MenuItem icon="construct-outline" title="Serviços" />
            <MenuItem icon="information-circle-outline" title="Sobre Nos"  onPress={()=> router.push("/sobrenos")}/>
            {/*<MenuItem icon="log-out-outline" title="Logout" onPress={handleLogout} />*/}
            
          </View>

          <Pressable style={styles.backdrop} onPress={() => setDrawerVisible(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* MENU ITEM */
function MenuItem({ icon, title, onPress }: any) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#c78200" />
      <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F6' },

  header: {
    backgroundColor: '#F0C838',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  logo: { width: 50, height: 45, marginHorizontal: 8 },

  searchContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 40,
  },

  searchInput: { flex: 1, marginLeft: 8 },

  iconButton: { marginLeft: 8 },

  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: 'red',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: { color: '#fff', fontSize: 10 },

  categories: { backgroundColor: '#fcf9f3ff', paddingVertical: 10 },

  categoryButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },

  categoryText: { fontWeight: '600' },

  banner: { width: '100%', height: 200, borderRadius: 20, marginBottom: 15 },

  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20 },

  cardContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 10,
    marginBottom: 15,
  },

  productImage: { width: '100%', height: 140, borderRadius: 12 },

  productTitle: { fontWeight: '600', marginTop: 10 },

  productCategory: { color: '#777', fontSize: 12 },

  productPrice: { color: '#c78200', fontWeight: 'bold' },

  addBtn: {
    marginTop: 8,
    backgroundColor: '#F0C838',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },

  overlay: { flex: 1, flexDirection: 'row' },

  drawer: { width: '75%', backgroundColor: '#fff', padding: 20, },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },

  closeButton: { alignSelf: 'flex-end' },

  userName: { textAlign: 'center', fontSize: 18, fontWeight: 'bold' },

  menuItem: { flexDirection: 'row', paddingVertical: 15 },

  menuText: { marginLeft: 15 },
});