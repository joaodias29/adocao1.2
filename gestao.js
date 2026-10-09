window.App.gestao = {
    screens: {}
};

function renderGestao(content) {
    document.getElementById('gestao-root').innerHTML = `<div class="fade-in max-w-7xl mx-auto">${content}</div>`;
}

window.App.gestao.renderLayout = function() {
    document.getElementById('gestao-sidebar').innerHTML = `
        <div class="h-16 flex items-center px-6 border-b border-gray-700">
            <span class="text-xl font-extrabold tracking-wide">Painel ONG</span>
        </div>
        <nav id="gestao-sidebar-nav" class="flex-1 py-6 flex flex-col gap-2 px-4">
            <a href="#/gestao" class="p-3 rounded-lg hover:bg-gray-700 font-bold">📊 Painel</a>
            <a href="#/gestao/leads" class="p-3 rounded-lg hover:bg-gray-700 font-bold">👥 Leads</a>
            <a href="#/gestao/animais" class="p-3 rounded-lg hover:bg-gray-700 font-bold">🐶 Animais</a>
            <a href="#/gestao/adocoes" class="p-3 rounded-lg hover:bg-gray-700 font-bold">📝 Adoções</a>
            <a href="#/gestao/mensagens" class="p-3 rounded-lg hover:bg-gray-700 font-bold">✉️ Mensagens</a>
            <a href="#/gestao/campanhas" class="p-3 rounded-lg hover:bg-gray-700 font-bold">📢 Campanhas</a>
        </nav>
        <div class="p-4 border-t border-gray-700 text-sm">
            <a href="#/" class="block text-center bg-gray-700 hover:bg-gray-600 p-3 rounded-lg font-bold mb-2">📱 Ver o App</a>
            <button onclick="sessionStorage.removeItem('cc_gestao_auth'); window.location.hash='#/gestao/login'" class="w-full text-center p-2 text-gray-400 hover:text-white">Sair</button>
        </div>
    `;

    document.getElementById('gestao-header').innerHTML = `
        <div class="flex items-center gap-4">
            <h1 class="text-2xl font-bold text-gray-800">Um Clique, Uma Companhia</h1>
        </div>
        <div class="flex gap-4">
            <button onclick="window.App.data.loadDemoData()" class="text-sm font-bold bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg border border-yellow-300">Carregar Dados Demo</button>
        </div>
    `;
};

// --- AUTH ---
window.App.gestao.screens.Login = function() {
    renderGestao(`
        <div class="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
            <h1 class="text-3xl font-extrabold text-brand-dark mb-4">Acesso à Gestão</h1>
            <p class="text-gray-500 mb-6 bg-yellow-50 p-4 rounded-lg text-sm border border-yellow-200">
                Modo demonstração: os dados ficam apenas neste navegador. A senha padrão é <b>${window.App.data.ong.pin}</b>.
            </p>
            <input type="password" id="g-pin" placeholder="PIN de Acesso" class="w-full border-2 border-gray-300 rounded-lg p-4 text-center text-2xl tracking-widest mb-6 focus:border-brand-primary outline-none">
            <button id="btn-login" class="w-full bg-brand-primary text-white font-bold py-4 rounded-lg shadow-md hover:bg-teal-700 transition">Acessar Painel</button>
            <a href="#/" class="block mt-6 text-gray-500 underline">Voltar para o App Público</a>
        </div>
    `);

    document.getElementById('btn-login').addEventListener('click', () => {
        if (document.getElementById('g-pin').value === window.App.data.ong.pin) {
            sessionStorage.setItem('cc_gestao_auth', 'true');
            window.location.hash = '#/gestao';
        } else {
            alert('PIN incorreto.');
        }
    });
};

