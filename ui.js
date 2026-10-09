const imgFb = `onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\'><rect width=\\'100\\' height=\\'100\\' fill=\\'%23E6F4F1\\'/><text x=\\'50\\' y=\\'55\\' font-family=\\'sans-serif\\' font-size=\\'20\\' font-weight=\\'bold\\' text-anchor=\\'middle\\' fill=\\'%231F2937\\'>Foto</text></svg>';"`;

// =========================================
// UI COMPONENTES - APP PÚBLICO
// =========================================

window.App.ui.Header = function() {
    const current = window.App.state.fontSize;
    const hasTTS = ('speechSynthesis' in window);
    
    return `
        <header class="w-full bg-brand-card shadow-sm py-3 px-4 sticky top-0 z-50 border-b border-gray-200">
            <div class="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div class="flex justify-between items-center w-full sm:w-auto flex-grow gap-2">
                    <a href="#/" class="font-extrabold text-xl sm:text-2xl text-brand-primary flex items-center min-h-[60px]">🐶 Uma Companhia</a>
                    <a href="#/contato" class="font-bold text-brand-primary bg-brand-softTeal hover:bg-teal-100 px-4 rounded-xl flex items-center justify-center min-h-[60px] text-base sm:hidden shadow-sm">💬 Fale Conosco</a>
                </div>
                <div class="flex justify-between items-center w-full sm:w-auto gap-4">
                    <div class="flex bg-gray-100 rounded-xl p-1 border border-gray-300 shadow-inner h-fit">
                        <button id="font-normal" class="w-14 h-14 sm:w-12 rounded-lg font-bold transition-colors min-h-[56px] min-w-[48px] ${current === 'normal' ? 'bg-white shadow text-brand-primary' : 'text-gray-600'}">A</button>
                        <button id="font-large" class="w-14 h-14 sm:w-12 rounded-lg font-bold text-lg transition-colors min-h-[56px] min-w-[48px] ${current === 'large' ? 'bg-white shadow text-brand-primary' : 'text-gray-600'}">A+</button>
                        <button id="font-xl" class="w-14 h-14 sm:w-12 rounded-lg font-bold text-xl transition-colors min-h-[56px] min-w-[48px] ${current === 'xl' ? 'bg-white shadow text-brand-primary' : 'text-gray-600'}">A++</button>
                    </div>
                    <div class="flex gap-3">
                        ${hasTTS ? `
                        <button id="btn-read-aloud" class="w-14 h-14 rounded-xl bg-brand-light text-brand-dark flex items-center justify-center border border-gray-300 shadow-sm min-h-[56px] min-w-[56px]">🔊</button>
                        ` : ''}
                        <a href="#/contato" class="hidden sm:flex font-bold text-brand-primary bg-brand-softTeal px-5 rounded-xl items-center justify-center min-h-[60px] shadow-sm">💬 Fale Conosco</a>
                    </div>
                </div>
            </div>
        </header>
    `;
};

window.App.ui.BottomNav = function() {
    return `
        <nav class="fixed bottom-0 w-full sm:w-[480px] sm:left-1/2 sm:-ml-[240px] bg-brand-card shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-[60] border-t border-gray-200 no-select pb-[var(--safe-bottom,0px)]">
            <div class="flex justify-around items-center h-[85px] w-full">
                <a href="#/" class="flex flex-col items-center justify-center w-full h-full text-brand-dark opacity-80 hover:opacity-100 hover:bg-gray-50 font-bold active:scale-95 transition-transform">
                    <span class="text-3xl mb-1">🏠</span><span class="text-sm">Início</span>
                </a>
                <a href="#/pets" class="flex flex-col items-center justify-center w-full h-full text-brand-dark opacity-80 hover:opacity-100 hover:bg-gray-50 font-bold active:scale-95 transition-transform">
                    <span class="text-3xl mb-1">🐶</span><span class="text-sm">Pets</span>
                </a>
                <a href="#/encontrar" class="flex flex-col items-center justify-center w-full h-full text-brand-dark opacity-80 hover:opacity-100 hover:bg-gray-50 font-bold active:scale-95 transition-transform">
                    <span class="text-3xl mb-1">💛</span><span class="text-sm">Encontrar</span>
                </a>
                <a href="#/ong" class="flex flex-col items-center justify-center w-full h-full text-brand-dark opacity-80 hover:opacity-100 hover:bg-gray-50 font-bold active:scale-95 transition-transform">
                    <span class="text-3xl mb-1">📍</span><span class="text-sm">ONG</span>
                </a>
            </div>
        </nav>
    `;
};

window.App.ui.attachHeaderEvents = function() {
    ['normal', 'large', 'xl'].forEach(size => {
        const btn = document.getElementById(`font-${size}`);
        if (btn) btn.addEventListener('click', () => {
            window.App.lib.applyFontSize(size);
            document.getElementById('layout-header').innerHTML = window.App.ui.Header();
            window.App.ui.attachHeaderEvents();
        });
    });

    const ttsBtn = document.getElementById('btn-read-aloud');
    if (ttsBtn) ttsBtn.addEventListener('click', () => {
        const root = document.getElementById('app-root');
        if (ttsBtn.classList.contains('bg-brand-softOrange')) {
            window.App.lib.speak('');
            ttsBtn.classList.remove('bg-brand-softOrange');
        } else {
            window.App.lib.speak(root.innerText);
            ttsBtn.classList.add('bg-brand-softOrange');
        }
    });
};

