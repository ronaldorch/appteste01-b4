-- Atualizar produtos existentes com temática cannabis

-- Limpar produtos existentes
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM categories;

-- Inserir categorias de cannabis
INSERT INTO categories (name, description, slug) VALUES
('Sementes Premium', 'Sementes de cannabis de alta qualidade, genéticas exclusivas', 'sementes'),
('Acessórios', 'Acessórios para cultivo e consumo de cannabis', 'acessorios'),
('Extratos & Óleos', 'Extratos, óleos e concentrados de cannabis', 'extratos'),
('Vaporizadores', 'Vaporizadores e dispositivos para cannabis', 'vaporizadores'),
('Cultivo Indoor', 'Equipamentos para cultivo indoor de cannabis', 'cultivo');

-- Inserir produtos de cannabis fictícios
INSERT INTO products (name, description, price, stock_quantity, category_id, user_id, slug, featured) VALUES
-- Sementes
('White Widow Feminizada', 'Sementes feminizadas da lendária White Widow, 20% THC, floração 8-9 semanas', 89.90, 50, 1, 1, 'white-widow-feminizada', true),
('OG Kush Auto', 'Sementes autoflorescentes OG Kush, genética premium californiana', 79.90, 30, 1, 1, 'og-kush-auto', true),
('Northern Lights', 'Clássica Northern Lights, indica pura, relaxamento profundo', 69.90, 40, 1, 1, 'northern-lights', false),
('Sour Diesel Sativa', 'Energética Sour Diesel, sativa pura, efeito cerebral intenso', 94.90, 25, 1, 1, 'sour-diesel-sativa', true),

-- Acessórios
('Grinder Premium Alumínio', 'Grinder de alumínio anodizado, 4 partes, ímã forte', 45.90, 100, 2, 1, 'grinder-premium-aluminio', false),
('Papel de Seda King Size', 'Papel de seda premium, queima lenta, sem sabor', 12.90, 200, 2, 1, 'papel-seda-king-size', false),
('Bong Vidro Borosilicato', 'Bong artesanal em vidro borosilicato, 35cm altura', 189.90, 15, 2, 1, 'bong-vidro-borosilicato', true),
('Piteira de Vidro Premium', 'Piteiras de vidro temperado, reutilizáveis, pack com 5', 29.90, 80, 2, 1, 'piteira-vidro-premium', false),

-- Extratos
('Óleo CBD 10%', 'Óleo de CBD full spectrum 10%, frasco 30ml, orgânico', 299.90, 20, 3, 1, 'oleo-cbd-10-porcento', true),
('Hash Marroquino Premium', 'Hash artesanal estilo marroquino, 40% THC, textura cremosa', 159.90, 10, 3, 1, 'hash-marroquino-premium', true),
('Rosin Press Caseiro', 'Extrato rosin prensado a frio, sem solventes, 70% THC', 249.90, 8, 3, 1, 'rosin-press-caseiro', false),

-- Vaporizadores
('Vaporesso XMAX V3 Pro', 'Vaporizador portátil premium, controle de temperatura', 399.90, 12, 4, 1, 'vaporesso-xmax-v3-pro', true),
('Mighty+ Storz & Bickel', 'O melhor vaporizador portátil do mundo, alemão', 1299.90, 5, 4, 1, 'mighty-plus-storz-bickel', true),
('Arizer Solo 2', 'Vaporizador de mesa, vidro borosilicato, bateria longa', 899.90, 8, 4, 1, 'arizer-solo-2', false),

-- Cultivo
('LED Full Spectrum 600W', 'Painel LED full spectrum para cultivo, 600W reais', 899.90, 15, 5, 1, 'led-full-spectrum-600w', true),
('Grow Tent 120x120x200', 'Estufa para cultivo indoor, mylar refletivo, zíperes YKK', 459.90, 10, 5, 1, 'grow-tent-120x120x200', false),
('Fertilizante Orgânico Bloom', 'Fertilizante orgânico para floração, NPK balanceado', 89.90, 50, 5, 1, 'fertilizante-organico-bloom', false),
('Exaustor Inline 150mm', 'Exaustor inline silencioso, 150mm, 520m³/h', 299.90, 20, 5, 1, 'exaustor-inline-150mm', false);

-- Inserir imagens dos produtos
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
-- Sementes
(1, '/placeholder.svg?height=400&width=400&text=🌱+White+Widow', 'Sementes White Widow', true, 1),
(2, '/placeholder.svg?height=400&width=400&text=🌿+OG+Kush', 'Sementes OG Kush Auto', true, 1),
(3, '/placeholder.svg?height=400&width=400&text=🌙+Northern+Lights', 'Sementes Northern Lights', true, 1),
(4, '/placeholder.svg?height=400&width=400&text=⚡+Sour+Diesel', 'Sementes Sour Diesel', true, 1),

-- Acessórios
(5, '/placeholder.svg?height=400&width=400&text=⚙️+Grinder', 'Grinder Premium', true, 1),
(6, '/placeholder.svg?height=400&width=400&text=📄+Papel', 'Papel de Seda', true, 1),
(7, '/placeholder.svg?height=400&width=400&text=🫧+Bong', 'Bong de Vidro', true, 1),
(8, '/placeholder.svg?height=400&width=400&text=🔥+Piteira', 'Piteira de Vidro', true, 1),

-- Extratos
(9, '/placeholder.svg?height=400&width=400&text=💧+CBD+Oil', 'Óleo CBD', true, 1),
(10, '/placeholder.svg?height=400&width=400&text=🟫+Hash', 'Hash Marroquino', true, 1),
(11, '/placeholder.svg?height=400&width=400&text=🍯+Rosin', 'Rosin Press', true, 1),

-- Vaporizadores
(12, '/placeholder.svg?height=400&width=400&text=📱+Vaporesso', 'Vaporesso XMAX', true, 1),
(13, '/placeholder.svg?height=400&width=400&text=💪+Mighty', 'Mighty Plus', true, 1),
(14, '/placeholder.svg?height=400&width=400&text=🌡️+Arizer', 'Arizer Solo 2', true, 1),

-- Cultivo
(15, '/placeholder.svg?height=400&width=400&text=💡+LED', 'LED Full Spectrum', true, 1),
(16, '/placeholder.svg?height=400&width=400&text=🏠+Grow+Tent', 'Grow Tent', true, 1),
(17, '/placeholder.svg?height=400&width=400&text=🌱+Fertilizante', 'Fertilizante Bloom', true, 1),
(18, '/placeholder.svg?height=400&width=400&text=💨+Exaustor', 'Exaustor Inline', true, 1);

SELECT 'Produtos de cannabis fictícios inseridos com sucesso!' as status;
