window.App = {
    data: {}, services: {}, lib: {}, ui: {}, screens: {}, gestao: {}, router: {},
    state: {
        fontSize: localStorage.getItem('fontSize') || 'normal',
        shell: 'app'
    },
    init: function() {
        console.log("Iniciando Um Clique, Uma Companhia (Dual Shell)...");
        
        // Aplica o tamanho da fonte apenas para o shell app (gestão é fixo)
        this.lib.applyFontSize(this.state.fontSize);
        
        // Renderiza elementos base do App Shell
        const header = document.getElementById('layout-header');
        if (header) {
            header.innerHTML = this.ui.Header();
            this.ui.attachHeaderEvents();
        }
        document.getElementById('bottom-nav').innerHTML = this.ui.BottomNav();
    },

    switchShell: function(shellName) {
        this.state.shell = shellName;
        document.documentElement.setAttribute('data-shell', shellName);
        if (shellName === 'app') {
            this.lib.applyFontSize(this.state.fontSize); // Re-aplica
        } else {
            // Gestão usa fonte padrão para tabelas
            document.documentElement.classList.remove('font-normal', 'font-large', 'font-xl');
        }
    }
};
