import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isValidDate, getRandomDate } from '../utils/dateUtils';
import { fetchHistoricalFact, HistoryItem } from '../services/api';
import HistoryItemComponent from '../components/HistoryItem';

export default function HomeScreen() {
    const [dateInput, setDateInput] = useState('');
    const [currentFact, setCurrentFact] = useState('');
    const [searchHistory, setSearchHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);

    
    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const historyString = await AsyncStorage.getItem('history');
            if (historyString) {
                setSearchHistory(JSON.parse(historyString));
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        } finally {
            setHistoryLoading(false);
        }
    };

    const saveHistory = async (history: HistoryItem[]) => {
        try {
            await AsyncStorage.setItem('history', JSON.stringify(history));
        } catch (error) {
            console.error('Erro ao salvar histórico:', error);
        }
    };

    const handleDiscover = async () => {
        const date = dateInput.trim();
        
        if (!date) {
            Alert.alert('Atenção', 'Por favor, digite uma data no formato DD/MM');
            return;
        }
        
        if (!isValidDate(date)) {
            Alert.alert('Data inválida', 'Use o formato DD/MM (ex.: 25/12)');
            return;
        }
        
        setLoading(true);
        try {
            const fact = await fetchHistoricalFact(date);
            setCurrentFact(fact);
            
            const newHistoryItem: HistoryItem = { date, fact };
            const updatedHistory = [...searchHistory, newHistoryItem].slice(-10); // Mantém apenas os últimos 10
            setSearchHistory(updatedHistory);
            await saveHistory(updatedHistory);
        } finally {
            setLoading(false);
        }
    };

    const handleSurprise = async () => {
        const randomDate = getRandomDate();
        setDateInput(randomDate);
        
        setLoading(true);
        try {
            const fact = await fetchHistoricalFact(randomDate);
            setCurrentFact(fact);
            
            const newHistoryItem: HistoryItem = { date: randomDate, fact };
            const updatedHistory = [...searchHistory, newHistoryItem].slice(-10);
            setSearchHistory(updatedHistory);
            await saveHistory(updatedHistory);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Hoje na História</Text>
                <Text style={styles.subtitle}>Descubra fatos interessantes sobre qualquer data!</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Portal da Data</Text>
                </View>
                
                <View style={styles.cardBody}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Digite uma data... (ex.: 25/12)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM"
                            value={dateInput}
                            onChangeText={setDateInput}
                            placeholderTextColor="#999"
                        />
                        
                        <TouchableOpacity
                            style={[styles.button, styles.discoverButton]}
                            onPress={handleDiscover}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.buttonText}>Descobrir Curiosidade!</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.factContainer}>
                        <View style={styles.factDisplay}>
                            <Text style={styles.factText}>
                                {currentFact || 'Escolha uma data e descubra algo surpreendente!'}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, styles.surpriseButton]}
                            onPress={handleSurprise}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>Me surpreenda!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Histórico Recente</Text>
                </View>
                
                <View style={styles.cardBody}>
                    {historyLoading ? (
                        <ActivityIndicator size="small" color="#4776E6" />
                    ) : searchHistory.length === 0 ? (
                        <Text style={styles.noHistory}>Nenhuma busca realizada ainda</Text>
                    ) : (
                        searchHistory.slice().reverse().map((item, index) => (
                            <HistoryItemComponent
                                key={`${item.date}-${index}`}
                                date={item.date}
                                fact={item.fact}
                            />
                        ))
                    )}
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Powered by Wikipedia API</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6a11cb', 
    },
    header: {
        alignItems: 'center',
        marginVertical: 30,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 25,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    cardHeader: {
        backgroundColor: '#4776E6', 
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFF',
    },
    cardBody: {
        padding: 25,
    },
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#555',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#e1e5ee',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        color: '#333',
    },
    button: {
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    discoverButton: {
        backgroundColor: '#4776E6', 
        borderColor: '#000', 
        elevation: 8, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    surpriseButton: {
        backgroundColor: '#4776E6', 
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700', 
        textShadowColor: 'rgba(0, 0, 0, 0.3)', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    factContainer: {
        marginVertical: 25,
        minHeight: 100,
    },
    factDisplay: {
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#4776E6',
    },
    factText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
    },
    actions: {
        alignItems: 'center',
    },
    noHistory: {
        textAlign: 'center',
        color: '#888',
        fontStyle: 'italic',
        padding: 20,
        fontSize: 16,
    },
    footer: {
        alignItems: 'center',
        marginVertical: 30,
        paddingHorizontal: 20,
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
});