Plano de Execução - Fase 1: Autenticação e Layout Base
Status: Pronto para Execução
Versão: 2.1 (Definitivo)

1. Contexto Mestre do Projeto (Briefing Essencial)
Visão do Projeto: Criar uma plataforma digital que se adapte perfeitamente ao fluxo de trabalho da Miga Personalizados, centralizando a gestão de pedidos, estoque, custos e finanças para aumentar a eficiência e fornecer dados estratégicos.

Arquitetura e Stack Tecnológica:

Backend: Node.js com NestJS (TypeScript)

Frontend: React.js com TypeScript (Vite)

Banco de Dados: PostgreSQL

Padrão Arquitetural: Monolito Modular

Fonte da Verdade (Requisitos): Todos os Requisitos Funcionais (RF) e Não Funcionais (RNF) foram previamente definidos e validados pelo Orientador. As tarefas detalhadas nesta fase são a implementação técnica desses requisitos. O seu foco é na execução técnica precisa, não na reinterpretação da funcionalidade.

2. Requisitos e Regras de Negócio Aplicáveis a esta Fase
RF19 - Gestão de Usuários e Permissões: Uma área restrita ao perfil Gerencial para criar, editar e desativar usuários do sistema.

Aplicação nesta fase: A implementação do endpoint de registro (POST /auth/register) e a criação da entidade User com um profile_type ('OPERACIONAL', 'GERENCIAL') são os primeiros passos fundamentais para este requisito.

RNF01 - Usabilidade: Interface limpa e intuitiva.

Aplicação nesta fase: A criação do layout principal com componentes da biblioteca Mantine e a implementação de um fluxo de login claro e com feedback ao usuário (spinners, mensagens de erro) são a base para cumprir este requisito.

RNF02 - Segurança: Acesso por login/senha, logs de auditoria, autenticação segura para portal externo.

Aplicação nesta fase: O uso de bcrypt para o hash de senhas, a implementação de autenticação via JSON Web Tokens (JWT) e a validação de força da senha são a implementação direta e crítica deste requisito.

3. Objetivo da Fase
Implementar o fluxo completo de autenticação de usuário e construir a estrutura visual principal (layout) da aplicação. Ao final desta fase, um usuário deverá conseguir se registrar, fazer login, e ver a "casca" do sistema com navegação, sendo redirecionado caso não esteja autenticado.

4. Contexto Específico da Fase
A Fase 0 foi concluída. O workspace agora contém:

Uma pasta database com o script init.sql completo.

Um projeto na pasta backend com a estrutura base do NestJS e conexão com o DB configurada.

Um projeto na pasta frontend com a estrutura base do React/Vite e a biblioteca Mantine UI instalada.

5. Sua Missão (Tarefas Detalhadas)
Tarefa 1.1: Implementação do Módulo de Usuários e Autenticação (Backend)
Ação: Codificar os endpoints de registro e login.

Detalhes:

Módulo users: Crie a entidade TypeORM User correspondente à tabela users. Crie o serviço users.service.ts com um método create que recebe os dados do usuário, faz o hash da senha usando bcrypt e salva no banco.

Módulo auth: Crie o auth.controller.ts.

Implemente a rota POST /auth/register. Ela deve chamar o users.service.create.

Implemente a rota POST /auth/login. A lógica deve buscar o usuário pelo email, comparar a senha com bcrypt.compare, e se for válida, gerar um token JWT (usando @nestjs/jwt) contendo o ID e o perfil do usuário.

Implemente um AuthGuard global ou específico que proteja rotas futuras, validando o token JWT do header Authorization.

Logging Estruturado: Configure um logger estruturado (como o Logger nativo do NestJS). Use-o para registrar eventos importantes, como tentativas de login (sucesso e falha) e erros inesperados no módulo de autenticação.

Critério de Conclusão: Os endpoints /auth/register e /auth/login estão funcionais. Rotas de teste protegidas pelo AuthGuard retornam 401 Unauthorized sem um token válido. Logs de autenticação são gerados.

Tarefa 1.2: Criação da Tela de Login e Registro (Frontend)
Ação: Construir as interfaces de autenticação.

Detalhes:

Configuração da API: Crie um arquivo frontend/src/services/api.ts para configurar uma instância centralizada do axios. Esta instância deve ser pré-configurada para usar a URL base do backend e para interceptar requisições, adicionando automaticamente o token JWT do localStorage ao header Authorization. Todas as chamadas de serviço devem usar esta instância.

Crie as páginas LoginPage.tsx e RegisterPage.tsx em frontend/src/pages.

Desenvolva a UI para ambas as telas usando componentes Mantine.

(NOVO) Validação de Senha: Na página de registro, utilize o componente PasswordInput do Mantine. Configure-o para exibir um medidor de força da senha. A senha deve exigir no mínimo: 8 caracteres, uma letra maiúscula, um número e um caractere especial. O botão de registro deve permanecer desabilitado até que todos os requisitos sejam cumpridos.

Crie um AuthContext para gerenciar o estado de autenticação (token, dados do usuário) e prover as funções de login, register e logout para toda a aplicação.

Implemente a lógica nos formulários para chamar os endpoints do backend (usando a instância centralizada do axios). Em caso de sucesso no login/registro, salve o token no AuthContext e no localStorage e redirecione o usuário para a página principal (/).

Critério de Conclusão: O usuário consegue se registrar (com validação de força da senha), ser redirecionado para o login, fazer login e ser redirecionado para a página principal. As chamadas de API são feitas através de uma instância axios centralizada.

Tarefa 1.3: Criação do Layout Principal e Rotas Protegidas (Frontend)
Ação: Construir a estrutura visual pós-login e proteger o acesso.

Detalhes:

Crie os componentes Header.tsx, Sidebar.tsx e AppLayout.tsx em frontend/src/components/layout.

(NOVO) Detalhamento da UI:

O componente Header deve conter, à direita, um ícone de sino para notificações (RF22, funcionalidade a ser implementada no futuro) e um menu de perfil do usuário (exibindo o nome do usuário logado e uma opção de "Sair").

O componente Sidebar deve exibir o logo da Miga Personalizados no topo e uma lista de links de navegação verticais com ícone e texto para os módulos principais: "Dashboard", "Pedidos", "Clientes", "Estoque", "Financeiro" e "Configurações".

Crie um componente ProtectedRoute.tsx. Ele deve verificar se o usuário está autenticado (usando o AuthContext). Se estiver, renderiza a página filha (children). Se não, redireciona para /login.

No App.tsx, configure o react-router-dom para que as rotas do sistema (ex: /, /customers) sejam envolvidas pelo ProtectedRoute e pelo AppLayout.

Critério de Conclusão: Um usuário não logado que tenta acessar / é redirecionado para /login. Um usuário logado vê o layout principal com cabeçalho e barra lateral, conforme especificado.

6. Instruções Gerais para o Agente
Segurança: Use bcrypt para senhas. Nunca armazene senhas em texto plano. O token JWT deve ter um tempo de expiração.

UX: Forneça feedback claro ao usuário durante o login (spinners de carregamento, mensagens de erro) e registro (validação de senha em tempo real).

Autonomia: Você tem todas as informações necessárias neste documento para completar a fase. Execute as tarefas conforme detalhado.