window.App.screens = {};

function renderApp(content) {
    const root = document.getElementById('app-root');
    root.innerHTML = `<div class="fade-in w-full pb-10 px-4">${content}</div>`;
    window.scrollTo(0, 0);
}

// --- HOME ---
window.App.screens.HomeScreen = function() {
    const allPets = window.App.services.getPets();
    // Apenas pets disponíveis ou em processo
    const pets = allPets.filter(p => p.status === 'disponivel' || p.status === 'em-processo').slice(0, 3);
    
    // Pets adotados viram Histórias em Destaque Dinâmicas
    const adoptedPets = allPets.filter(p => p.status === 'adotado').map(p => ({
        name: `${p.name} & Sua Nova Família`, 
        quote: `O ${p.name} encontrou um lar cheio de amor. Agradecemos a todos pela torcida!`,
        photo: p.photos[0],
        isAdopted: true
    }));
    const stories = [...window.App.data.stories, ...adoptedPets].slice(0, 4);

    if (pets.length === 0) {
        return renderApp(`
            <div class="text-center mt-20 pt-8 max-w-lg mx-auto">
                <div class="text-7xl mb-8">❤️</div>
                <h2 class="text-4xl font-extrabold text-brand-dark mb-4">Que alegria!</h2>
                <p class="mb-10 text-xl text-gray-700">No momento todos os nossos pets estão em conversa ou já ganharam um lar. Fale conosco para saber das novidades ou ser avisado de novos resgates.</p>
                ${window.App.ui.Button({ label: 'Falar com a ONG', href: '#/contato', variant: 'whatsapp', fullWidth: true })}
            </div>
        `);
    }

    renderApp(`
        <div class="flex flex-col gap-12 sm:gap-16 pt-8">
            <section class="flex flex-col gap-6 text-center">
                <h1 class="text-4xl font-extrabold text-brand-dark leading-[1.2]">
                    Encontrar a minha companhia perfeita
                </h1>
                <p class="text-xl text-brand-dark opacity-90 mx-auto">
                    Adoção é sobre começar uma nova e feliz história juntos. Descubra o pet ideal para você.
                </p>
                <div class="flex flex-col gap-4 mt-4 justify-center">
                    ${window.App.ui.Button({ label: 'Encontrar companhia (Quiz)', href: '#/encontrar', variant: 'primary' })}
                    ${window.App.ui.Button({ label: 'Ver pets disponíveis', href: '#/pets', variant: 'secondary' })}
                </div>
            </section>
            
            <section class="bg-brand-softTeal p-8 rounded-3xl shadow-sm border border-teal-100 mx-[-1rem] px-[1rem]">
                <h2 class="text-3xl font-extrabold mb-8 text-brand-dark text-center">Histórias que inspiram</h2>
                <div class="flex flex-col gap-6">
                    ${stories.map(s => window.App.ui.StoryCard(s)).join('')}
                </div>
            </section>

            <section>
                <h2 class="text-3xl font-extrabold text-brand-dark mb-6 text-center">Pets perto de você</h2>
                <div class="flex flex-col gap-6">
                    ${pets.map(p => window.App.ui.PetCard(p)).join('')}
                </div>
                <div class="mt-6 text-center">
                    <a href="#/pets" class="font-bold text-brand-primary underline text-xl min-h-[48px] inline-flex items-center">Ver todos os pets</a>
                </div>
            </section>

            <section class="max-w-4xl mx-auto w-full">
                <h2 class="text-3xl font-extrabold mb-8 text-brand-dark text-center">Dúvidas Comuns</h2>
                <div class="flex flex-col gap-2">
                    ${window.App.data.faq.map(f => window.App.ui.AccordionItem(f.q, f.a)).join('')}
                </div>
            </section>
        </div>
    `);
};

// --- LISTA PETS ---
window.App.screens.PetsScreen = function() {
    const pets = window.App.services.getPets().filter(p => p.status === 'disponivel' || p.status === 'em-processo');
    renderApp(`
        <nav class="mb-6 pt-4">
            <a href="javascript:history.back()" class="text-brand-primary font-bold text-xl min-h-[60px] inline-flex items-center gap-2 underline px-2 py-2 -ml-2 rounded">← Voltar</a>
        </nav>
        <h1 class="text-4xl font-extrabold text-brand-dark mb-8 text-center">Todos os Pets</h1>
        <div class="flex flex-col gap-8">
            ${pets.map(p => window.App.ui.PetCard(p)).join('')}
        </div>
    `);
};

