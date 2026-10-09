# Um Clique, Uma Companhia - Dual Interface App

Este projeto é um protótipo de impacto social construído em Vanilla HTML/CSS/JS (sem dependências como Node.js ou empacotadores), criado para facilitar a adoção de animais por pessoas idosas.

## 🏗️ Nova Arquitetura Dual-Shell (Parte 4 Revisada)
O sistema opera com uma abordagem de "Dois Shells" residindo no mesmo `index.html`. O roteamento (via `#/`) decide qual CSS e HTML base será exibido. Nenhuma formatação de um shell vaza para o outro.

1. **[APP PÚBLICO] `#/` até `#/pets`:** Emula um aplicativo de celular no desktop (limitado a ~480px, centralizado) ou preenche a tela em smartphones. Regido pelo atributo `data-shell="app"`. Focado em letras imensas, contraste alto e leitura para seniores. Oculta logicamente pets adotados e indisponíveis.
2. **[SITE GESTÃO] `#/gestao...`:** Acesso à intranet da ONG. Funciona como um Painel Admin tradicional desktop-first, preenchendo 100% da largura, contendo Sidebars e Tabelas. Regido pelo atributo `data-shell="site"`.

## 🔒 Acesso à Gestão (ONG)
Para entrar no painel de administração:
1. Acesse `index.html#/gestao`
2. Insira o PIN de demonstração: **1234**
*(Lembrete: Esta é uma trava visual via sessionStorage para fins de prototipagem acadêmica, e não uma autenticação segura real)*

## 🐕 Regras de Negócio e Adoções (Kanban)
Os Pets possuem o atributo dinâmico de `status`. Todo o sistema reage automaticamente a isso:
- **Disponível:** Visível nas buscas, quiz e com botão de adoção livre.
- **Em Processo:** Quando a ONG avança um lead para *Registrar Adoção*. O Pet perde o botão de Interesse no App Público e ganha uma faixa avisando que já está em entrevistas.
- **Adotado:** O animal some das abas de busca/quiz e move-se automaticamente para o mural estático de "Histórias em Destaque".
- **Indisponível:** Oculto do público.

Na tela `#/gestao/adocoes`, o gestor pode mover a adoção pelas esteiras (Análise, Entrevista, Visita, Termo, Concluída ou Cancelada). **Concluir a adoção muda automaticamente o status do Pet para Adotado**. Cancelar, o devolve a Disponível. O banco possui travas em memória que impedem iniciar duas adoções ativas para um mesmo animal.

## 🛠 Como Rodar Localmente e Limitações
1. Você pode abrir o arquivo `index.html` diretamente (Duplo Clique) no seu navegador, ou usar uma extensão genérica como *Live Server*.
2. Todo o armazenamento é feito via `localStorage` (Armazenamento Local) do seu próprio navegador. Isso significa que as edições não se comunicam com a internet ou outros computadores.

## 🚀 Próximos Passos Imediatos (Para virar Produto Real)
Para conectar esse protótipo à internet de forma efetiva:
1. Trocar os métodos de `js/services.js` por chamadas à API do **Firebase** ou **Supabase**. Essa é a única camada de dados, portanto todo o front-end está isolado e pronto para a troca.
2. Usar o Firebase Auth para travar a rota `#/gestao` de forma segura.
