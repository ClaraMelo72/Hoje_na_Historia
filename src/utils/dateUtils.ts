export function isValidDate(dateString: string): boolean {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;
    if (!regex.test(dateString)) return false;
    
    const [day, month] = dateString.split('/').map(Number);
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    return day <= daysInMonth[month - 1];
}

export function getRandomDate(): string {
    const day = Math.floor(Math.random() * 28) + 1;
    const month = Math.floor(Math.random() * 12) + 1;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`;
}

export function getFallbackFact(date: string): string {
    const [day, month] = date.split('/').map(Number);
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const fallbackFacts: Record<string, string> = {
        '25/12': 'Em 25 de dezembro é celebrado o Natal, data do nascimento de Jesus Cristo segundo a tradição cristã.',
        '01/01': '1º de janeiro marca o início do ano novo no calendário gregoriano.',
        '07/09': 'Em 7 de setembro de 1822, o Brasil declarou sua independência de Portugal.',
        '21/04': 'Em 21 de abril de 1960, Brasília foi inaugurada como capital do Brasil.',
        '15/11': 'Em 15 de novembro de 1889, foi proclamada a República do Brasil.',
        '12/10': '12 de outubro é o dia de Nossa Senhora Aparecida, padroeira do Brasil.',
        '02/11': '2 de novembro é o Dia de Finados, data de homenagem aos falecidos.',
        '01/04': '1º de abril é conhecido como Dia da Mentira em muitos países.',
        '14/02': '14 de fevereiro é celebrado o Dia dos Namorados em muitos países.',
        '31/10': '31 de outubro é comemorado o Halloween em países de língua inglesa.'
    };
    
    if (fallbackFacts[date]) {
        return fallbackFacts[date];
    }
    
    const facts = [
        `No dia ${day} de ${monthNames[month-1]} ocorreram diversos eventos históricos ao longo dos séculos.`,
        `Muitos fatos importantes marcaram o dia ${day} de ${monthNames[month-1]} na história mundial.`,
        `O dia ${day} de ${monthNames[month-1]} testemunhou conquistas e descobertas significativas.`,
        `Vários eventos históricos transformaram o mundo no dia ${day} de ${monthNames[month-1]}.`
    ];
    
    return facts[Math.floor(Math.random() * facts.length)];
}