// --- PERFIL DO PET ---
window.App.screens.PetProfileScreen = function(slug) {
    const pet = window.App.services.getPetBySlug(slug);
    if (!pet || pet.status === 'indisponivel' || pet.status === 'adotado') return window.App.router.handleRoute('#/');

    const lastMatch = window.App.services.getLastMatch();
    const isMatch = lastMatch && lastMatch.match && lastMatch.match.pet.slug === slug;
    
    // Regra de Negócio: Em Processo bloqueia Interesse
    const isProcess = pet.status === 'em-processo';

    window.App.lib.trackEvent('pet_viewed', { petId: pet.id, petName: pet.name });

    renderApp(`
        <nav class="mb-4 pt-4">
            <a href="javascript:history.back()" class="text-brand-primary font-bold text-xl min-h-[60px] inline-flex items-center gap-2 underline px-2 py-2 -ml-2 rounded">← Voltar</a>
        </nav>
        
        <div class="bg-brand-card rounded-3xl overflow-hidden shadow-xl border border-gray-200 flex flex-col relative mx-[-1rem]">
            ${isMatch ? window.App.ui.MatchBanner(lastMatch.match.reasons) : ''}
            <div class="relative bg-gray-100">
                <img src="${pet.photos[0]}" alt="Foto" class="w-full h-[350px] object-cover">
            </div>
            
            <div class="p-6">
                <h1 class="text-5xl font-extrabold text-brand-dark mb-2">${pet.name}</h1>
                <p class="text-2xl text-brand-dark opacity-90 font-semibold mb-6">${pet.highlight}</p>
                
                <div class="flex flex-wrap gap-2 mb-6">
                    <span class="px-4 py-2 bg-brand-softOrange text-brand-highlight font-bold rounded-xl border border-orange-200 text-lg">${pet.ageYears} anos</span>
                    <span class="px-4 py-2 bg-brand-softTeal text-brand-primary font-bold rounded-xl border border-teal-200 text-lg">Porte ${pet.size}</span>
                </div>

                <div class="bg-brand-softTeal p-6 rounded-2xl mb-8 border border-teal-100">
                    <h2 class="text-3xl font-extrabold text-brand-dark mb-4">A História</h2>
                    <p class="text-xl text-brand-dark opacity-90 leading-relaxed">${pet.story}</p>
                </div>
                
                ${isProcess ? `
                    <div class="bg-yellow-100 p-6 rounded-2xl mb-8 border border-yellow-300 text-center">
                        <span class="text-3xl block mb-2">⏳</span>
                        <h2 class="text-2xl font-extrabold text-yellow-900 mb-2">Em conversa com uma família</h2>
                        <p class="text-lg text-yellow-800">O ${pet.name} já está fazendo entrevistas. Torça por ele ou veja outros pets!</p>
                        <div class="mt-4">${window.App.ui.Button({ label: 'Ver outros pets', href: '#/pets', variant: 'outline', fullWidth: true })}</div>
                    </div>
                ` : `
                    <div class="flex flex-col gap-4">
                        ${window.App.ui.Button({ label: `Tenho interesse no ${pet.name}`, href: `#/pets/${pet.slug}/interesse`, variant: 'highlight', fullWidth: true, id: 'btn-interesse' })}
                        ${window.App.ui.Button({ label: '💬 Falar direto no WhatsApp', href: `#/pets/${pet.slug}/whatsapp`, variant: 'whatsapp', fullWidth: true, id: 'btn-zap' })}
                    </div>
                `}
            </div>
        </div>
    `);
    
    if (isMatch) window.App.lib.trackEvent('match_profile_opened', { pet: pet.name });
    if (!isProcess) {
        document.getElementById('btn-interesse').addEventListener('click', () => window.App.lib.trackEvent('interest_click', { petId: pet.id }));
        document.getElementById('btn-zap').addEventListener('click', () => window.App.lib.trackEvent('whatsapp_click', { petId: pet.id }));
    }
};

