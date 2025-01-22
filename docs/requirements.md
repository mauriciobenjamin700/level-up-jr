# Requisitos do Sistema

O sistema será uma **API REST** projetada para permitir a criação, gerenciamento e venda de ingressos por meio de parceiros. Ele será escalável para lidar com milhares de acessos simultâneos.

## Regra de Negócio

- 1 Gerenciamento de Tickets
  - Apenas o parceiro criador do evento pode gerenciar os tickets associados.
  - Tickets são criados em lote e começam com o status "disponível".
- 2 Compra de Tickets
  - Um cliente pode comprar vários tickets de diferentes eventos em uma única compra.
  - Somente um cliente pode comprar um ticket específico por vez (controle de concorrência).
  - Se a compra falhar, os dados devem ser registrados com o motivo da falha.
- 3 Cancelamento de compras
  - Um cliente pode cancelar a compra, liberando os tickets para venda novamente.
  - O histórico de alterações de status deve ser mantido.
- 4 Escalabilidade
  - O sistema deve suportar altas cargas de acessos simultâneos.
- 5 Parceiros
  - Parceiros serão registrados no sistema e terão acesso a um painel de controle.
  - Parceiros podem criar eventos e gerenciar os tickets associados.
  - Parceiros podem visualizar as vendas de tickets associados a seus eventos.
- 6 Clientes
  - Clientes serão registrados no sistema e poderão comprar tickets para eventos.
  - Clientes podem visualizar os eventos disponíveis e comprar tickets.
  - Clientes podem cancelar suas compras e visualizar o histórico de compras.

## Entidades Principais

- 1 **Parceiros**:
  - **Descrição**: Representa os criadores de eventos e tickets
  - **Campos**:
    - `id`: Identificador único.
    - `nome`: Nome completo do parceiro.
    - `email`: E-mail para login e contato.
    - `senha`: Senha criptografada.
    - `nome da empresa`: Nome da empresa associada.

- 2 **Clientes**:
  - **Descrição**: Representa os compradores de ingressos.
  - **Campos**:
    - `id`: Identificador único.
    - `nome`: Nome completo do cliente.
    - `email`: E-mail para login e contato.
    - `senha`: Senha criptografada.
    - `endereço`: Endereço do cliente.
    - `telefone`: Telefone do cliente.

- 3 **Eventos**:
  - **Descrição**: Representa os eventos criados pelos parceiros.
  - **Campos**:
    - `id`: Identificador único
    - `nome`: Nome do evento.
    - `descrição`: Descrição do evento.
    - `data`: Data e hora do evento.
    - `local`: Local onde será realizado o evento.
- 4 **Ticket**
  - **Descrição**: Representam os ingressos disponíveis para cada evento.
  - **Campos**:
    - `id`: Identificador único.
    - `id do evento`: ID do evento associado.
    - `local`: Identificador do assento (e.g., A1, B2).
    - `preço`: Preço do ticket
    - `status`: Disponível, Vendido.
