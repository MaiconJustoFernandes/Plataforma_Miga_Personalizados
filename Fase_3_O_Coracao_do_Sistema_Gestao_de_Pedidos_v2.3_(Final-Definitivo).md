Plano de Execução - Fase 3: O Coração do Sistema - Gestão de Pedidos
Status: Pronto para Execução
Versão: 2.3 (Final-Definitivo)

1. Contexto Mestre do Projeto (Briefing Essencial)
Visão do Projeto: Criar uma plataforma digital que se adapte perfeitamente ao fluxo de trabalho da Miga Personalizados, centralizando a gestão de pedidos, estoque, custos e finanças para aumentar a eficiência e fornecer dados estratégicos.

Arquitetura e Stack Tecnológica:

Backend: Node.js com NestJS (TypeScript)

Frontend: React.js com TypeScript (Vite)

Banco de Dados: PostgreSQL

Fonte da Verdade (Requisitos): Todos os Requisitos Funcionais (RF) e Não Funcionais (RNF) foram previamente definidos e validados pelo Orientador. As tarefas detalhadas nesta fase são a implementação técnica desses requisitos. O seu foco é na execução técnica precisa, não na reinterpretação da funcionalidade.

2. Requisitos e Regras de Negócio Aplicáveis a esta Fase
RF01 - Gestão de Pedidos: O cadastro do pedido deve conter: Nº do Pedido, Data de Abertura, Data Prevista de Entrega, Itens do Pedido, Valores do Pedido (Subtotal, Frete, Descontos), e Tipo de Entrega.

RF02 - Módulo de Design: Permitir o upload de: Imagens de Referência, Arte Final e Mockup.

RF03 - Fluxo de Aprovação Externa: A "Página de Aprovação" deve exibir os dados do pedido, arte e mockup, e botões de ação.

RF05 - Gestão de Pagamentos: Permitir upload de comprovante e validação manual.

RF21 - Log de Atividades do Pedido: O sistema registrará automaticamente, em um feed cronológico, todos os eventos importantes.

RF23 - Gestão de Campanhas de Cupons (Aplicação): Permitir a aplicação de um cupom válido no pedido. (Nota: A criação das campanhas será na Fase 5).

Regra de Negócio de Pagamento: O sistema deve controlar pagamentos parciais (50/50) ou totais.

Regra de Negócio Crítica (Baixa de Estoque): A baixa de estoque ocorre após a confirmação do primeiro pagamento.

3. Objetivo da Fase
Construir o fluxo de ponta a ponta para a gestão de pedidos. Ao final, um usuário poderá criar um novo pedido, aplicar descontos, definir a condição de pagamento, registrar pagamentos, anexar arquivos de design, gerenciar o ciclo de aprovação e produção, e garantir que a baixa de estoque ocorra no momento correto.

4. Contexto Específico da Fase
A Fase 2 foi concluída. O sistema agora possui funcionalidades CRUD completas para Clientes, Fornecedores, Insumos e Produtos.

5. Modelos de Tela (Wireframes Textuais)
Modelo 1: Seção de Valores e Descontos na Criação do Pedido

+------------------------------------------------------+
| Resumo Financeiro                                    |
|------------------------------------------------------|
| Subtotal dos Itens: R$ 300,00                        |
| Frete: [Campo para inserir valor] R$ 20,00           |
| Desconto Manual (R$): [Campo para inserir valor] R$ 10,00 |
| Cupom de Desconto: [Campo para inserir código]       |
| [Botão: Aplicar Cupom] | Desconto do Cupom: -R$ 31,00 |
|------------------------------------------------------|
| TOTAL DO PEDIDO: R$ 279,00                           |
+------------------------------------------------------+

Modelo 2: Seção de Pagamento na Criação do Pedido

+------------------------------------------------------+
| Condições de Pagamento                               |
|------------------------------------------------------|
| ( ) PIX - 100% no ato                                |
| ( ) PIX - 50% no ato, 50% antes do envio             |
| ( ) Cartão de Crédito - 100% no ato                  |
+------------------------------------------------------+

