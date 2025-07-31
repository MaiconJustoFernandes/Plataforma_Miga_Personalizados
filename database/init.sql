-- Módulo 1: Usuários e Gestão de Acesso
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_type VARCHAR(50) NOT NULL CHECK (profile_type IN ('OPERACIONAL', 'GERENCIAL')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Módulo 2: Entidades de Negócio (Clientes, Fornecedores, Afiliados)
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) CHECK (document_type IN ('CPF', 'CNPJ')),
    document_number VARCHAR(20) UNIQUE,
    whatsapp VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    gender VARCHAR(50) CHECK (gender IN ('MASCULINO', 'FEMININO')),
    birth_date DATE,
    origin VARCHAR(255),
    address_cep VARCHAR(10),
    address_street VARCHAR(255),
    address_number VARCHAR(20),
    address_complement VARCHAR(255),
    address_neighborhood VARCHAR(255),
    address_city VARCHAR(255),
    address_state VARCHAR(2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    document_type VARCHAR(50) CHECK (document_type IN ('CPF', 'CNPJ')),
    document_number VARCHAR(20),
    contact_info VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE affiliates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE,
    contact_info VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    affiliate_type VARCHAR(255),
    commission_rate DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Módulo 3: Estoque e Produtos
CREATE TABLE insums (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    unit_of_measure VARCHAR(50) NOT NULL,
    stock_quantity DECIMAL(10, 2) NOT NULL,
    average_cost DECIMAL(10, 2) NOT NULL,
    updated_at TIMESTAMPTZ
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    sale_price DECIMAL(10, 2) NOT NULL,
    production_cost DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_composition (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    insum_id INT NOT NULL REFERENCES insums(id) ON DELETE RESTRICT,
    quantity_used DECIMAL(10, 2) NOT NULL
);

-- Módulo 4: Ciclo de Vendas (Pedidos)
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(50) NOT NULL CHECK (discount_type IN ('PERCENTUAL', 'FIXO')),
    value DECIMAL(10, 2) NOT NULL,
    quantity_total INT NOT NULL,
    quantity_used INT NOT NULL DEFAULT 0,
    expires_at DATE
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('APROVACAO_PENDENTE', 'PAGAMENTO_PENDENTE', 'AJUSTE_SOLICITADO', 'EM_PRODUCAO_CORTE', 'EM_PRODUCAO_ESTAMPARIA', 'EM_PRODUCAO_CONFECCAO', 'PRONTO_PARA_ENVIO', 'ENVIADO', 'AGUARDANDO_PAGAMENTO_FINAL')),
    order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date DATE NOT NULL,
    delivery_type VARCHAR(255),
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2),
    discount_value DECIMAL(10, 2),
    total_value DECIMAL(10, 2) NOT NULL,
    affiliate_id INT REFERENCES affiliates(id),
    coupon_id INT REFERENCES coupons(id),
    payment_condition VARCHAR(50) CHECK (payment_condition IN ('PIX_100', 'PIX_50_50', 'CARTAO_CREDITO_100')),
    payment_status VARCHAR(50) DEFAULT 'AGUARDANDO_PAGAMENTO' CHECK (payment_status IN ('AGUARDANDO_PAGAMENTO', 'PAGO_PARCIALMENTE', 'PAGO_TOTALMENTE'))
);

CREATE TABLE order_payments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    proof_path VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    color VARCHAR(100),
    size VARCHAR(50),
    notes TEXT
);

CREATE TABLE order_item_files (
    id SERIAL PRIMARY KEY,
    order_item_id INT NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('REFERENCIA', 'ARTE_FINAL', 'MOCKUP')),
    file_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Módulo 5: Financeiro e Marketing
CREATE TABLE financial_transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('ENTRADA', 'SAIDA')),
    description VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    value DECIMAL(10, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    order_id INT REFERENCES orders(id),
    supplier_id INT REFERENCES suppliers(id),
    file_path VARCHAR(500)
);

CREATE TABLE commissions (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE REFERENCES orders(id),
    affiliate_id INT NOT NULL REFERENCES affiliates(id),
    commission_value DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDENTE', 'PAGO', 'PAGO_COM_CREDITO', 'PAGAMENTO_SOLICITADO')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

-- Módulo 6: Sistema e Auditoria
CREATE TABLE order_logs (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id),
    event_description VARCHAR(500) NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    message VARCHAR(500) NOT NULL,
    related_url VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
