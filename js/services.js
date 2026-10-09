window.App.services = {
    // --- PETS (CRUD Persistido) ---
    getPets: () => {
        let saved = localStorage.getItem('cc_pets');
        if (!saved) {
            localStorage.setItem('cc_pets', JSON.stringify(window.App.data.pets));
            return window.App.data.pets;
        }
        return JSON.parse(saved);
    },
    getPetBySlug: (slug) => window.App.services.getPets().find(p => p.slug === slug),
    getPetById: (id) => window.App.services.getPets().find(p => p.id === id),
    savePet: (petObj) => {
        let pets = window.App.services.getPets();
        const idx = pets.findIndex(p => p.id === petObj.id);
        if (idx >= 0) pets[idx] = petObj;
        else pets.push(petObj);
        localStorage.setItem('cc_pets', JSON.stringify(pets));
    },
    updatePetStatus: (id, status) => {
        let pet = window.App.services.getPetById(id);
        if (pet) {
            pet.status = status;
            window.App.services.savePet(pet);
        }
    },

    getOng: () => window.App.data.ong,
    
    // --- QUIZ ---
    saveQuizAnswer: (question, answer) => {
        let answers = JSON.parse(localStorage.getItem('quizAnswers')) || {};
        answers[question] = answer;
        localStorage.setItem('quizAnswers', JSON.stringify(answers));
    },
    getQuizAnswers: () => JSON.parse(localStorage.getItem('quizAnswers')) || {},
    clearQuizAnswers: () => {
        localStorage.removeItem('quizAnswers');
        localStorage.removeItem('cc_lastMatch');
    },
    saveMatch: (matchData) => localStorage.setItem('cc_lastMatch', JSON.stringify(matchData)),
    getLastMatch: () => JSON.parse(localStorage.getItem('cc_lastMatch') || 'null'),

    // --- MENSAGENS (Fale Conosco) ---
    saveMessage: (msgObj) => {
        const msgs = JSON.parse(localStorage.getItem('cc_messages')) || [];
        msgObj.id = Date.now().toString();
        msgObj.date = new Date().toISOString();
        msgObj.status = 'Nova';
        msgs.push(msgObj);
        localStorage.setItem('cc_messages', JSON.stringify(msgs));
    },
    getMessages: () => JSON.parse(localStorage.getItem('cc_messages')) || [],
    deleteMessage: (id) => {
        let msgs = window.App.services.getMessages().filter(m => m.id !== id);
        localStorage.setItem('cc_messages', JSON.stringify(msgs));
    },

    // --- LEADS ---
    saveLeadEvent: (eventObj) => {
        const leads = JSON.parse(localStorage.getItem('cc_leads')) || [];
        eventObj.id = Date.now().toString();
        leads.push(eventObj);
        localStorage.setItem('cc_leads', JSON.stringify(leads));
    },
    getLeadEvents: () => JSON.parse(localStorage.getItem('cc_leads')) || [],

    // --- ADOÇÕES ---
    getAdoptions: () => JSON.parse(localStorage.getItem('cc_adoptions')) || [],
    createAdoption: (data) => {
        const ads = window.App.services.getAdoptions();
        // Regra de Negócio: Impedir adoções duplas ativas
        const isActive = ads.find(a => a.petId === data.petId && a.stage !== 'cancelada' && a.stage !== 'concluida');
        if (isActive) return { success: false, error: 'O animal já possui uma adoção em andamento.' };

        const ad = {
            id: Date.now().toString(),
            ...data,
            stage: 'analise',
            stageDates: { analise: Date.now() },
            createdAt: Date.now(), updatedAt: Date.now()
        };
        ads.push(ad);
        localStorage.setItem('cc_adoptions', JSON.stringify(ads));
        
        // Regra de Negócio: Muda o Pet para "em-processo"
        window.App.services.updatePetStatus(data.petId, 'em-processo');
        return { success: true };
    },
    updateAdoptionStage: (id, stage) => {
        const ads = window.App.services.getAdoptions();
        let ad = ads.find(a => a.id === id);
        if (ad) {
            ad.stage = stage;
            ad.stageDates[stage] = Date.now();
            ad.updatedAt = Date.now();
            localStorage.setItem('cc_adoptions', JSON.stringify(ads));

            // Efeito colateral no Pet
            if (stage === 'concluida') window.App.services.updatePetStatus(ad.petId, 'adotado');
            if (stage === 'cancelada') window.App.services.updatePetStatus(ad.petId, 'disponivel');
        }
    }
};