// --- PAINEL (Dashboard) ---
window.App.gestao.screens.Dashboard = function() {
    const leads = window.App.services.getLeadEvents();
    const pets = window.App.services.getPets();
    
    const countDisponivel = pets.filter(p => p.status === 'disponivel').length;
    const countProcess = pets.filter(p => p.status === 'em-processo').length;
    const countAdotado = pets.filter(p => p.status === 'adotado').length;

    // Simplificação de visualizações x interesse
    const views = leads.filter(l => l.name === 'pet_viewed').length;
    const interests = leads.filter(l => l.name === 'interest_click' || l.name === 'whatsapp_click').length;
    const adoptions = window.App.services.getAdoptions();
    const adoptionsDone = adoptions.filter(a => a.stage === 'concluida').length;

    const convRate = views > 0 ? Math.round((interests / views) * 100) : 0;

    renderGestao(`
        <h2 class="text-3xl font-extrabold text-gray-800 mb-8">Visão Geral</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <p class="text-sm font-bold text-gray-500 uppercase">Animais Disponíveis</p>
                <p class="text-4xl font-extrabold text-brand-primary mt-2">${countDisponivel}</p>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <p class="text-sm font-bold text-gray-500 uppercase">Em Processo / Reserva</p>
                <p class="text-4xl font-extrabold text-yellow-600 mt-2">${countProcess}</p>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <p class="text-sm font-bold text-gray-500 uppercase">Adotados (Total)</p>
                <p class="text-4xl font-extrabold text-brand-whatsapp mt-2">${countAdotado}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 class="font-bold text-lg text-gray-800 mb-6">Funil de Adoção</h3>
                <div class="flex flex-col gap-4">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-600">Visualizações de Pet</span>
                        <span class="font-bold text-gray-800">${views}</span>
                    </div>
                    <div class="w-full bg-gray-100 h-3 rounded-full"><div class="bg-blue-400 h-3 rounded-full" style="width: 100%"></div></div>
                    
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-600">Interesses (Cliques)</span>
                        <span class="font-bold text-gray-800">${interests}</span>
                    </div>
                    <div class="w-full bg-gray-100 h-3 rounded-full"><div class="bg-brand-primary h-3 rounded-full" style="width: ${Math.max(10, convRate)}%"></div></div>
                    
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-600">Adoções Concluídas</span>
                        <span class="font-bold text-gray-800">${adoptionsDone}</span>
                    </div>
                    <div class="w-full bg-gray-100 h-3 rounded-full"><div class="bg-brand-whatsapp h-3 rounded-full" style="width: ${adoptionsDone > 0 ? '10%' : '0%'}"></div></div>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 class="font-bold text-lg text-gray-800 mb-6">Ranking do Quiz (Matches)</h3>
                ${renderMatchRanking(leads, pets)}
            </div>
        </div>
    `);
};

function renderMatchRanking(leads, pets) {
    const matches = leads.filter(l => l.name === 'match_shown');
    if (matches.length === 0) return '<p class="text-gray-500">Nenhum quiz registrado.</p>';
    
    const ranking = {};
    matches.forEach(m => ranking[m.petId] = (ranking[m.petId] || 0) + 1);
    
    return `<div class="flex flex-col gap-3">
        ${Object.entries(ranking).sort((a,b) => b[1]-a[1]).map(([id, count]) => {
            const p = pets.find(x => x.id === id);
            return p ? `
                <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span class="font-bold text-gray-800">${p.name}</span>
                    <span class="bg-brand-softTeal text-brand-primary px-3 py-1 rounded-full text-sm font-bold">${count} indicações</span>
                </div>
            ` : '';
        }).join('')}
    </div>`;
}

// --- LEADS ---
window.App.gestao.screens.Leads = function() {
    const leads = window.App.services.getLeadEvents().filter(l => l.name === 'interest_click' || l.name === 'whatsapp_click');
    
    renderGestao(`
        <div class="flex justify-between items-center mb-8">
            <h2 class="text-3xl font-extrabold text-gray-800">Leads de Interesse</h2>
            <button id="btn-export-leads" class="bg-gray-800 text-white font-bold px-4 py-2 rounded-lg hover:bg-black">Exportar CSV</button>
        </div>
        
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr class="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase">
                        <th class="p-4">Data</th>
                        <th class="p-4">Pet / ID</th>
                        <th class="p-4">Ação</th>
                        <th class="p-4">UTM Origem</th>
                        <th class="p-4">Adoção</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${leads.length === 0 ? `<tr><td colspan="5" class="p-8 text-center text-gray-500">Nenhum lead de interesse registrado.</td></tr>` : 
                    leads.slice().reverse().map(l => {
                        const isZap = l.name === 'whatsapp_click';
                        return `
                        <tr class="hover:bg-gray-50">
                            <td class="p-4 text-gray-800 whitespace-nowrap">${new Date(l.timestamp).toLocaleString()}</td>
                            <td class="p-4 font-bold text-brand-primary">${l.petId}</td>
                            <td class="p-4"><span class="px-2 py-1 rounded text-xs font-bold ${isZap ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}">${isZap ? 'WhatsApp' : 'Interesse App'}</span></td>
                            <td class="p-4 text-gray-500 text-sm">${l.utms?.source || 'direto'}</td>
                            <td class="p-4">
                                <button onclick="window.App.gestao.prompAdoption('${l.id}', '${l.petId}')" class="text-xs bg-brand-primary text-white font-bold px-3 py-1 rounded hover:bg-teal-700">Registrar Adoção</button>
                            </td>
                        </tr>
                    `}).join('')}
                </tbody>
            </table>
        </div>
    `);

    document.getElementById('btn-export-leads').addEventListener('click', () => {
        const rows = [["Data", "PetID", "Acao", "Source", "Medium", "Campaign"]];
        leads.forEach(l => rows.push([l.timestamp, l.petId, l.name, l.utms?.source||'', l.utms?.medium||'', l.utms?.campaign||'']));
        window.App.lib.generateCSV("leads.csv", rows);
    });
};

