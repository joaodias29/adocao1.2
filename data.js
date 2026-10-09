window.App = window.App || {};
window.App.data = {
    ong: {
        nome: "Abrigo Esperança",
        telefone: "5511999999999",
        telefoneDisplay: "(11) 99999-9999",
        endereco: "Rua do Cuidado, 123, Bairro Acolhimento, São Paulo - SP",
        horario: "Segunda a Sábado, das 09h às 17h",
        pin: "1234" // Autenticação de demonstração
    },
    // Seeders default - carregados via services para o localStorage
    pets: [
        { 
            id: "1", slug: "bob", name: "Bob", species: "dog", ageYears: 5, size: "médio", 
            personality: ["carinhoso", "tranquilo"], highlight: "O companheiro perfeito para tardes calmas.", 
            story: "Bob foi resgatado após ser deixado em uma praça. Ele é dócil e adora ficar deitado ao lado das pessoas. Seu olhar transmite paz e gratidão.", 
            traits: ["Vacinado", "Castrado", "Microchipado"], idealHome: ["apartamento"], timeNeeded: "pouco",
            photos: ["https://images.unsplash.com/photo-1543466835-00a73417ab05?auto=format&fit=crop&w=800&q=80"], 
            status: "disponivel"
        },
        { 
            id: "2", slug: "luna", name: "Luna", species: "cat", ageYears: 2, size: "pequeno", 
            personality: ["brincalhao", "carinhoso"], highlight: "Uma gatinha cheia de energia e amor.", 
            story: "Luna é curiosa e adora explorar a casa. Ela foi encontrada com os irmãos e é a mais brincalhona.", 
            traits: ["Vacinada", "Castrada"], idealHome: ["apartamento"], timeNeeded: "algumas-horas", 
            photos: ["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80"], 
            status: "disponivel"
        },
        { 
            id: "3", slug: "thor", name: "Thor", species: "dog", ageYears: 3, size: "grande", 
            personality: ["tranquilo", "protetor"], highlight: "Um gigante muito gentil.", 
            story: "Thor assusta pelo tamanho, mas tem coração de filhote. Ele é muito protetor e adora caminhadas calmas.", 
            traits: ["Vacinado", "Castrado"], idealHome: ["casa"], timeNeeded: "pouco", 
            photos: ["https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80"], 
            status: "disponivel"
        },
        { 
            id: "4", slug: "mel", name: "Mel", species: "dog", ageYears: 1, size: "pequeno", 
            personality: ["brincalhao"], highlight: "Alegria em forma de cachorrinha.", 
            story: "Mel é pura energia. Adora correr atrás de bolinhas e precisa de alguém com disposição.", 
            traits: ["Vacinada"], idealHome: ["casa", "apartamento"], timeNeeded: "grande-parte", 
            photos: ["https://images.unsplash.com/photo-1537151608804-ea6f1155940c?auto=format&fit=crop&w=800&q=80"], 
            status: "em-processo" // Exemplificando um já em processo
        },
        { 
            id: "5", slug: "max", name: "Max", species: "dog", ageYears: 7, size: "grande", 
            personality: ["carinhoso"], highlight: "Um senhor muito educado.", 
            story: "Max é maduro e já não tem energia para correr a casa toda, mas tem amor de sobra para dar.", 
            traits: ["Vacinado", "Castrado", "Calmo"], idealHome: ["casa"], timeNeeded: "algumas-horas", 
            photos: ["https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80"], 
            status: "adotado" // Exemplificando um recém adotado
        }
    ],
    stories: [
        { name: "Dona Maria & Tico", quote: "A casa estava muito silenciosa. O Tico trouxe alegria e um motivo para sorrir todos os dias.", photo: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=400&q=80" },
        { name: "Sr. João & Bela", quote: "Achei que estava velho para ter um cachorro, mas a Bela é tão calma que somos parceiros perfeitos.", photo: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80" }
    ],
    faq: [
        { q: "Como faço para adotar?", a: "É muito simples! Encontre um pet disponível na nossa plataforma e clique no botão do WhatsApp." },
        { q: "A adoção tem algum custo?", a: "A adoção em si é gratuita. Algumas ONGs podem pedir uma pequena ajuda opcional e solidária." },
        { q: "O que a ONG vai me perguntar?", a: "Faremos perguntas sobre sua rotina e residência apenas para garantir o melhor fit para o animal." },
        { q: "E se o pet já estiver em processo de adoção?", a: "Pets com a etiqueta 'Em conversa com uma família' já estão sendo entrevistados. Mas temos outros esperando por você!" }
    ]
};

// Auto-seed da demonstração se o localStorage for 0.
window.App.data.loadDemoData = function() {
    localStorage.removeItem('cc_pets');
    localStorage.removeItem('cc_leads');
    localStorage.removeItem('cc_messages');
    localStorage.removeItem('cc_adoptions');
    
    // As injeções nativas ocorrem ao ler getPets no services.
    alert('Dados de demonstração restaurados.');
    window.location.reload();
};
