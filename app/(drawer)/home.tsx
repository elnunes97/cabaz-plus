import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useNavigation
} from '@react-navigation/native';
import {
  ActivityIndicator,
  Animated,
  StatusBar,
  StyleSheet
} from 'react-native';

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
import { useFavoriteStore } from "../../src/store/favoriteStore";

import Categories from "../../src/components/home/Categories";
import HomeBanner from "../../src/components/home/HomeBanner";
import HomeHeader from "../../src/components/home/HomeHeader";
import ProductGrid from "../../src/components/home/ProductGrid";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categoriesAnim = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);
  const [categoriesVisible, setCategoriesVisible] = useState(true);

  // 🛒 CART STORE
  const addToCart = useCartStore((state) => state.addToCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  const totalItems = getTotalItems ? getTotalItems() : 0;
  // ❤️ FAVORITOS
const toggleFavorite = useFavoriteStore(
  (state) => state.toggleFavorite
);

const isFavorite = useFavoriteStore(
  (state) => state.isFavorite
);

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
      <HomeHeader
        search={search}
        setSearch={setSearch}
      />

      {/* BOTÃO VOLTAR */}

      {/* CATEGORIAS */}
      <Categories
        categories={categorias}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        visible={categoriesVisible}
        animation={categoriesAnim}
      />

      {/* PRODUTOS */}
      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: 15, paddingBottom: 40 }}
      >
        <HomeBanner />
        {/* <Text style={styles.sectionTitle}>Produtos</Text> */}

        {loading ? (
          <ActivityIndicator size="large" color="#F0C838" />
        ) : (
          <ProductGrid
            products={filteredProducts}
            cardWidth={cardWidth}
          />
        )}
      </Animated.ScrollView>

    </SafeAreaView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F6' },
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
  categoryButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  favoriteButton: {
  position: "absolute",
  top: 10,
  right: 10,
  zIndex: 10,
  backgroundColor: "#fff",
  width: 36,
  height: 36,
  borderRadius: 18,
  justifyContent: "center",
  alignItems: "center",
  elevation: 3,
},

  addBtn: {
    marginTop: 8,
    backgroundColor: '#F0C838',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },

});