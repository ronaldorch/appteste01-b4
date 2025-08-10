-- Script para inserir produtos de cannabis no marketplace
-- Execute após criar as tabelas básicas

-- Limpar dados existentes (opcional)
-- DELETE FROM order_items;
-- DELETE FROM orders;
-- DELETE FROM cart_items;
-- DELETE FROM product_images;
-- DELETE FROM products;
-- DELETE FROM categories;

-- Inserir categorias
INSERT INTO categories (name, description, slug) VALUES 
('Flores', 'Flores de cannabis premium cultivadas com cuidado artesanal', 'flores'),
('Extrações', 'Extratos e concentrados de alta qualidade', 'extracoes')
ON CONFLICT (slug) DO NOTHING;

-- Inserir produtos de Flores
INSERT INTO products (name, description, price, stock_quantity, category_id, slug, featured, image_url) VALUES 
(
    'Colombian Gold', 
    'Strain clássica colombiana conhecida por seus efeitos energizantes e sabor terroso único. Cultivada nas montanhas da Colômbia, esta sativa pura oferece uma experiência cerebral estimulante, perfeita para atividades criativas e sociais. Com níveis moderados de THC (15-20%), proporciona um high limpo e duradouro.',
    45.00, 
    100, 
    (SELECT id FROM categories WHERE slug = 'flores'), 
    'colombian-gold', 
    true, 
    '/placeholder.svg?height=300&width=300'
),
(
    'Califa Kush', 
    'Híbrida californiana premium desenvolvida nos melhores cultivos da Costa Oeste. Com alto teor de THC (22-26%), oferece relaxamento profundo combinado com euforia mental. Ideal para alívio do estresse e dores crônicas. Sabor complexo com notas de pinho, terra e cítricos.',
    55.00, 
    75, 
    (SELECT id FROM categories WHERE slug = 'flores'), 
    'califa-kush', 
    true, 
    '/placeholder.svg?height=300&width=300'
),
(
    'Purple Haze', 
    'Sativa icônica imortalizada por Jimi Hendrix, conhecida por seus tons roxos vibrantes e efeitos criativos intensos. Esta strain oferece uma experiência psicoativa única, estimulando a criatividade e proporcionando energia mental. Sabor doce com notas de frutas vermelhas.',
    50.00, 
    80, 
    (SELECT id FROM categories WHERE slug = 'flores'), 
    'purple-haze', 
    false, 
    '/placeholder.svg?height=300&width=300'
),
(
    'OG Kush', 
    'A lendária strain californiana que definiu o padrão para todas as outras Kush. Com aroma cítrico característico e efeitos balanceados, oferece relaxamento corporal sem sedação excessiva. THC entre 19-24%. Perfeita para uso diurno e noturno.',
    48.00, 
    90, 
    (SELECT id FROM categories WHERE slug = 'flores'), 
    'og-kush', 
    true, 
    '/placeholder.svg?height=300&width=300'
),
(
    'White Widow', 
    'Híbrida holandesa mundialmente famosa por sua potência e produção de resina. Desenvolvida nos coffee shops de Amsterdã, oferece efeitos balanceados entre relaxamento e estimulação mental. Coberta por tricomas brancos que lhe dão o nome característico.',
    52.00, 
    60, 
    (SELECT id FROM categories WHERE slug = 'flores'), 
    'white-widow', 
    false, 
    '/placeholder.svg?height=300&width=300'
),
(
    'Sour Diesel', 
    'Sativa energizante com aroma diesel característico. Conhecida por seus efeitos cerebrais intensos e duradouros, é ideal para combater fadiga e depressão. Popular entre artistas e profissionais criativos por estimular foco e produtividade.',
    47.00, 
    85, 
    (SELECT id FROM categories WHERE slug = 'flores'), 
    'sour-diesel', 
    false, 
    '/placeholder.svg?height=300&width=300'
),
(
    'Blue Dream', 
    'Híbrida californiana balanceada, cruzamento entre Blueberry e Haze. Oferece relaxamento corporal suave com clareza mental. Sabor doce de frutas vermelhas com notas de baunilha. Uma das strains mais populares da Califórnia.',
    49.00, 
    70, 
    (SELECT id FROM categories WHERE slug = 'flores'), 
    'blue-dream', 
    true, 
    '/placeholder.svg?height=300&width=300'
)
ON CONFLICT (slug) DO NOTHING;

