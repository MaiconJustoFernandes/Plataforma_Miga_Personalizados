Plano de Execução - Fase 2: Cadastros Fundamentais (CRUDs)
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
RF13 - Cadastro e Gestão de Clientes:

RF13.1 - Cadastro e Edição de Cliente: O sistema deve permitir o cadastro e edição de clientes com os campos: Nome Completo, CPF/CNPJ, Contato Principal (WhatsApp), E-mail, Sexo (Masculino/Feminino), Data de Nascimento, e Origem (como nos conheceu). O endereço será composto por campos separados: CEP, Rua, Número, Complemento, Bairro, Cidade e Estado. Preenchimento automático de endereço via CEP.

RF13.2 - Listagem e Busca de Clientes: Apresentar uma tela com a lista de todos os clientes, com ferramentas de busca.

RF13.3 - Ficha do Cliente: Exibir uma ficha detalhada com abas: Dados Cadastrais, Histórico de Pedidos e Observações. (Nota: Histórico e Observações serão implementados em fases futuras).

RF14 - Cadastro de Insumos: Permitir o cadastro de cada matéria-prima com os campos obrigatórios: Nome do Insumo, Unidade de Medida, Estoque Atual e Custo Médio Ponderado.

RF15 - Cadastro de Produtos Acabados: Permitir o cadastro de cada produto final com os campos: Nome do Produto, Preço de Venda, Custo de Produção e Margem de Lucro. (Nota: Custo e Margem serão calculados automaticamente com base na ficha).

RF16 - Ficha de Composição: Para cada produto, permitir a montagem de sua ficha técnica.

RF18 - Cadastro de Fornecedores: Implementar um cadastro simplificado de fornecedores.

3. Objetivo da Fase
Implementar a gestão completa (Criar, Ler, Atualizar, Deletar) das entidades essenciais do negócio: Clientes, Fornecedores, Insumos e Produtos. Ao final, o usuário poderá popular o sistema com seus dados base através de interfaces funcionais.

4. Contexto Específico da Fase
A Fase 1 foi concluída. O sistema agora possui:

Backend com endpoints de registro e login funcionais e um AuthGuard para proteger rotas.

Frontend com fluxo de autenticação, layout principal e rotas protegidas. O AuthContext gerencia o estado do usuário e uma instância axios centralizada está configurada.

5. Sua Missão (Tarefas Detalhadas)
Para cada tarefa abaixo, o fluxo de trabalho é similar:

Backend:

Criar a Entity do TypeORM.

Criar o DTO (Data Transfer Object) com validações (class-validator).

Criar o Service com a lógica de negócio (CRUD).

Criar o Controller com os endpoints da API (/resource), protegidos pelo AuthGuard.

Frontend:

Criar o service (frontend/src/services/resource.service.ts) com as chamadas axios para a API.

Criar a página de listagem (frontend/src/pages/ResourceListPage.tsx). (NOVO) Detalhe de UI: Todas as páginas de listagem devem incluir um campo de busca proeminente no topo da tabela, que filtre os resultados exibidos em tempo real.

Criar o formulário de cadastro/edição (usando Mantine Modal ou uma nova página) com validação (@mantine/form).

Tarefa 2.1: CRUD de Clientes (Implementa RF13)
Backend:

Implemente o módulo customers com endpoints: GET /customers, GET /customers/:id, POST /customers, PUT /customers/:id, DELETE /customers/:id.

Frontend:

Crie a página de listagem de clientes com a funcionalidade de busca.

No formulário de cliente, implemente a busca de endereço por CEP. Ao digitar o CEP e o campo perder o foco, faça uma chamada a uma API pública (ex: https://viacep.com.br/ws/SEU_CEP/json/) e preencha os campos de endereço.

(NOVO) Validação de Dados: Implemente validações de formato no frontend para os campos CPF/CNPJ e WhatsApp, fornecendo feedback imediato ao usuário se o formato estiver incorreto.

Tarefa 2.2: CRUD de Fornecedores (Implementa RF18)
Backend: Implemente o módulo suppliers com endpoints CRUD completos.

Frontend: Crie a página de listagem de fornecedores com busca e o formulário para a gestão de fornecedores, seguindo o padrão da tarefa 2.1.

Tarefa 2.3: CRUD de Insumos (Implementa RF14)
Backend: Implemente o módulo insums com endpoints CRUD completos.

Frontend: Crie a página de listagem de insumos com busca e o formulário para a gestão de insumos (matéria-prima).

Tarefa 2.4: CRUD de Produtos Acabados e Ficha de Composição (Implementa RF15, RF16)
Backend:

Implemente o módulo products com endpoints CRUD.

A rota POST /products e PUT /products/:id deve aceitar, além dos dados do produto, um array de composition: [{ insumId: number, quantityUsed: number }].

O serviço deve gerenciar a criação/atualização do produto e de suas associações na tabela product_composition dentro de uma transação de banco de dados para garantir a consistência.

Frontend:

Crie a página de listagem de produtos com busca.

Na página de gestão de produtos, o formulário deve ter uma seção especial para a "Ficha de Composição".

Use um componente de lista dinâmica onde o usuário pode clicar em "Adicionar Insumo", abrir um seletor com os insumos já cadastrados, definir a quantidade e adicionar à lista. Cada item da lista deve ter um botão para remover.

(NOVO) Cálculo em Tempo Real: Conforme o usuário adiciona, remove ou altera a quantidade de insumos na Ficha de Composição, a interface deve calcular e exibir o "Custo de Produção" total em tempo real em um campo de destaque no formulário.

6. Instruções Gerais para o Agente
Consistência de UI: Utilize os componentes da biblioteca Mantine para todas as tabelas, formulários, modais e notificações, garantindo uma experiência de usuário coesa.

Feedback ao Usuário: Todas as ações (salvar, editar, deletar) devem exibir notificações de sucesso ou erro (ex: Mantine Notifications). Ações de exclusão devem usar um modal de confirmação (Mantine.Modals).

Autonomia: Você tem todas as informações necessárias neste documento para completar a fase. Execute as tarefas conforme detalhado.