-- Fellas Honey - Realistic Artisanal Indian Honey Seed Data
-- Run this in Supabase Dashboard -> SQL Editor to seed Indian honey catalog

-- 1. SEED PRODUCTS
INSERT INTO public.products (
  id, name, slug, description, price, compare_price, weight, category, image_url, rating, stock, ingredients, benefits, storage_instructions, is_featured, is_active
) VALUES 
(
  'e2b7617c-17b5-4b06-a2cb-0c9f131a4701',
  'Coorg Multi-Floral Raw Wild Honey',
  'coorg-wildflower-honey',
  'Harvested from dense coffee and spice estates in the misty Western Ghats of Coorg, Karnataka. Unfiltered, rich in natural pollen with a distinctive floral aroma.',
  399.00,
  499.00,
  '500g',
  'Wildflower',
  'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
  4.95,
  120,
  '100% Pure Raw Multi-Floral Wild Honey from Coorg, Karnataka.',
  'Rich in natural pollen, live digestive enzymes, and botanical antioxidants. Enhances immunity and provides clean natural energy.',
  'Store in a cool, dry place at room temperature. Do not refrigerate. Crystallization is proof of genuine raw honey.',
  true,
  true
),
(
  'e2b7617c-17b5-4b06-a2cb-0c9f131a4702',
  'Himalayan Raw Acacia Blossom Honey',
  'himalayan-acacia-honey',
  'Sourced from wild Robinia acacia flowers in high-altitude Himalayan valleys of Himachal Pradesh & Uttarakhand. Crystal clear golden hue with subtle vanilla notes.',
  549.00,
  649.00,
  '500g',
  'Monofloral',
  'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80',
  4.98,
  95,
  '100% Pure Himalayan Acacia Blossom Nectar.',
  'Low glycemic index, gentle on the stomach, promotes relaxation, and supports gut wellness.',
  'Keep sealed at room temperature away from direct sunlight.',
  true,
  true
),
(
  'e2b7617c-17b5-4b06-a2cb-0c9f131a4703',
  'Nilgiri Deep Forest Wild Honey',
  'nilgiri-forest-honey',
  'Ethically harvested by tribal beekeepers in the pristine Nilgiri biosphere reserve. Deep dark amber texture packed with forest minerals and medicinal goodness.',
  449.00,
  549.00,
  '500g',
  'Raw Honey',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
  4.92,
  85,
  '100% Raw Forest Honey gathered from wild cliffs and sacred groves.',
  'High mineral content (Iron, Potassium, Magnesium) and rich antimicrobial properties for seasonal throat relief.',
  'Store at room temperature in a dry pantry.',
  true,
  true
),
(
  'e2b7617c-17b5-4b06-a2cb-0c9f131a4704',
  'Kashmir Royal White Honey',
  'kashmir-white-honey',
  'An exceptionally rare reserve harvested from alpine wild clover and blossoms in high Kashmir valleys. Naturally turns into a creamy, pearl-white spreadable nectar.',
  899.00,
  1099.00,
  '500g',
  'Rare Reserve',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  5.00,
  40,
  '100% Pure Single-Origin Kashmir White Blossom Honey.',
  'Delicate sweetness, rich in bioactive peptides, superior therapeutic throat soothing, and skin radiance.',
  'Store below 25°C. Enjoy on warm toast or with green tea.',
  true,
  true
),
(
  'e2b7617c-17b5-4b06-a2cb-0c9f131a4705',
  'Sundarbans Wild Mangrove Honey',
  'sundarbans-mangrove-honey',
  'Harvested by certified traditional honey collectors (Mawalis) in the wild mangrove delta of Sundarbans. Unique salty-sweet undertone with potent therapeutic benefits.',
  699.00,
  799.00,
  '500g',
  'Rare Reserve',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
  4.96,
  55,
  '100% Pure Sundarbans Mangrove Blossom Honey (Khalisha & Goran).',
  'Extraordinarily rich in antioxidants and flavonoids that help neutralize free radicals and strengthen vitality.',
  'Keep in a dark, dry place at room temperature.',
  true,
  true
),
(
  'e2b7617c-17b5-4b06-a2cb-0c9f131a4706',
  'Western Ghats Raw Jamun Blossom Honey',
  'jamun-blossom-honey',
  'Collected exclusively during the summer flowering of Indian Blackberry (Jamun) trees in the Western Ghats. Dark color with mild bitter-sweet Ayurvedic notes.',
  429.00,
  519.00,
  '500g',
  'Monofloral',
  'https://images.unsplash.com/photo-1576402187878-974f70c890a5?auto=format&fit=crop&w=800&q=80',
  4.89,
  70,
  '100% Raw Single-Flora Jamun (Syzygium cumini) Honey.',
  'Revered in Ayurveda for healthy metabolic balance, heart wellness, and low glycemic index.',
  'Store sealed at room temperature.',
  false,
  true
),
(
  'e2b7617c-17b5-4b06-a2cb-0c9f131a4707',
  'Kerala Spiced Ginger & Cardamom Infused Honey',
  'kerala-spiced-ginger-honey',
  'Raw Western Ghats honey infused with fresh organic Wayanad ginger root and green Idukki cardamom. Warm, comforting, and perfect for herbal teas.',
  379.00,
  459.00,
  '350g',
  'Infused Honey',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  4.93,
  90,
  'Raw Wild Honey (95%), Organic Wayanad Ginger (3%), Organic Idukki Cardamom (2%).',
  'Aids digestive digestion, soothes cold and cough, and acts as a wonderful morning metabolism booster.',
  'Store at room temperature. Stir gently before using.',
  true,
  true
),
(
  'e2b7617c-17b5-4b06-a2cb-0c9f131a4708',
  'Sacred Tulsi & Organic Turmeric Infused Honey',
  'tulsi-turmeric-honey',
  'An Ayurvedic golden elixir combining raw forest honey with fresh Rama Tulsi (Holy Basil) extract and high-curcumin Lakadong turmeric.',
  369.00,
  449.00,
  '350g',
  'Infused Honey',
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
  4.88,
  80,
  'Raw Wild Honey (95%), Holy Basil / Tulsi Extract (3%), Lakadong Turmeric (2%).',
  'Powerful anti-inflammatory and adaptogenic formulation for daily stress relief and strong respiratory health.',
  'Keep tightly capped in a dry, cool area.',
  false,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  stock = EXCLUDED.stock;

-- 2. SEED REVIEWS (INDIAN CUSTOMERS)
INSERT INTO public.reviews (
  id, user_name, product_id, rating, comment, created_at
) VALUES
(
  'f1a8421c-3b7c-4820-b384-90a169b18001',
  'Aarav Sharma (Bengaluru)',
  'e2b7617c-17b5-4b06-a2cb-0c9f131a4701',
  5,
  'The most authentic raw honey I have had in India! You can clearly smell the floral notes from Coorg in every spoon. Fast 2-day delivery to Bangalore.',
  now() - interval '3 days'
),
(
  'f1a8421c-3b7c-4820-b384-90a169b18002',
  'Ananya Iyer (Kochi)',
  'e2b7617c-17b5-4b06-a2cb-0c9f131a4704',
  5,
  'Kashmir White Honey is incomparable. Thick, creamy, and truly therapeutic. My morning sore throat disappeared in two days. Fellas Honey is our permanent family choice!',
  now() - interval '6 days'
),
(
  'f1a8421c-3b7c-4820-b384-90a169b18003',
  'Rohan Mehta (Mumbai)',
  'e2b7617c-17b5-4b06-a2cb-0c9f131a4707',
  5,
  'Kerala Ginger & Cardamom honey in my morning green tea is absolute heaven! Sweet, spicy, and perfectly balanced. Just ordered 3 more jars for Diwali gifts.',
  now() - interval '12 days'
),
(
  'f1a8421c-3b7c-4820-b384-90a169b18004',
  'Pooja Nair (Chennai)',
  'e2b7617c-17b5-4b06-a2cb-0c9f131a4702',
  5,
  '100% genuine raw Himalayan honey. It retains that lovely fine granulation and delicate floral taste. You can tell nothing is adulterated or heated.',
  now() - interval '15 days'
)
ON CONFLICT (id) DO NOTHING;
