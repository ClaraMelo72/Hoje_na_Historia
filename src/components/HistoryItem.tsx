import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HistoryItemProps {
    date: string;
    fact: string;
}

export default function HistoryItem({ date, fact }: HistoryItemProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.fact}>{fact}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#8E54E9',
    },
    date: {
        fontWeight: '600',
        color: '#4776E6',
        marginBottom: 5,
        fontSize: 14,
    },
    fact: {
        fontSize: 14,
        lineHeight: 20,
        color: '#555',
    },
});