// --- FALE CONOSCO (APP) ---
window.App.screens.ContactScreen = function() {
    renderApp(`
        <div class="pt-8 text-center">
            <nav class="mb-6 text-left">
                <a href="javascript:history.back()" class="text-brand-primary font-bold text-xl min-h-[60px] inline-flex items-center gap-2 underline px-2 py-2 -ml-2 rounded">← Voltar</a>
            </nav>
            <div class="text-7xl mb-4">💬</div>
            <h1 class="text-4xl font-extrabold text-brand-dark mb-4">Fale Conosco</h1>
            <p class="text-2xl text-brand-dark opacity-90 mb-8">Estamos aqui para ajudar.</p>
            <div class="flex flex-col gap-4 mb-10">
                ${window.App.ui.Button({ label: '💬 Chamar no WhatsApp', href: window.App.lib.whatsappLink(), variant: 'whatsapp', fullWidth: true })}
                ${window.App.ui.Button({ label: '📞 Ligar agora', href: `tel:${window.App.data.ong.telefone}`, variant: 'outline', fullWidth: true })}
            </div>
            <div class="bg-brand-card p-6 rounded-3xl shadow-sm border border-gray-200 mb-8 text-left">
                <h2 class="text-3xl font-extrabold text-brand-dark mb-6">✉️ Enviar Mensagem</h2>
                <form id="contact-form" class="flex flex-col gap-4">
                    <input type="text" id="c-nome" placeholder="Seu Nome Completo" class="border-2 border-gray-300 rounded-xl p-4 text-xl min-h-[60px] focus:border-brand-primary" required>
                    <input type="tel" id="c-tel" placeholder="Telefone ou WhatsApp" class="border-2 border-gray-300 rounded-xl p-4 text-xl min-h-[60px] focus:border-brand-primary" required>
                    <textarea id="c-msg" placeholder="Como podemos ajudar?" rows="4" class="border-2 border-gray-300 rounded-xl p-4 text-xl focus:border-brand-primary" required></textarea>
                    ${window.App.ui.Button({ label: 'Enviar Mensagem', type: 'submit', variant: 'primary', fullWidth: true })}
                </form>
                <div id="contact-success" class="hidden flex-col items-center text-center p-6 bg-brand-softTeal rounded-2xl border border-teal-200 mt-4">
                    <span class="text-4xl mb-2">✅</span>
                    <h3 class="text-2xl font-extrabold text-brand-dark">Mensagem enviada!</h3>
                </div>
            </div>
        </div>
    `);

    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        window.App.services.saveMessage({
            nome: document.getElementById('c-nome').value,
            tel: document.getElementById('c-tel').value,
            msg: document.getElementById('c-msg').value
        });
        window.App.lib.trackEvent('contact_message_sent');
        document.getElementById('contact-form').style.display = 'none';
        document.getElementById('contact-success').classList.remove('hidden');
        document.getElementById('contact-success').classList.add('flex');
    });
};

window.App.screens.OngScreen = function() {
    renderApp(`
        <div class="pt-8 text-center pb-8">
            <div class="text-7xl mb-4">🏠</div>
            <h1 class="text-4xl font-extrabold text-brand-dark mb-4">${window.App.data.ong.nome}</h1>
            <p class="text-2xl text-brand-dark opacity-90 mb-8">${window.App.data.ong.endereco}</p>
            <p class="text-xl text-brand-dark opacity-90 mb-8 font-bold">Atendimento: ${window.App.data.ong.horario}</p>
            <div class="flex flex-col gap-4">
                ${window.App.ui.Button({ label: '📍 Ver no Mapa', href: window.App.lib.mapsLink(window.App.data.ong), variant: 'primary', fullWidth: true })}
                ${window.App.ui.Button({ label: '💬 Fale Conosco', href: '#/contato', variant: 'whatsapp', fullWidth: true })}
            </div>
            <div class="mt-16 text-center">
                <a href="#/gestao" class="text-gray-400 underline p-4 font-bold">Acesso Exclusivo ONG</a>
            </div>
        </div>
    `);
};

