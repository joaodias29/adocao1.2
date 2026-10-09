window.App.router.start = function() {
    window.addEventListener('hashchange', this.handleRoute.bind(this));
    this.handleRoute();
};

window.App.router.handleRoute = function() {
    const hash = window.location.hash || '#/';
    const isGestao = hash.startsWith('#/gestao');
    
    // Switch de Shell Arquitetural
    if (isGestao && window.App.state.shell !== 'site') window.App.switchShell('site');
    else if (!isGestao && window.App.state.shell !== 'app') window.App.switchShell('app');

    window.App.lib.speak(''); 
    
    if (isGestao) {
        // Fluxo Gestão (Auth Guard)
        if (hash !== '#/gestao/login' && !sessionStorage.getItem('cc_gestao_auth')) {
            window.location.hash = '#/gestao/login';
            return;
        }

        const root = document.getElementById('gestao-root');
        root.innerHTML = '';
        
        if (hash !== '#/gestao/login' && !document.getElementById('gestao-sidebar-nav')) {
            window.App.gestao.renderLayout();
        } else if (hash === '#/gestao/login') {
            document.getElementById('gestao-sidebar').innerHTML = '';
            document.getElementById('gestao-header').innerHTML = '';
        }

        const parts = hash.replace(/^#\/gestao\/?/, '').split('/');
        
        if (hash === '#/gestao/login') return window.App.gestao.screens.Login();
        if (parts[0] === '' || parts[0] === 'painel') return window.App.gestao.screens.Dashboard();
        if (parts[0] === 'leads') return window.App.gestao.screens.Leads();
        if (parts[0] === 'animais') return window.App.gestao.screens.Animais();
        if (parts[0] === 'adocoes') return window.App.gestao.screens.Adocoes();
        if (parts[0] === 'campanhas') return window.App.gestao.screens.Campanhas();
        if (parts[0] === 'mensagens') return window.App.gestao.screens.Mensagens();
        
        return window.App.gestao.screens.Dashboard();

    } else {
        // Fluxo App Público
        const root = document.getElementById('app-root');
        root.innerHTML = '';
        const parts = hash.replace(/^#\//, '').split('/');
        
        if (hash === '#/') return window.App.screens.HomeScreen();
        if (hash === '#/pets') return window.App.screens.PetsScreen();
        if (hash === '#/encontrar') return window.App.screens.QuizScreen();
        if (hash === '#/transicao') return window.App.screens.TransitionScreen();
        if (hash === '#/match-outros') return window.App.screens.MatchOthersScreen();
        if (hash === '#/ong') return window.App.screens.OngScreen();
        if (hash === '#/contato') return window.App.screens.ContactScreen();

        if (parts[0] === 'match' && parts.length === 2) return window.App.screens.MatchScreen(parts[1]);

        if (parts[0] === 'pets' && parts.length >= 2) {
            const slug = parts[1];
            if (parts.length === 2) return window.App.screens.PetProfileScreen(slug);
            if (parts[2] === 'interesse') return window.App.screens.InterestScreen(slug);
            if (parts[2] === 'whatsapp') return window.App.screens.WhatsappScreen(slug);
            if (parts[2] === 'chat') return window.App.screens.ChatScreen(slug);
        }

        root.innerHTML = `<div class="text-center pt-20"><h2 class="text-2xl font-bold">Página não encontrada</h2><a href="#/" class="mt-4 block text-brand-primary underline">Voltar</a></div>`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.App.init();
    window.App.router.start();
});