window.App.ui.Button = function({ label, href = '', variant = 'primary', fullWidth = false, id = '', type = 'button', extraClass = '' }) {
    const baseClass = "inline-flex items-center justify-center gap-4 px-6 py-4 rounded-xl font-bold transition-all active:scale-95 text-center min-h-[60px] border-2 border-transparent";
    const variants = {
        primary: "bg-brand-primary text-white hover:bg-[#0A5B5A] shadow-md",
        secondary: "bg-white text-brand-primary border-brand-primary hover:bg-brand-softTeal shadow-sm",
        whatsapp: "bg-brand-whatsapp text-white hover:bg-[#085a2e] shadow-md",
        highlight: "bg-brand-highlight text-white hover:bg-[#99330a] shadow-md",
        outline: "bg-transparent text-brand-dark border-gray-400 hover:bg-gray-100"
    };
    const classes = `${baseClass} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${extraClass}`;
    const idAttr = id ? `id="${id}"` : '';
    
    if (href) return `<a href="${href}" ${idAttr} class="${classes}">${label}</a>`;
    return `<button type="${type}" ${idAttr} class="${classes}">${label}</button>`;
};

window.App.ui.PetCard = function(pet) {
    const statusTag = pet.status === 'em-processo' ? 
        `<div class="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-lg font-bold text-sm shadow-md">⏳ Em conversa com uma família</div>` : '';
        
    return `
        <a href="#/pets/${pet.slug}" class="block bg-brand-card rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-200 focus-visible min-h-[60px] flex flex-col h-full group relative">
            <div class="aspect-[4/3] w-full bg-gray-100 relative overflow-hidden">
                <img src="${pet.photos[0]}" alt="Foto" class="w-full h-full object-cover" ${imgFb} loading="lazy">
                ${statusTag}
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <h3 class="text-2xl font-extrabold text-brand-dark">${pet.name}</h3>
                <p class="text-brand-dark opacity-80 mt-2 mb-4 leading-relaxed">${pet.highlight}</p>
                <div class="flex gap-2 mt-auto flex-wrap">
                    <span class="px-3 py-1 bg-brand-softOrange text-brand-highlight rounded-lg text-sm font-bold border border-orange-200">${pet.ageYears} anos</span>
                    <span class="px-3 py-1 bg-brand-softTeal text-brand-primary rounded-lg text-sm font-bold border border-teal-200">${pet.size}</span>
                </div>
            </div>
        </a>
    `;
};

window.App.ui.StoryCard = function(story) {
    return `
        <div class="bg-brand-card p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center gap-4 min-h-[60px]">
            <img src="${story.photo}" alt="Foto" class="w-24 h-24 rounded-full object-cover shadow-sm border-4 border-brand-softTeal" ${imgFb} loading="lazy">
            <h3 class="text-xl font-bold text-brand-dark">${story.name}</h3>
            <p class="text-brand-dark opacity-90 italic">"${story.quote}"</p>
            ${story.isAdopted ? '<span class="text-brand-primary font-bold mt-2">Adotado ❤️</span>' : ''}
        </div>
    `;
};

window.App.ui.AccordionItem = function(q, a) {
    return `
        <details class="bg-brand-card rounded-2xl shadow-sm border border-gray-200 mb-4 group focus-visible">
            <summary class="font-extrabold text-xl p-6 flex justify-between items-center text-brand-dark min-h-[60px] select-none hover:bg-gray-50 rounded-2xl">
                ${q}
                <span class="text-brand-primary text-3xl group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
            </summary>
            <div class="px-6 pb-6 pt-2 text-brand-dark opacity-90 leading-relaxed text-lg border-t border-gray-100">
                ${a}
            </div>
        </details>
    `;
};

window.App.ui.QuizChoice = function(label, value, icon, activeValue) {
    const isSelected = activeValue === value;
    const baseClass = "w-full p-6 rounded-2xl border-2 text-left flex items-center gap-4 transition-all min-h-[80px]";
    const stateClass = isSelected ? "border-brand-primary bg-brand-softTeal shadow-inner" : "border-gray-200 bg-white hover:border-gray-300 shadow-sm";
    
    return `
        <button class="${baseClass} ${stateClass}" data-value="${value}">
            <span class="text-4xl" aria-hidden="true">${icon}</span>
            <span class="text-2xl font-bold text-brand-dark">${label}</span>
            ${isSelected ? '<span class="ml-auto text-brand-primary text-3xl">✓</span>' : ''}
        </button>
    `;
};

window.App.ui.MatchBanner = function(reasons) {
    return `
        <div class="bg-brand-softTeal border-b-4 border-brand-primary p-6 text-center shadow-inner">
            <h2 class="text-2xl font-extrabold text-brand-primary flex items-center justify-center gap-2">
                <span>🏆</span> Combina com você
            </h2>
            <p class="text-lg text-brand-dark font-bold mt-2 opacity-90">${reasons[0]}</p>
        </div>
    `;
};
