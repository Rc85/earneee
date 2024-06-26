/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.db.query(`INSERT INTO categories (name) VALUES
  ('Automobile'),
  ('Electronics'),
  ('Fashion'),
  ('Health'),
  ('Home'),
  ('Miscellaneous'),
  ('Personal'),
  ('Outdoor')`);

  pgm.db.query(`INSERT INTO categories (name, parent_id) VALUES
  ('Cameras', (SELECT id FROM categories WHERE name = 'Automobile')),
  ('Cleaning Supplies', (SELECT id FROM categories WHERE name = 'Automobile')),
  ('Lighting', (SELECT id FROM categories WHERE name = 'Automobile')),
  ('Miscellaneous', (SELECT id FROM categories WHERE name = 'Automobile')),
  ('Tools', (SELECT id FROM categories WHERE name = 'Automobile')),
  ('Audio', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Cables', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Cameras', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Clocks', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Computer Components', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Computer Peripherals', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Consoles/Accessories', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Desktops', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Instruments', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Laptops', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Miscellaneous', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Mobile Devices', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Tablets', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Televisions', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Video Games', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Children', (SELECT id FROM categories WHERE name = 'Fashion')),
  ('Men', (SELECT id FROM categories WHERE name = 'Fashion')),
  ('Miscellaneous', (SELECT id FROM categories WHERE name = 'Fashion')),
  ('Women', (SELECT id FROM categories WHERE name = 'Fashion')),
  ('Fitness', (SELECT id FROM categories WHERE name = 'Health')),
  ('Dental', (SELECT id FROM categories WHERE name = 'Health')),
  ('Miscellaneous', (SELECT id FROM categories WHERE name = 'Health')),
  ('Supplements', (SELECT id FROM categories WHERE name = 'Health')),
  ('Appliances', (SELECT id FROM categories WHERE name = 'Home')),
  ('Baby', (SELECT id FROM categories WHERE name = 'Home')),
  ('Bathroom', (SELECT id FROM categories WHERE name = 'Home')),
  ('Bedroom', (SELECT id FROM categories WHERE name = 'Home')),
  ('Furnitures', (SELECT id FROM categories WHERE name = 'Home')),
  ('Garage', (SELECT id FROM categories WHERE name = 'Home')),
  ('Garden', (SELECT id FROM categories WHERE name = 'Home')),
  ('Kitchen', (SELECT id FROM categories WHERE name = 'Home')),
  ('Laundry', (SELECT id FROM categories WHERE name = 'Home')),
  ('Lighting', (SELECT id FROM categories WHERE name = 'Home')),
  ('Miscellaneous', (SELECT id FROM categories WHERE name = 'Home')),
  ('Office', (SELECT id FROM categories WHERE name = 'Home')),
  ('Pets', (SELECT id FROM categories WHERE name = 'Home')),
  ('Toys', (SELECT id FROM categories WHERE name = 'Home')),
  ('Eyecare', (SELECT id FROM categories WHERE name = 'Personal')),
  ('Haircare', (SELECT id FROM categories WHERE name = 'Personal')),
  ('Makeup', (SELECT id FROM categories WHERE name = 'Personal')),
  ('Miscellaneous', (SELECT id FROM categories WHERE name = 'Personal')),
  ('Biking', (SELECT id FROM categories WHERE name = 'Outdoor')),
  ('Camping', (SELECT id FROM categories WHERE name = 'Outdoor')),
  ('Fishing', (SELECT id FROM categories WHERE name = 'Outdoor')),
  ('Hiking', (SELECT id FROM categories WHERE name = 'Outdoor')),
  ('Miscellaneous', (SELECT id FROM categories WHERE name = 'Outdoor')),
  ('Skiing/Snowboarding', (SELECT id FROM categories WHERE name = 'Outdoor')),
  ('Water Activities', (SELECT id FROM categories WHERE name = 'Outdoor'))`);

  pgm.db.query(`INSERT INTO categories (name, parent_id) VALUES
  ('360 Camera', (SELECT id FROM categories WHERE name = 'Cameras' AND parent_id = (SELECT id FROM categories WHERE name = 'Automobile'))),
  ('Backup Camera', (SELECT id FROM categories WHERE name = 'Cameras' AND parent_id = (SELECT id FROM categories WHERE name = 'Automobile'))),
  ('Dash Camera', (SELECT id FROM categories WHERE name = 'Cameras' AND parent_id = (SELECT id FROM categories WHERE name = 'Automobile'))),
  ('Rear-facing Camera', (SELECT id FROM categories WHERE name = 'Cameras' AND parent_id = (SELECT id FROM categories WHERE name = 'Automobile'))),
  ('Interior', (SELECT id FROM categories WHERE name = 'Lighting' AND parent_id = (SELECT id FROM categories WHERE name = 'Automobile'))),
  ('Headlights', (SELECT id FROM categories WHERE name = 'Lighting' AND parent_id = (SELECT id FROM categories WHERE name = 'Automobile'))),
  ('Taillights', (SELECT id FROM categories WHERE name = 'Lighting' AND parent_id = (SELECT id FROM categories WHERE name = 'Automobile'))),
  ('Jacks', (SELECT id FROM categories WHERE name = 'Tools' AND parent_id = (SELECT id FROM categories WHERE name = 'Automobile'))),
  ('Speakers', (SELECT id FROM categories WHERE name = 'Audio' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Headsets/Headphones', (SELECT id FROM categories WHERE name = 'Audio' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Amplifiers', (SELECT id FROM categories WHERE name = 'Audio' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Subwoofers', (SELECT id FROM categories WHERE name = 'Audio' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Microphones', (SELECT id FROM categories WHERE name = 'Audio' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Phone Chargers', (SELECT id FROM categories WHERE name = 'Cables' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Ethernet Cables', (SELECT id FROM categories WHERE name = 'Cables' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Extensions', (SELECT id FROM categories WHERE name = 'Cables' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Optic Cables', (SELECT id FROM categories WHERE name = 'Cables' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('HDMI Cables', (SELECT id FROM categories WHERE name = 'Cables' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Security Cameras', (SELECT id FROM categories WHERE name = 'Cameras' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Baby Monitors', (SELECT id FROM categories WHERE name = 'Cameras' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Motherboards', (SELECT id FROM categories WHERE name = 'Computer Components' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('CPU Processors', (SELECT id FROM categories WHERE name = 'Computer Components' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Graphic Cards', (SELECT id FROM categories WHERE name = 'Computer Components' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Memory RAM', (SELECT id FROM categories WHERE name = 'Computer Components' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Sound Cards', (SELECT id FROM categories WHERE name = 'Computer Components' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Power Supplies', (SELECT id FROM categories WHERE name = 'Computer Components' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Storage', (SELECT id FROM categories WHERE name = 'Computer Components' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Monitors', (SELECT id FROM categories WHERE name = 'Computer Peripherals' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Keyboards', (SELECT id FROM categories WHERE name = 'Computer Peripherals' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Mouse', (SELECT id FROM categories WHERE name = 'Computer Peripherals' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Speakers', (SELECT id FROM categories WHERE name = 'Computer Peripherals' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Routers', (SELECT id FROM categories WHERE name = 'Computer Peripherals' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Headsets/Headphones', (SELECT id FROM categories WHERE name = 'Computer Peripherals' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Cooling', (SELECT id FROM categories WHERE name = 'Computer Peripherals' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Media', (SELECT id FROM categories WHERE name = 'Computer Peripherals' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Playstation 5', (SELECT id FROM categories WHERE name = 'Consoles/Accessories' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Xbox 360', (SELECT id FROM categories WHERE name = 'Consoles/Accessories' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Playstation 4', (SELECT id FROM categories WHERE name = 'Consoles/Accessories' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Playstation 3', (SELECT id FROM categories WHERE name = 'Consoles/Accessories' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Nintendo Switch', (SELECT id FROM categories WHERE name = 'Consoles/Accessories' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Pianos', (SELECT id FROM categories WHERE name = 'Instruments' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Saxophones', (SELECT id FROM categories WHERE name = 'Instruments' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Trumpets', (SELECT id FROM categories WHERE name = 'Instruments' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Flute', (SELECT id FROM categories WHERE name = 'Instruments' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Drums', (SELECT id FROM categories WHERE name = 'Instruments' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Violins', (SELECT id FROM categories WHERE name = 'Instruments' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Accessories', (SELECT id FROM categories WHERE name = 'Mobile Devices' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Androids', (SELECT id FROM categories WHERE name = 'Mobile Devices' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('iOS', (SELECT id FROM categories WHERE name = 'Mobile Devices' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Windows', (SELECT id FROM categories WHERE name = 'Mobile Devices' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Nokia', (SELECT id FROM categories WHERE name = 'Mobile Devices' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Blackberry', (SELECT id FROM categories WHERE name = 'Mobile Devices' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Accessories', (SELECT id FROM categories WHERE name = 'Tablets' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Androids', (SELECT id FROM categories WHERE name = 'Tablets' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('iPads', (SELECT id FROM categories WHERE name = 'Tablets' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Windows', (SELECT id FROM categories WHERE name = 'Tablets' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('LCD', (SELECT id FROM categories WHERE name = 'Televisions' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('LED', (SELECT id FROM categories WHERE name = 'Televisions' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('OLED', (SELECT id FROM categories WHERE name = 'Televisions' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('QLED', (SELECT id FROM categories WHERE name = 'Televisions' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Plasma', (SELECT id FROM categories WHERE name = 'Televisions' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Playstation 5', (SELECT id FROM categories WHERE name = 'Video Games' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Xbox 360', (SELECT id FROM categories WHERE name = 'Video Games' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Playstation 4', (SELECT id FROM categories WHERE name = 'Video Games' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Playstation 3', (SELECT id FROM categories WHERE name = 'Video Games' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('Nintendo Switch', (SELECT id FROM categories WHERE name = 'Video Games' AND parent_id = (SELECT id FROM categories WHERE name = 'Electronics'))),
  ('T-Shirts', (SELECT id FROM categories WHERE name = 'Men' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Sweaters', (SELECT id FROM categories WHERE name = 'Men' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Tank Tops', (SELECT id FROM categories WHERE name = 'Men' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Jackets', (SELECT id FROM categories WHERE name = 'Men' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Pants', (SELECT id FROM categories WHERE name = 'Men' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Shorts', (SELECT id FROM categories WHERE name = 'Men' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Socks', (SELECT id FROM categories WHERE name = 'Men' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Shoes', (SELECT id FROM categories WHERE name = 'Men' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Neckwear', (SELECT id FROM categories WHERE name = 'Men' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Underwear', (SELECT id FROM categories WHERE name = 'Men' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Hats', (SELECT id FROM categories WHERE name = 'Men' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Jewelries', (SELECT id FROM categories WHERE name = 'Men' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Watches', (SELECT id FROM categories WHERE name = 'Men' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Belts', (SELECT id FROM categories WHERE name = 'Men' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Eyewear', (SELECT id FROM categories WHERE name = 'Men' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('T-Shirts', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Sweaters', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Tank Tops', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Jackets', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Pants', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Shorts', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Skirts', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Socks', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Leggings', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Shoes', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Neckwear', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Underwear', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Hats', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Jewelries', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Watches', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Belts', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Purses/Bags', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Eyewear', (SELECT id FROM categories WHERE name = 'Women' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('T-Shirts', (SELECT id FROM categories WHERE name = 'Children' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Sweaters', (SELECT id FROM categories WHERE name = 'Children' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Tank Tops', (SELECT id FROM categories WHERE name = 'Children' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Jackets', (SELECT id FROM categories WHERE name = 'Children' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Pants', (SELECT id FROM categories WHERE name = 'Children' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Shorts', (SELECT id FROM categories WHERE name = 'Children' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Skirts', (SELECT id FROM categories WHERE name = 'Children' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Socks', (SELECT id FROM categories WHERE name = 'Children' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Leggings', (SELECT id FROM categories WHERE name = 'Children' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Shoes', (SELECT id FROM categories WHERE name = 'Children' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Neckwear', (SELECT id FROM categories WHERE name = 'Children' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Underwear', (SELECT id FROM categories WHERE name = 'Children' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Hats', (SELECT id FROM categories WHERE name = 'Children' AND parent_id = (SELECT id FROM categories WHERE name = 'Fashion'))),
  ('Mats', (SELECT id FROM categories WHERE name = 'Fitness' AND parent_id = (SELECT id FROM categories WHERE name = 'Health'))),
  ('Gloves', (SELECT id FROM categories WHERE name = 'Fitness' AND parent_id = (SELECT id FROM categories WHERE name = 'Health'))),
  ('Toothbrushes', (SELECT id FROM categories WHERE name = 'Dental' AND parent_id = (SELECT id FROM categories WHERE name = 'Health'))),
  ('Protein', (SELECT id FROM categories WHERE name = 'Supplements' AND parent_id = (SELECT id FROM categories WHERE name = 'Health'))),
  ('Vitamins', (SELECT id FROM categories WHERE name = 'Supplements' AND parent_id = (SELECT id FROM categories WHERE name = 'Health'))),
  ('Creatine', (SELECT id FROM categories WHERE name = 'Supplements' AND parent_id = (SELECT id FROM categories WHERE name = 'Health'))),
  ('Amino Acids', (SELECT id FROM categories WHERE name = 'Supplements' AND parent_id = (SELECT id FROM categories WHERE name = 'Health'))),
  ('Air Purifiers', (SELECT id FROM categories WHERE name = 'Appliances' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Air Conditioners', (SELECT id FROM categories WHERE name = 'Appliances' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Humidifiers', (SELECT id FROM categories WHERE name = 'Appliances' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Dryers', (SELECT id FROM categories WHERE name = 'Appliances' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Washers', (SELECT id FROM categories WHERE name = 'Appliances' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Refridgerators', (SELECT id FROM categories WHERE name = 'Appliances' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Vacuum Cleaners', (SELECT id FROM categories WHERE name = 'Appliances' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Microwaves', (SELECT id FROM categories WHERE name = 'Appliances' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Stoves', (SELECT id FROM categories WHERE name = 'Appliances' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Dishwashers', (SELECT id FROM categories WHERE name = 'Appliances' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Toasters', (SELECT id FROM categories WHERE name = 'Appliances' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Air Fryers', (SELECT id FROM categories WHERE name = 'Appliances' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Diapers', (SELECT id FROM categories WHERE name = 'Baby' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Clothing', (SELECT id FROM categories WHERE name = 'Baby' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Showerheads', (SELECT id FROM categories WHERE name = 'Bathroom' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Towels', (SELECT id FROM categories WHERE name = 'Bathroom' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Cleaning Supplies', (SELECT id FROM categories WHERE name = 'Bathroom' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Bidets', (SELECT id FROM categories WHERE name = 'Bathroom' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Shower Curtains', (SELECT id FROM categories WHERE name = 'Bathroom' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Bed Sets', (SELECT id FROM categories WHERE name = 'Bedroom' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Bedsheets', (SELECT id FROM categories WHERE name = 'Bedroom' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Duvets', (SELECT id FROM categories WHERE name = 'Bedroom' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Mattresses', (SELECT id FROM categories WHERE name = 'Bedroom' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Bedboards', (SELECT id FROM categories WHERE name = 'Bedroom' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Sofas', (SELECT id FROM categories WHERE name = 'Furnitures' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Chairs', (SELECT id FROM categories WHERE name = 'Furnitures' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Drawers', (SELECT id FROM categories WHERE name = 'Furnitures' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Shelves', (SELECT id FROM categories WHERE name = 'Furnitures' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Nighstands', (SELECT id FROM categories WHERE name = 'Furnitures' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Tables', (SELECT id FROM categories WHERE name = 'Furnitures' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Tools', (SELECT id FROM categories WHERE name = 'Garage' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Pots/Pans', (SELECT id FROM categories WHERE name = 'Kitchen' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Cutleries', (SELECT id FROM categories WHERE name = 'Kitchen' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Kitchenwares', (SELECT id FROM categories WHERE name = 'Kitchen' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Cleaning Supplies', (SELECT id FROM categories WHERE name = 'Kitchen' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Detergents', (SELECT id FROM categories WHERE name = 'Laundry' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Cleaning Supplies', (SELECT id FROM categories WHERE name = 'Laundry' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Bulbs', (SELECT id FROM categories WHERE name = 'Lighting' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Lamps', (SELECT id FROM categories WHERE name = 'Lighting' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Night Lights', (SELECT id FROM categories WHERE name = 'Lighting' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Desks', (SELECT id FROM categories WHERE name = 'Office' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Chairs', (SELECT id FROM categories WHERE name = 'Office' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Stationeries', (SELECT id FROM categories WHERE name = 'Office' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Food', (SELECT id FROM categories WHERE name = 'Pets' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Shelters', (SELECT id FROM categories WHERE name = 'Pets' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Beds', (SELECT id FROM categories WHERE name = 'Pets' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Toys', (SELECT id FROM categories WHERE name = 'Pets' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('0 - 3 Years Old', (SELECT id FROM categories WHERE name = 'Toys' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('4 - 7 Years Old', (SELECT id FROM categories WHERE name = 'Toys' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('10+ Years Old', (SELECT id FROM categories WHERE name = 'Toys' AND parent_id = (SELECT id FROM categories WHERE name = 'Home'))),
  ('Frames', (SELECT id FROM categories WHERE name = 'Eyecare' AND parent_id = (SELECT id FROM categories WHERE name = 'Personal'))),
  ('Wigs/Extensions', (SELECT id FROM categories WHERE name = 'Haircare' AND parent_id = (SELECT id FROM categories WHERE name = 'Personal'))),
  ('Blow Dryers', (SELECT id FROM categories WHERE name = 'Haircare' AND parent_id = (SELECT id FROM categories WHERE name = 'Personal'))),
  ('Straignteners', (SELECT id FROM categories WHERE name = 'Haircare' AND parent_id = (SELECT id FROM categories WHERE name = 'Personal'))),
  ('Combs', (SELECT id FROM categories WHERE name = 'Haircare' AND parent_id = (SELECT id FROM categories WHERE name = 'Personal'))),
  ('Tools', (SELECT id FROM categories WHERE name = 'Makeup' AND parent_id = (SELECT id FROM categories WHERE name = 'Personal'))),
  ('Concealers', (SELECT id FROM categories WHERE name = 'Makeup' AND parent_id = (SELECT id FROM categories WHERE name = 'Personal'))),
  ('Lips', (SELECT id FROM categories WHERE name = 'Makeup' AND parent_id = (SELECT id FROM categories WHERE name = 'Personal'))),
  ('Mascara', (SELECT id FROM categories WHERE name = 'Makeup' AND parent_id = (SELECT id FROM categories WHERE name = 'Personal'))),
  ('Highlights', (SELECT id FROM categories WHERE name = 'Makeup' AND parent_id = (SELECT id FROM categories WHERE name = 'Personal'))),
  ('Foundations', (SELECT id FROM categories WHERE name = 'Makeup' AND parent_id = (SELECT id FROM categories WHERE name = 'Personal'))),
  ('Powder', (SELECT id FROM categories WHERE name = 'Makeup' AND parent_id = (SELECT id FROM categories WHERE name = 'Personal'))),
  ('Primer', (SELECT id FROM categories WHERE name = 'Makeup' AND parent_id = (SELECT id FROM categories WHERE name = 'Personal'))),
  ('Nails', (SELECT id FROM categories WHERE name = 'Makeup' AND parent_id = (SELECT id FROM categories WHERE name = 'Personal'))),
  ('Bicycles', (SELECT id FROM categories WHERE name = 'Biking' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Locks', (SELECT id FROM categories WHERE name = 'Biking' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Wheels', (SELECT id FROM categories WHERE name = 'Biking' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Helmets', (SELECT id FROM categories WHERE name = 'Biking' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Tents', (SELECT id FROM categories WHERE name = 'Camping' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Sleeping Bags', (SELECT id FROM categories WHERE name = 'Camping' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Portable Stove', (SELECT id FROM categories WHERE name = 'Camping' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Chairs', (SELECT id FROM categories WHERE name = 'Camping' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Poles', (SELECT id FROM categories WHERE name = 'Fishing' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Baits', (SELECT id FROM categories WHERE name = 'Fishing' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Nets', (SELECT id FROM categories WHERE name = 'Fishing' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Clothing', (SELECT id FROM categories WHERE name = 'Fishing' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Tools', (SELECT id FROM categories WHERE name = 'Fishing' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Shoes', (SELECT id FROM categories WHERE name = 'Hiking' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Clothing', (SELECT id FROM categories WHERE name = 'Hiking' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Skis', (SELECT id FROM categories WHERE name = 'Skiing/Snowboarding' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Helmets', (SELECT id FROM categories WHERE name = 'Skiing/Snowboarding' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Poles', (SELECT id FROM categories WHERE name = 'Skiing/Snowboarding' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Boards', (SELECT id FROM categories WHERE name = 'Skiing/Snowboarding' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Boots', (SELECT id FROM categories WHERE name = 'Skiing/Snowboarding' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Clothing', (SELECT id FROM categories WHERE name = 'Skiing/Snowboarding' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Goggles', (SELECT id FROM categories WHERE name = 'Skiing/Snowboarding' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Paddles', (SELECT id FROM categories WHERE name = 'Water Activities' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Canoes', (SELECT id FROM categories WHERE name = 'Water Activities' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Kayaks', (SELECT id FROM categories WHERE name = 'Water Activities' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Goggles', (SELECT id FROM categories WHERE name = 'Water Activities' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Flippers', (SELECT id FROM categories WHERE name = 'Water Activities' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor'))),
  ('Clothing', (SELECT id FROM categories WHERE name = 'Water Activities' AND parent_id = (SELECT id FROM categories WHERE name = 'Outdoor')))`);
};

exports.down = (pgm) => {};