// --- QUIZ E TRANSIÇÃO ---
const QUIZ_QUESTIONS = [
    { id: 'p1', title: 'Você procura um pet mais...', options: [{ l: 'Carinhoso', v: 'carinhoso', i: '❤️' }, { l: 'Tranquilo', v: 'tranquilo', i: '😊' }, { l: 'Brincalhão', v: 'brincalhao', i: '🎾' }] },
    { id: 'p2', title: 'Você mora em...', options: [{ l: 'Casa', v: 'casa', i: '🏠' }, { l: 'Apartamento', v: 'apartamento', i: '🏢' }] },
    { id: 'p3', title: 'Quanto tempo tem livre por dia?', options: [{ l: 'Pouco tempo', v: 'pouco', i: '⏳' }, { l: 'Algumas horas', v: 'algumas-horas', i: '⏱️' }, { l: 'Grande parte do dia', v: 'grande-parte', i: '☀️' }] }
];

window.App.screens.QuizScreen = function() {
    const lastMatch = window.App.services.getLastMatch();
    if (lastMatch && !window.App._forceQuiz) {
        return renderApp(`
            <div class="pt-16 text-center">
                <div class="text-7xl mb-8">❤️</div>
                <h1 class="text-4xl font-extrabold text-brand-dark mb-6">Você já fez o quiz!</h1>
                <p class="text-2xl text-brand-dark opacity-90 mb-10">Temos um resultado guardado para você.</p>
                <div class="flex flex-col gap-4">
                    ${window.App.ui.Button({ label: 'Ver meu resultado', href: `#/match/${lastMatch.match.pet.slug}`, variant: 'highlight', fullWidth: true })}
                    <button id="btn-refazer" class="inline-flex items-center justify-center gap-4 px-6 py-4 rounded-xl font-bold border-2 border-brand-primary bg-white text-brand-primary w-full">Refazer o Quiz</button>
                </div>
            </div>
        `);
    }

    let currentStep = 0;
    const renderStep = () => {
        if (currentStep >= QUIZ_QUESTIONS.length) {
            const answers = window.App.services.getQuizAnswers();
            const result = window.App.lib.matchPet(answers);
            window.App.services.saveMatch(result);
            window.App._forceQuiz = false;
            return window.App.router.handleRoute('#/transicao');
        }
        const q = QUIZ_QUESTIONS[currentStep];
        const answers = window.App.services.getQuizAnswers();
        const activeVal = answers[q.id];

        renderApp(`
            <div class="pt-8">
                <button id="btn-voltar-quiz" class="text-brand-primary font-bold text-xl min-h-[60px] inline-flex items-center gap-2 underline px-2 py-2 mb-4 -ml-2 rounded">← Voltar</button>
                <div class="w-full bg-gray-200 h-4 rounded-full mb-8 overflow-hidden">
                    <div class="bg-brand-primary h-4 transition-all duration-500 rounded-full" style="width: ${((currentStep+1)/QUIZ_QUESTIONS.length)*100}%"></div>
                </div>
                <h2 class="text-2xl text-gray-500 font-bold mb-4">Pergunta ${currentStep + 1} de 3</h2>
                <h1 class="text-4xl font-extrabold text-brand-dark mb-10 leading-[1.3]">${q.title}</h1>
                <div class="flex flex-col gap-6 mb-12" id="quiz-options">
                    ${q.options.map(opt => window.App.ui.QuizChoice(opt.l, opt.v, opt.i, activeVal)).join('')}
                </div>
                ${window.App.ui.Button({ label: 'Continuar', variant: 'primary', fullWidth: true, id: 'btn-next' })}
            </div>
        `);

        document.querySelectorAll('#quiz-options button').forEach(b => b.addEventListener('click', () => {
            window.App.services.saveQuizAnswer(q.id, b.getAttribute('data-value'));
            renderStep();
        }));
        document.getElementById('btn-voltar-quiz').addEventListener('click', () => { if (currentStep > 0) { currentStep--; renderStep(); } else window.history.back(); });
        document.getElementById('btn-next').addEventListener('click', () => {
            if (!window.App.services.getQuizAnswers()[q.id]) return alert('Selecione uma opção.');
            currentStep++; renderStep();
        });
    };
    renderStep();

    const btnRefazer = document.getElementById('btn-refazer');
    if(btnRefazer) btnRefazer.addEventListener('click', () => {
        window.App.services.clearQuizAnswers(); window.App._forceQuiz = true; window.App.screens.QuizScreen();
    });
};

window.App.screens.TransitionScreen = function() {
    renderApp(`
        <div class="flex flex-col items-center justify-center pt-24 text-center h-[60vh]">
            <div class="text-8xl mb-12 pulse-heart">❤️</div>
            <h1 class="text-4xl font-extrabold text-brand-dark mb-6">Procurando quem combina com você...</h1>
            ${window.App.ui.Button({ label: 'Pular', id: 'btn-skip-anim', variant: 'outline' })}
        </div>
    `);
    const result = window.App.services.getLastMatch();
    const slug = result.match ? result.match.pet.slug : null;
    const go = () => window.App.router.handleRoute(slug ? `#/match/${slug}` : '#/encontrar');
    const timer = setTimeout(go, 2500);
    document.getElementById('btn-skip-anim').addEventListener('click', () => { clearTimeout(timer); go(); });
};

window.App.screens.MatchScreen = function(slug) {
    const data = window.App.services.getLastMatch();
    if (!data || !data.match || data.match.pet.slug !== slug) return window.App.router.handleRoute('#/encontrar');
    
    const { pet, reasons } = data.match;
    renderApp(`
        <div class="pt-8 mx-[-1rem]">
            <nav class="mb-4 px-4"><a href="#/encontrar" class="text-brand-primary font-bold text-xl underline" onclick="window.App._forceQuiz=true;">← Refazer Quiz</a></nav>
            <div class="bg-brand-softTeal py-10 px-6 flex flex-col items-center text-center">
                <img src="${pet.photos[0]}" class="w-48 h-48 rounded-full object-cover border-8 border-white shadow-lg mb-6">
                <h1 class="text-4xl font-extrabold text-brand-dark">Encontramos o ${pet.name}! ❤️</h1>
            </div>
            <div class="p-6">
                <div class="flex flex-col gap-4 mb-8">
                    ${reasons.map(r => `<div class="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100"><span class="text-3xl">✅</span><span class="text-2xl text-brand-dark font-bold">${r}</span></div>`).join('')}
                </div>
                <div class="flex flex-col gap-4">
                    ${window.App.ui.Button({ label: `👀 Conhecer o ${pet.name}`, href: `#/pets/${pet.slug}`, variant: 'primary', fullWidth: true })}
                </div>
                <div class="text-center mt-6">
                    <a href="#/match-outros" class="font-bold text-xl text-brand-primary underline p-4 inline-flex min-h-[60px]">Ver outros matches</a>
                </div>
            </div>
        </div>
    `);
    window.App.lib.trackEvent('match_shown', { petId: pet.id });
};

window.App.screens.MatchOthersScreen = function() {
    const data = window.App.services.getLastMatch();
    if (!data) return window.App.router.handleRoute('#/encontrar');
    renderApp(`
        <nav class="mb-6 pt-4"><a href="javascript:history.back()" class="text-brand-primary font-bold text-xl underline">← Voltar</a></nav>
        <h1 class="text-4xl font-extrabold text-brand-dark mb-4 text-center">Outras companhias ideais</h1>
        <div class="flex flex-col gap-6 mt-8">
            ${data.others.map(p => window.App.ui.PetCard(p)).join('')}
        </div>
    `);
};

// Adicionando proteção no Quiz caso não existam pets disponíveis
const _QuizScreenOrigin = window.App.screens.QuizScreen;
window.App.screens.QuizScreen = function() {
    const availablePets = window.App.services.getPets().filter(p => p.status === 'disponivel');
    if (availablePets.length === 0) {
        return renderApp(`
            <div class="text-center mt-20 pt-8 max-w-lg mx-auto">
                <div class="text-7xl mb-8">❤️</div>
                <h2 class="text-4xl font-extrabold text-brand-dark mb-4">Nenhum pet para match no momento</h2>
                <p class="mb-10 text-xl text-gray-700">Todos os nossos pets estão em conversa ou já ganharam um lar. Fale conosco para ser o primeiro a saber quando novos animais chegarem!</p>
                ${window.App.ui.Button({ label: 'Falar com a ONG', href: '#/contato', variant: 'whatsapp', fullWidth: true })}
                <div class="mt-4">
                    ${window.App.ui.Button({ label: 'Voltar ao Início', href: '#/', variant: 'outline', fullWidth: true })}
                </div>
            </div>
        `);
    }
    return _QuizScreenOrigin();
};
