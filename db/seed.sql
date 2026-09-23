INSERT OR IGNORE INTO categories (id, name, slug) VALUES
  (1, 'High Grade', 'hg'),
  (2, 'Real Grade', 'rg'),
  (3, 'Master Grade', 'mg'),
  (4, 'Perfect Grade', 'pg');

INSERT OR IGNORE INTO products (id, name, slug, description, grade, scale, price, stock, image_url, image_position, category_id, featured, active) VALUES
  (1, 'Astra Frame Zero', 'astra-frame-zero', 'โมเดลเฟรมหลัก รายละเอียดคมชัด พร้อมอาวุธครบชุด', 'MG', '1/100', 1890, 8, '/mecha-hero.png', '62% center', 3, 1, 1),
  (2, 'Night Raven Unit', 'night-raven-unit', 'ยูนิตโทนสีเข้ม โครงในแน่นและขยับได้หลายจุด', 'RG', '1/144', 1290, 12, '/mecha-hero.png', '80% center', 2, 1, 1),
  (3, 'Vanguard Type-R', 'vanguard-type-r', 'ประกอบง่าย เหมาะสำหรับผู้เริ่มต้นและนักสะสม', 'HG', '1/144', 790, 20, '/mecha-hero.png', '45% center', 1, 1, 1),
  (4, 'Iron Warden Custom', 'iron-warden-custom', 'ทรงกะทัดรัดพร้อมดีเทลระดับมาสเตอร์เกรด', 'MGSD', 'SD', 1590, 5, '/mecha-hero.png', '94% center', 3, 1, 1);
