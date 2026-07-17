import React from 'react';
import {
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SobreNos() {
    const router = useRouter();

    const openEmail = () => {
        Linking.openURL('mailto:suporte@cabazplus.com?subject=Contacto%20Cabaz%20Plus');
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    {/* HERO */}
                    <Image source={require('../img/cabaz.png')} style={styles.heroImage} resizeMode="contain" />
                {/* TÍTULO */}
                <Text style={styles.title}>Sobre o Cabaz Plus</Text>

                <Text style={styles.description}>
                    O Cabaz Plus nasceu com o objetivo de tornar as compras mais simples, rápidas e acessíveis para todos.
                </Text>

                {/* MISSÃO */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="rocket-outline" size={22} color="#c78200" />
                        <Text style={styles.cardTitle}>Nossa Missão</Text>
                    </View>

                    <Text style={styles.cardText}>
                        Facilitar o acesso a produtos de qualidade através de uma experiência digital moderna, segura e prática.
                    </Text>
                </View>

                {/* VISÃO */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="eye-outline" size={22} color="#c78200" />
                        <Text style={styles.cardTitle}>Nossa Visão</Text>
                    </View>

                    <Text style={styles.cardText}>
                        Tornar-nos a plataforma de referência para compras online na Guiné-Bissau, aproximando clientes e comerciantes.
                    </Text>
                </View>

                {/* VALORES */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="heart-outline" size={22} color="#c78200" />
                        <Text style={styles.cardTitle}>Nossos Valores</Text>
                    </View>

                    <Text style={styles.cardText}>
                        • Confiança{"\n"}• Transparência{"\n"}• Inovação{"\n"}• Qualidade{"\n"}• Proximidade com o cliente
                    </Text>
                </View>

                {/* ESTATÍSTICAS */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>100+</Text>
                        <Text style={styles.statLabel}>Produtos</Text>
                    </View>

                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>24/7</Text>
                        <Text style={styles.statLabel}>Suporte</Text>
                    </View>

                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>100%</Text>
                        <Text style={styles.statLabel}>Seguro</Text>
                    </View>
                </View>

                {/* CONTACTO */}
                <TouchableOpacity style={styles.contactButton} onPress={openEmail}>
                    <Ionicons name="mail-outline" size={20} color="#fff" />
                    <Text style={styles.contactText}>Contacte-nos</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Cabaz Plus • Versão 1.0.0</Text>

                <Text style={styles.footer}>© {new Date().getFullYear()} Cabaz Plus</Text>
            </ScrollView>

            {/* BOTÃO VOLTAR (renderizado por último para ficar por cima) */}
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
                <Ionicons name="arrow-back" size={24} color="#111" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        padding: 20,
    },

    backBtn: {
        position: 'absolute',
        top: 30,
        left: 20,
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },

    heroImage: {
        width: '100%',
        height: 220,
        marginTop: 80,
        marginBottom: 15,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#111',
    },

    description: {
        textAlign: 'center',
        color: '#666',
        marginTop: 10,
        marginBottom: 25,
        lineHeight: 22,
    },

    card: {
        backgroundColor: '#FFF',
        borderRadius: 18,
        padding: 18,
        marginBottom: 15,
        elevation: 2,
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    cardTitle: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
    },

    cardText: {
        color: '#555',
        lineHeight: 22,
    },

    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },

    statBox: {
        flex: 1,
        backgroundColor: '#FFF',
        marginHorizontal: 5,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 2,
    },

    statNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#c78200',
    },

    statLabel: {
        marginTop: 5,
        color: '#666',
        fontSize: 13,
    },

    contactButton: {
        backgroundColor: '#F0C838',
        padding: 16,
        borderRadius: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    contactText: {
        marginLeft: 8,
        fontWeight: 'bold',
        color: '#111',
        fontSize: 16,
    },

    version: {
        textAlign: 'center',
        marginTop: 25,
        color: '#777',
    },

    footer: {
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 30,
        color: '#999',
    },
});