Modelo 3: Seção de Pagamento nos Detalhes do Pedido

+------------------------------------------------------+
| Gestão de Pagamentos                                 |
|------------------------------------------------------|
| Valor Total: R$ 279,00   | Pago: R$ 139,50           |
| Saldo Devedor: R$ 139,50 | Status: PAGO_PARCIALMENTE |
|------------------------------------------------------|
| [Botão: Registrar Novo Pagamento]                    |
|------------------------------------------------------|
| Histórico de Pagamentos:                             |
| - 18/07/2025 | PIX | R$ 139,50 | [Ver Comprovante]   |
+------------------------------------------------------+

6. Sua Missão (Tarefas Detalhadas)
Tarefa 3.1: Adaptação do Banco de Dados
Ação: Modificar a estrutura do banco de dados para suportar as novas regras.

Detalhes:

Modificar Tabela orders: Altere o ENUM do campo status para incluir AGUARDANDO_PAGAMENTO_FINAL. Adicione os campos payment_condition, payment_status e coupon_id (FK para a tabela coupons).

Criar Nova Tabela order_payments: Crie uma tabela para registrar cada pagamento individual. Ela deve conter id, order_id (FK), amount, payment_method, payment_date, e proof_path.

Tarefa 3.2: Criação do Pedido (Implementa RF01, RF23 e Regra de Pagamento)
Backend:

Crie os módulos orders e order-items.

Implemente a lógica para gerar o número do pedido (PROD-DDMMAAAAXXXX).

No endpoint POST /orders, a lógica deve:

Aceitar discount_value e coupon_code.

Se um coupon_code for fornecido, validar sua existência e regras na tabela coupons.

Calcular o total_value final do pedido, aplicando todos os descontos.

Salvar a payment_condition e o coupon_id (se houver).

Frontend:

Crie a página CreateOrderPage.tsx.

Na etapa final do assistente, adicione as seções "Resumo Financeiro" (conforme Modelo 1) e "Condições de Pagamento" (conforme Modelo 2). A interface deve recalcular o total em tempo real.

Tarefa 3.3: Detalhes do Pedido e Gestão de Pagamentos (Implementa RF02, RF05, RF21)
Backend:

Crie o módulo order-payments com um endpoint POST /orders/:id/payments para registrar um novo pagamento.

A lógica deste endpoint deve: criar o registro do pagamento, recalcular e atualizar o payment_status do pedido, e, se for o primeiro pagamento, acionar a baixa de estoque.

Implemente o módulo order_logs para registrar todos os eventos.

Frontend:

Crie a página OrderDetailsPage.tsx.

Implemente a seção "Gestão de Pagamentos" conforme o Modelo 3.

Tarefa 3.4: Fluxo de Aprovação e Produção
Backend:

Crie os endpoints para o fluxo de aprovação do cliente.

Implemente a lógica de status: se a condição for PARCIAL_50_50 e o pedido estiver PRONTO_PARA_ENVIO, o status deve mudar para AGUARDANDO_PAGAMENTO_FINAL até que o pagamento total seja confirmado.

Frontend:

Implemente a página de aprovação externa e a lógica para "Solicitação de Alteração" na tela de detalhes.

Tarefa 3.5: Implementação da Baixa de Estoque Automática
Backend:

Crie o serviço StockService.ts com o método decreaseStockForOrder(orderId).

Teste Unitário Obrigatório: Crie testes unitários com Jest para este método.

Integração com Transação: No OrderPaymentsService, a operação inteira (criar pagamento, atualizar status, dar baixa no estoque) deve estar em uma única transação de banco de dados.

7. Instruções Gerais para o Agente
Transações: O uso de transações de banco de dados é obrigatório para as operações de registro de pagamento.

Qualidade: A lógica de baixa de estoque e o controle de status de pagamento são críticos. Os testes unitários são obrigatórios.

Autonomia: Você tem todas as informações necessárias neste documento para completar a fase. Execute as tarefas conforme detalhado.