window.App.gestao.prompAdoption = function(leadId, petId) {
    const adopterName = prompt("Nome completo do adotante (obrigatório):");
    if (!adopterName) return;
    const adopterPhone = prompt("Telefone do adotante (opcional):");
    
    const res = window.App.services.createAdoption({
        petId, leadId, adopterName, adopterPhone: adopterPhone || '', notes: ''
    });

    if (res.success) {
        alert("Adoção iniciada com sucesso! O status do animal mudou para 'Em Processo'.");
        window.location.hash = '#/gestao/adocoes';
    } else {
        alert("Erro: " + res.error);
    }
};

// --- ANIMAIS (CRUD) ---
window.App.gestao.screens.Animais = function() {
    const pets = window.App.services.getPets();
    
    renderGestao(`
        <div class="flex justify-between items-center mb-8">
            <h2 class="text-3xl font-extrabold text-gray-800">Animais</h2>
            <button onclick="alert('Funcionalidade de Novo Animal (simulação). Crie pelo script demo.')" class="bg-brand-primary text-white font-bold px-4 py-2 rounded-lg hover:bg-teal-700">+ Novo Pet</button>
        </div>
        
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-[700px]">
                <thead>
                    <tr class="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase">
                        <th class="p-4 w-16">Foto</th>
                        <th class="p-4">Nome</th>
                        <th class="p-4">Idade/Porte</th>
                        <th class="p-4">Status</th>
                        <th class="p-4">Ação</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${pets.map(p => {
                        const statusColors = {
                            'disponivel': 'bg-green-100 text-green-800',
                            'em-processo': 'bg-yellow-100 text-yellow-800',
                            'adotado': 'bg-blue-100 text-blue-800',
                            'indisponivel': 'bg-gray-100 text-gray-800'
                        };
                        return `
                        <tr class="hover:bg-gray-50">
                            <td class="p-4"><img src="${p.photos[0]}" class="w-12 h-12 rounded object-cover"></td>
                            <td class="p-4 font-bold text-gray-800">${p.name}</td>
                            <td class="p-4 text-gray-600">${p.ageYears} anos • ${p.size}</td>
                            <td class="p-4">
                                <select onchange="window.App.services.updatePetStatus('${p.id}', this.value); window.App.gestao.screens.Animais();" class="text-sm font-bold p-1 rounded border border-gray-300 outline-none ${statusColors[p.status] || ''}">
                                    <option value="disponivel" ${p.status==='disponivel'?'selected':''}>Disponível</option>
                                    <option value="em-processo" ${p.status==='em-processo'?'selected':''}>Em Processo</option>
                                    <option value="adotado" ${p.status==='adotado'?'selected':''}>Adotado</option>
                                    <option value="indisponivel" ${p.status==='indisponivel'?'selected':''}>Indisponível</option>
                                </select>
                            </td>
                            <td class="p-4">
                                <button onclick="alert('Edição mockada.')" class="text-sm text-brand-primary underline mr-3">Editar</button>
                            </td>
                        </tr>
                    `}).join('')}
                </tbody>
            </table>
        </div>
    `);
};

