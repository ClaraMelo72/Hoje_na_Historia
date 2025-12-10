import { getFallbackFact } from '../utils/dateUtils';

export interface HistoryItem {
    date: string;
    fact: string;
}

export async function fetchHistoricalFact(date: string): Promise<string> {
    try {
        const [day, month] = date.split('/').map(Number);
        
        // Usar Wikipedia API para buscar eventos do dia
        const response = await fetch(
            `https://api.wikimedia.org/feed/v1/wikipedia/pt/onthisday/events/${month}/${day}`
        );
        
        if (!response.ok) {
            throw new Error('Erro ao buscar dados da API');
        }
        
        const data = await response.json();
        
        if (data.events && data.events.length > 0) {
            // Pegar um evento aleatório
            const randomEvent = data.events[Math.floor(Math.random() * data.events.length)];
            const year = randomEvent.year;
            const text = randomEvent.text;
            
            return `Em ${year}: ${text}`;
        } else {
            return getFallbackFact(date);
        }
    } catch (error) {
        console.error('Erro na API:', error);
        return getFallbackFact(date);
    }
}