-- Inserir produtos de Extrações
INSERT INTO products (name, description, price, stock_quantity, category_id, slug, featured, image_url) VALUES 
(
    'Live Resin Premium', 
    'Extrato fresco produzido a partir de plantas congeladas imediatamente após a colheita, preservando todos os terpenos naturais. Processo de extração com butano em baixas temperaturas mantém o perfil aromático completo. Textura cremosa e sabor intenso que representa fielmente a strain original.',
    80.00, 
    30, 
    (SELECT id FROM categories WHERE slug = 'extracoes'), 
    'live-resin-premium', 
    true, 
    '/placeholder.svg?height=300&width=300'
),
(
    'Shatter Gold', 
    'Concentrado cristalino com pureza excepcional, obtido através de extração com solventes e purificação avançada. Textura vítrea que se quebra como vidro, daí o nome "shatter". Alto teor de THC (80-90%) e sabor limpo. Ideal para dabbing.',
    70.00, 
    25, 
    (SELECT id FROM categories WHERE slug = 'extracoes'), 
    'shatter-gold', 
    false, 
    '/placeholder.svg?height=300&width=300'
),
(
    'Rosin Artesanal', 
    'Extrato premium produzido sem solventes, utilizando apenas calor e pressão. Método artesanal que preserva todos os compostos naturais da planta. Textura oleosa e sabor autêntico. Considerado o método mais puro de extração.',
    90.00, 
    20, 
    (SELECT id FROM categories WHERE slug = 'extracoes'), 
    'rosin-artesanal', 
    true, 
    '/placeholder.svg?height=300&width=300'
),
(
    'Wax Premium', 
    'Concentrado com textura cremosa e maleável, resultado de agitação durante o processo de purificação. Fácil de manusear e ideal para iniciantes em concentrados. Sabor marcante e efeitos potentes. THC entre 70-85%.',
    65.00, 
    35, 
    (SELECT id FROM categories WHERE slug = 'extracoes'), 
    'wax-premium', 
    false, 
    '/placeholder.svg?height=300&width=300'
),
(
    'Hash Tradicional', 
    'Haxixe produzido com métodos ancestrais de separação de tricomas. Prensado à mão e curado lentamente para desenvolver sabores complexos. Textura maleável e cor escura característica. Uma das formas mais antigas de concentrado de cannabis.',
    60.00, 
    40, 
    (SELECT id FROM categories WHERE slug = 'extracoes'), 
    'hash-tradicional', 
    false, 
    '/placeholder.svg?height=300&width=300'
),
(
    'Bubble Hash', 
    'Hash produzido com água gelada e agitação, separando os tricomas sem uso de solventes. Diferentes graus de pureza (microns) oferecem experiências variadas. Textura granulada e sabor intenso. Método de extração limpo e natural.',
    75.00, 
    28, 
    (SELECT id FROM categories WHERE slug = 'extracoes'), 
    'bubble-hash', 
    true, 
    '/placeholder.svg?height=300&width=300'
),
(
    'Distillate THC', 
    'Destilado puro de THC com concentração de 90-95%. Produto refinado através de destilação molecular, removendo todos os outros compostos. Sem sabor ou aroma, ideal para uso medicinal preciso ou para adicionar a outros produtos.',
    85.00, 
    22, 
    (SELECT id FROM categories WHERE slug = 'extracoes'), 
    'distillate-thc', 
    false, 
    '/placeholder.svg?height=300&width=300'
)
ON CONFLICT (slug) DO NOTHING;

-- Verificar inserção
SELECT 'Produtos inseridos com sucesso!' as status;
SELECT c.name as categoria, COUNT(p.id) as total_produtos 
FROM categories c 
LEFT JOIN products p ON c.id = p.category_id 
GROUP BY c.name, c.id 
ORDER BY c.id;