// --- ADOÇÕES (Kanban Simples) ---
window.App.gestao.screens.Adocoes = function() {
    const ads = window.App.services.getAdoptions();
    const stages = [
        { id: 'analise', label: 'Em Análise' },
        { id: 'entrevista', label: 'Entrevista' },
        { id: 'visita', label: 'Visita' },
        { id: 'termo', label: 'Assinatura do Termo' },
        { id: 'concluida', label: 'Concluída ✅' },
        { id: 'cancelada', label: 'Cancelada ❌' }
    ];

    renderGestao(`
        <div class="flex justify-between items-center mb-8">
            <h2 class="text-3xl font-extrabold text-gray-800">Esteira de Adoções</h2>
        </div>
        
        <div class="flex flex-col gap-8">
            ${stages.map(st => {
                const list = ads.filter(a => a.stage === st.id);
                if (list.length === 0) return '';
                return `
                <div class="bg-gray-100 p-4 rounded-2xl border border-gray-200">
                    <h3 class="font-bold text-gray-700 uppercase mb-4 pl-2">${st.label} (${list.length})</h3>
                    <div class="flex flex-col gap-3">
                        ${list.map(a => {
                            const pet = window.App.services.getPetById(a.petId);
                            return `
                            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div>
                                    <p class="font-bold text-gray-800 text-lg">Adotante: ${a.adopterName}</p>
                                    <p class="text-sm text-brand-primary font-bold">Pet: ${pet ? pet.name : a.petId} ${pet && pet.status !== 'em-processo' && st.id !== 'concluida' && st.id !== 'cancelada' ? '<span class="text-red-500">(Status do pet divergente)</span>' : ''}</p>
                                    ${a.adopterPhone ? `<p class="text-sm text-gray-500 mt-1">📞 ${a.adopterPhone}</p>` : ''}
                                </div>
                                <div class="flex gap-2 shrink-0">
                                    <select onchange="window.App.services.updateAdoptionStage('${a.id}', this.value); window.App.gestao.screens.Adocoes();" class="p-2 border border-gray-300 rounded outline-none font-bold text-sm bg-gray-50">
                                        <option value="">Mover para...</option>
                                        ${stages.map(opt => `<option value="${opt.id}" ${opt.id===a.stage?'selected disabled':''}>${opt.label}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                            `
                        }).join('')}
                    </div>
                </div>
                `
            }).join('')}
            ${ads.length === 0 ? '<p class="text-gray-500">Nenhuma adoção iniciada. Vá até Leads e clique em "Registrar Adoção".</p>' : ''}
        </div>
    `);
};

// --- MENSAGENS ---
window.App.gestao.screens.Mensagens = function() {
    const msgs = window.App.services.getMessages();
    renderGestao(`
        <h2 class="text-3xl font-extrabold text-gray-800 mb-8">Fale Conosco (Mensagens)</h2>
        ${msgs.length === 0 ? `<p class="text-gray-500">Caixa de entrada vazia.</p>` : `
        <div class="flex flex-col gap-4">
            ${msgs.slice().reverse().map(m => `
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="font-bold text-lg text-gray-800">${m.nome}</h3>
                            <p class="text-sm text-gray-500">${new Date(m.date).toLocaleString()}</p>
                        </div>
                        <button onclick="window.App.services.deleteMessage('${m.id}'); window.App.gestao.screens.Mensagens();" class="text-red-500 font-bold text-sm hover:underline">Excluir</button>
                    </div>
                    <p class="font-bold text-brand-primary mb-2">📞 ${m.tel}</p>
                    <p class="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">${m.msg}</p>
                    <div class="mt-4">
                        <a href="https://wa.me/${m.tel.replace(/\\D/g, '')}" target="_blank" class="text-sm bg-brand-whatsapp text-white px-4 py-2 rounded-lg font-bold">Responder no WhatsApp</a>
                    </div>
                </div>
            `).join('')}
        </div>
        `}
    `);
};

// --- CAMPANHAS UTM ---
window.App.gestao.screens.Campanhas = function() {
    renderGestao(`
        <h2 class="text-3xl font-extrabold text-gray-800 mb-8">Gerador de Campanhas (UTM)</h2>
        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 max-w-2xl">
            <p class="text-gray-600 mb-6">Crie links rastreáveis para usar no Instagram, TikTok, Facebook ou panfletos. Quando os usuários clicarem, a origem será salva nos Leads.</p>
            
            <div class="flex flex-col gap-4">
                <div>
                    <label class="font-bold text-gray-700 text-sm block mb-1">Destino (Rota do App)</label>
                    <select id="utm-dest" class="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-brand-primary">
                        <option value="#/">Home Principal</option>
                        <option value="#/encontrar">Quiz Diretamente</option>
                        ${window.App.services.getPets().map(p => `<option value="#/pets/${p.slug}">Perfil: ${p.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="font-bold text-gray-700 text-sm block mb-1">Origem (utm_source) *</label>
                    <input type="text" id="utm-source" placeholder="ex: instagram, facebook, panfleto" class="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-brand-primary">
                </div>
                <div>
                    <label class="font-bold text-gray-700 text-sm block mb-1">Campanha (utm_campaign)</label>
                    <input type="text" id="utm-camp" placeholder="ex: feira_adocao_outubro" class="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-brand-primary">
                </div>
                
                <button id="btn-gerar-utm" class="bg-brand-primary text-white font-bold py-4 rounded-lg mt-4 hover:bg-teal-700">Gerar Link</button>
                
                <div class="mt-6">
                    <label class="font-bold text-gray-700 text-sm block mb-1">Link Final</label>
                    <textarea id="utm-result" readonly rows="2" class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 outline-none"></textarea>
                </div>
            </div>
        </div>
    `);

    document.getElementById('btn-gerar-utm').addEventListener('click', () => {
        const dest = document.getElementById('utm-dest').value;
        const source = document.getElementById('utm-source').value || 'desconhecida';
        const camp = document.getElementById('utm-camp').value;
        
        let url = window.location.origin + window.location.pathname;
        let params = new URLSearchParams();
        params.set('utm_source', source);
        if (camp) params.set('utm_campaign', camp);
        
        url += '?' + params.toString() + dest;
        document.getElementById('utm-result').value = url;
    });
};
