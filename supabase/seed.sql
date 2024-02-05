insert into categories (name) values
  ('Automobile'),
  ('Electronics'),
  ('Fashion'),
  ('Health'),
  ('Home'),
  ('Miscellaneous'),
  ('Personal'),
  ('Outdoor');

insert into categories (name, parent_id) values
  -- Automobile
    ('Cameras', (select id from categories where name = 'Automobile')),
    ('Cleaning Supplies', (select id from categories where name = 'Automobile')),
    ('Lighting', (select id from categories where name = 'Automobile')),
    ('Miscellaneous', (select id from categories where name = 'Automobile')),
    ('Tools', (select id from categories where name = 'Automobile')),

  -- Electronics
    ('Audio', (select id from categories where name = 'Electronics')),
    ('Cables', (select id from categories where name = 'Electronics')),
    ('Cameras', (select id from categories where name = 'Electronics')),
    ('Clocks', (select id from categories where name = 'Electronics')),
    ('Computer Components', (select id from categories where name = 'Electronics')),
    ('Computer Peripherals', (select id from categories where name = 'Electronics')),
    ('Consoles/Accessories', (select id from categories where name = 'Electronics')),
    ('Desktops', (select id from categories where name = 'Electronics')),
    ('Instruments', (select id from categories where name = 'Electronics')),
    ('Laptops', (select id from categories where name = 'Electronics')),
    ('Miscellaneous', (select id from categories where name = 'Electronics')),
    ('Mobile Devices', (select id from categories where name = 'Electronics')),
    ('Tablets', (select id from categories where name = 'Electronics')),
    ('Televisions', (select id from categories where name = 'Electronics')),
    ('Video Games', (select id from categories where name = 'Electronics')),

  -- Fashion
    ('Children', (select id from categories where name = 'Fashion')),
    ('Men', (select id from categories where name = 'Fashion')),
    ('Miscellaneous', (select id from categories where name = 'Fashion')),
    ('Women', (select id from categories where name = 'Fashion')),

  -- Health
    ('Fitness', (select id from categories where name = 'Health')),
    ('Dental', (select id from categories where name = 'Health')),
    ('Miscellaneous', (select id from categories where name = 'Health')),
    ('Supplements', (select id from categories where name = 'Health')),

  -- Home
    ('Appliances', (select id from categories where name = 'Home')),
    ('Baby', (select id from categories where name = 'Home')),
    ('Bathroom', (select id from categories where name = 'Home')),
    ('Bedroom', (select id from categories where name = 'Home')),
    ('Furnitures', (select id from categories where name = 'Home')),
    ('Garage', (select id from categories where name = 'Home')),
    ('Garden', (select id from categories where name = 'Home')),
    ('Kitchen', (select id from categories where name = 'Home')),
    ('Laundry', (select id from categories where name = 'Home')),
    ('Lighting', (select id from categories where name = 'Home')),
    ('Miscellaneous', (select id from categories where name = 'Home')),
    ('Office', (select id from categories where name = 'Home')),
    ('Pets', (select id from categories where name = 'Home')),
    ('Toys', (select id from categories where name = 'Home')),

  -- Personal
    ('Eyecare', (select id from categories where name = 'Personal')),
    ('Haircare', (select id from categories where name = 'Personal')),
    ('Makeup', (select id from categories where name = 'Personal')),
    ('Miscellaneous', (select id from categories where name = 'Personal')),

  -- Outdoor
    ('Biking', (select id from categories where name = 'Outdoor')),
    ('Camping', (select id from categories where name = 'Outdoor')),
    ('Fishing', (select id from categories where name = 'Outdoor')),
    ('Hiking', (select id from categories where name = 'Outdoor')),
    ('Miscellaneous', (select id from categories where name = 'Outdoor')),
    ('Skiing/Snowboarding', (select id from categories where name = 'Outdoor')),
    ('Water Activities', (select id from categories where name = 'Outdoor'));

insert into categories (name, parent_id) values
  -- Automobile
    -- Cameras
      ('360 Camera', (select id from categories where name = 'Cameras' and parent_id = (select id from categories where name = 'Automobile'))),
      ('Backup Camera', (select id from categories where name = 'Cameras' and parent_id = (select id from categories where name = 'Automobile'))),
      ('Dash Camera', (select id from categories where name = 'Cameras' and parent_id = (select id from categories where name = 'Automobile'))),
      ('Rear-facing Camera', (select id from categories where name = 'Cameras' and parent_id = (select id from categories where name = 'Automobile'))),

    -- Cleaning Supplies
      ('Exterior', (select id from categories where name = 'Cleaning Supplies' and parent_id = (select id from categories where name = 'Automobile'))),
      ('Interior', (select id from categories where name = 'Cleaning Supplies' and parent_id = (select id from categories where name = 'Automobile'))),

    -- Lighting
      ('Interior', (select id from categories where name = 'Lighting' and parent_id = (select id from categories where name = 'Automobile'))),
      ('Headlights', (select id from categories where name = 'Lighting' and parent_id = (select id from categories where name = 'Automobile'))),
      ('Taillights', (select id from categories where name = 'Lighting' and parent_id = (select id from categories where name = 'Automobile'))),

    -- Tools
      ('Jacks', (select id from categories where name = 'Tools' and parent_id = (select id from categories where name = 'Automobile'))),

  -- Electronics
    -- Audio
      ('Speakers', (select id from categories where name = 'Audio' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Headsets/Headphones', (select id from categories where name = 'Audio' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Amplifiers', (select id from categories where name = 'Audio' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Subwoofers', (select id from categories where name = 'Audio' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Microphones', (select id from categories where name = 'Audio' and parent_id = (select id from categories where name = 'Electronics'))),

    -- Cables
      ('Phone Chargers', (select id from categories where name = 'Cables' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Ethernet Cables', (select id from categories where name = 'Cables' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Extensions', (select id from categories where name = 'Cables' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Optic Cables', (select id from categories where name = 'Cables' and parent_id = (select id from categories where name = 'Electronics'))),
      ('HDMI Cables', (select id from categories where name = 'Cables' and parent_id = (select id from categories where name = 'Electronics'))),

    -- Cameras
      ('Security Cameras', (select id from categories where name = 'Cameras' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Baby Monitors', (select id from categories where name = 'Cameras' and parent_id = (select id from categories where name = 'Electronics'))),

    -- Computer Components
      ('Motherboards', (select id from categories where name = 'Computer Components' and parent_id = (select id from categories where name = 'Electronics'))),
      ('CPU Processors', (select id from categories where name = 'Computer Components' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Graphic Cards', (select id from categories where name = 'Computer Components' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Memory RAM', (select id from categories where name = 'Computer Components' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Sound Cards', (select id from categories where name = 'Computer Components' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Power Supplies', (select id from categories where name = 'Computer Components' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Storage', (select id from categories where name = 'Computer Components' and parent_id = (select id from categories where name = 'Electronics'))),

    -- Computer Peripherals
      ('Monitors', (select id from categories where name = 'Computer Peripherals' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Keyboards', (select id from categories where name = 'Computer Peripherals' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Mouse', (select id from categories where name = 'Computer Peripherals' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Speakers', (select id from categories where name = 'Computer Peripherals' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Routers', (select id from categories where name = 'Computer Peripherals' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Headsets/Headphones', (select id from categories where name = 'Computer Peripherals' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Cooling', (select id from categories where name = 'Computer Peripherals' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Media', (select id from categories where name = 'Computer Peripherals' and parent_id = (select id from categories where name = 'Electronics'))),

    -- Consoles/Accessories
      ('Playstation 5', (select id from categories where name = 'Consoles/Accessories' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Xbox 360', (select id from categories where name = 'Consoles/Accessories' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Playstation 4', (select id from categories where name = 'Consoles/Accessories' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Playstation 3', (select id from categories where name = 'Consoles/Accessories' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Nintendo Switch', (select id from categories where name = 'Consoles/Accessories' and parent_id = (select id from categories where name = 'Electronics'))),

    -- Instruments
      ('Pianos', (select id from categories where name = 'Instruments' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Saxophones', (select id from categories where name = 'Instruments' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Trumpets', (select id from categories where name = 'Instruments' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Flute', (select id from categories where name = 'Instruments' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Drums', (select id from categories where name = 'Instruments' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Violins', (select id from categories where name = 'Instruments' and parent_id = (select id from categories where name = 'Electronics'))),

    -- Mobile Devices
      ('Androids', (select id from categories where name = 'Mobile Devices' and parent_id = (select id from categories where name = 'Electronics'))),
      ('iOS', (select id from categories where name = 'Mobile Devices' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Windows', (select id from categories where name = 'Mobile Devices' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Nokia', (select id from categories where name = 'Mobile Devices' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Blackberry', (select id from categories where name = 'Mobile Devices' and parent_id = (select id from categories where name = 'Electronics'))),

    -- Tablets
      ('Androids', (select id from categories where name = 'Tablets' and parent_id = (select id from categories where name = 'Electronics'))),
      ('iPads', (select id from categories where name = 'Tablets' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Windows', (select id from categories where name = 'Tablets' and parent_id = (select id from categories where name = 'Electronics'))),

    -- Televisions
      ('LCD', (select id from categories where name = 'Televisions' and parent_id = (select id from categories where name = 'Electronics'))),
      ('LED', (select id from categories where name = 'Televisions' and parent_id = (select id from categories where name = 'Electronics'))),
      ('OLED', (select id from categories where name = 'Televisions' and parent_id = (select id from categories where name = 'Electronics'))),
      ('QLED', (select id from categories where name = 'Televisions' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Plasma', (select id from categories where name = 'Televisions' and parent_id = (select id from categories where name = 'Electronics'))),

    -- Video Games
      ('Playstation 5', (select id from categories where name = 'Video Games' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Xbox 360', (select id from categories where name = 'Video Games' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Playstation 4', (select id from categories where name = 'Video Games' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Playstation 3', (select id from categories where name = 'Video Games' and parent_id = (select id from categories where name = 'Electronics'))),
      ('Nintendo Switch', (select id from categories where name = 'Video Games' and parent_id = (select id from categories where name = 'Electronics'))),

  -- Fashion
    -- Men
      ('T-Shirts', (select id from categories where name = 'Men' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Sweaters', (select id from categories where name = 'Men' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Tank Tops', (select id from categories where name = 'Men' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Jackets', (select id from categories where name = 'Men' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Pants', (select id from categories where name = 'Men' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Shorts', (select id from categories where name = 'Men' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Socks', (select id from categories where name = 'Men' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Shoes', (select id from categories where name = 'Men' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Neckwear', (select id from categories where name = 'Men' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Underwear', (select id from categories where name = 'Men' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Hats', (select id from categories where name = 'Men' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Jewelries', (select id from categories where name = 'Men' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Watches', (select id from categories where name = 'Men' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Belts', (select id from categories where name = 'Men' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Eyewear', (select id from categories where name = 'Men' and parent_id = (select id from categories where name = 'Fashion'))),

    -- Women
      ('T-Shirts', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Sweaters', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Tank Tops', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Jackets', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Pants', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Shorts', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Skirts', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Socks', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Leggings', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Shoes', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Neckwear', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Underwear', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Hats', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Jewelries', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Watches', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Belts', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Purses/Bags', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Eyewear', (select id from categories where name = 'Women' and parent_id = (select id from categories where name = 'Fashion'))),

    -- Children
      ('T-Shirts', (select id from categories where name = 'Children' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Sweaters', (select id from categories where name = 'Children' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Tank Tops', (select id from categories where name = 'Children' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Jackets', (select id from categories where name = 'Children' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Pants', (select id from categories where name = 'Children' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Shorts', (select id from categories where name = 'Children' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Skirts', (select id from categories where name = 'Children' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Socks', (select id from categories where name = 'Children' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Leggings', (select id from categories where name = 'Children' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Shoes', (select id from categories where name = 'Children' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Neckwear', (select id from categories where name = 'Children' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Underwear', (select id from categories where name = 'Children' and parent_id = (select id from categories where name = 'Fashion'))),
      ('Hats', (select id from categories where name = 'Children' and parent_id = (select id from categories where name = 'Fashion'))),
    
  -- Health
    -- Fitness
      ('Mats', (select id from categories where name = 'Fitness' and parent_id = (select id from categories where name = 'Health'))),
      ('Gloves', (select id from categories where name = 'Fitness' and parent_id = (select id from categories where name = 'Health'))),

    -- Dental
      ('Toothbrushes', (select id from categories where name = 'Dental' and parent_id = (select id from categories where name = 'Health'))),

    -- Supplements
      ('Protein', (select id from categories where name = 'Supplements' and parent_id = (select id from categories where name = 'Health'))),
      ('Vitamins', (select id from categories where name = 'Supplements' and parent_id = (select id from categories where name = 'Health'))),
      ('Creatine', (select id from categories where name = 'Supplements' and parent_id = (select id from categories where name = 'Health'))),
      ('Amino Acids', (select id from categories where name = 'Supplements' and parent_id = (select id from categories where name = 'Health'))),

  -- Home
    -- Appliances
      ('Dryers', (select id from categories where name = 'Appliances' and parent_id = (select id from categories where name = 'Home'))),
      ('Washers', (select id from categories where name = 'Appliances' and parent_id = (select id from categories where name = 'Home'))),
      ('Refridgerators', (select id from categories where name = 'Appliances' and parent_id = (select id from categories where name = 'Home'))),
      ('Vacuum Cleaners', (select id from categories where name = 'Appliances' and parent_id = (select id from categories where name = 'Home'))),
      ('Microwaves', (select id from categories where name = 'Appliances' and parent_id = (select id from categories where name = 'Home'))),
      ('Stoves', (select id from categories where name = 'Appliances' and parent_id = (select id from categories where name = 'Home'))),
      ('Dishwashers', (select id from categories where name = 'Appliances' and parent_id = (select id from categories where name = 'Home'))),
      ('Toasters', (select id from categories where name = 'Appliances' and parent_id = (select id from categories where name = 'Home'))),
      ('Air Fryers', (select id from categories where name = 'Appliances' and parent_id = (select id from categories where name = 'Home'))),

    -- Baby  
      ('Diapers', (select id from categories where name = 'Baby' and parent_id = (select id from categories where name = 'Home'))),
      ('Clothing', (select id from categories where name = 'Baby' and parent_id = (select id from categories where name = 'Home'))),

    -- Bathroom
      ('Showerheads', (select id from categories where name = 'Bathroom' and parent_id = (select id from categories where name = 'Home'))),
      ('Towels', (select id from categories where name = 'Bathroom' and parent_id = (select id from categories where name = 'Home'))),
      ('Cleaning Supplies', (select id from categories where name = 'Bathroom' and parent_id = (select id from categories where name = 'Home'))),
      ('Bidets', (select id from categories where name = 'Bathroom' and parent_id = (select id from categories where name = 'Home'))),
      ('Shower Curtains', (select id from categories where name = 'Bathroom' and parent_id = (select id from categories where name = 'Home'))),

    -- Bedroom
      ('Bed Sets', (select id from categories where name = 'Bedroom' and parent_id = (select id from categories where name = 'Home'))),
      ('Bedsheets', (select id from categories where name = 'Bedroom' and parent_id = (select id from categories where name = 'Home'))),
      ('Duvets', (select id from categories where name = 'Bedroom' and parent_id = (select id from categories where name = 'Home'))),
      ('Mattresses', (select id from categories where name = 'Bedroom' and parent_id = (select id from categories where name = 'Home'))),
      ('Bedboards', (select id from categories where name = 'Bedroom' and parent_id = (select id from categories where name = 'Home'))),

    -- Furnitures
      ('Sofas', (select id from categories where name = 'Furnitures' and parent_id = (select id from categories where name = 'Home'))),
      ('Chairs', (select id from categories where name = 'Furnitures' and parent_id = (select id from categories where name = 'Home'))),
      ('Drawers', (select id from categories where name = 'Furnitures' and parent_id = (select id from categories where name = 'Home'))),
      ('Shelves', (select id from categories where name = 'Furnitures' and parent_id = (select id from categories where name = 'Home'))),
      ('Nighstands', (select id from categories where name = 'Furnitures' and parent_id = (select id from categories where name = 'Home'))),
      ('Tables', (select id from categories where name = 'Furnitures' and parent_id = (select id from categories where name = 'Home'))),

    -- Garage
      ('Tools', (select id from categories where name = 'Garage' and parent_id = (select id from categories where name = 'Home'))),

    -- Kitchen
      ('Pots/Pans', (select id from categories where name = 'Kitchen' and parent_id = (select id from categories where name = 'Home'))),
      ('Cutleries', (select id from categories where name = 'Kitchen' and parent_id = (select id from categories where name = 'Home'))),
      ('Kitchenwares', (select id from categories where name = 'Kitchen' and parent_id = (select id from categories where name = 'Home'))),
      ('Cleaning Supplies', (select id from categories where name = 'Kitchen' and parent_id = (select id from categories where name = 'Home'))),

    -- Laundry
      ('Detergents', (select id from categories where name = 'Laundry' and parent_id = (select id from categories where name = 'Home'))),
      ('Cleaning Supplies', (select id from categories where name = 'Laundry' and parent_id = (select id from categories where name = 'Home'))),

    -- Lighting
      ('Bulbs', (select id from categories where name = 'Lighting' and parent_id = (select id from categories where name = 'Home'))),
      ('Lamps', (select id from categories where name = 'Lighting' and parent_id = (select id from categories where name = 'Home'))),
      ('Night Lights', (select id from categories where name = 'Lighting' and parent_id = (select id from categories where name = 'Home'))),

    -- Office
      ('Desks', (select id from categories where name = 'Office' and parent_id = (select id from categories where name = 'Home'))),
      ('Chairs', (select id from categories where name = 'Office' and parent_id = (select id from categories where name = 'Home'))),
      ('Stationeries', (select id from categories where name = 'Office' and parent_id = (select id from categories where name = 'Home'))),

    -- Pets
      ('Food', (select id from categories where name = 'Pets' and parent_id = (select id from categories where name = 'Home'))),
      ('Shelters', (select id from categories where name = 'Pets' and parent_id = (select id from categories where name = 'Home'))),
      ('Beds', (select id from categories where name = 'Pets' and parent_id = (select id from categories where name = 'Home'))),
      ('Toys', (select id from categories where name = 'Pets' and parent_id = (select id from categories where name = 'Home'))),

    -- Toys
      ('0 - 3 Years Old', (select id from categories where name = 'Toys' and parent_id = (select id from categories where name = 'Home'))),
      ('4 - 7 Years Old', (select id from categories where name = 'Toys' and parent_id = (select id from categories where name = 'Home'))),
      ('10+ Years Old', (select id from categories where name = 'Toys' and parent_id = (select id from categories where name = 'Home'))),

  -- Personal
    -- Eyecare
      ('Frames', (select id from categories where name = 'Eyecare' and parent_id = (select id from categories where name = 'Personal'))),

    -- Haircare
      ('Wigs/Extensions', (select id from categories where name = 'Haircare' and parent_id = (select id from categories where name = 'Personal'))),
      ('Blow Dryers', (select id from categories where name = 'Haircare' and parent_id = (select id from categories where name = 'Personal'))),
      ('Straignteners', (select id from categories where name = 'Haircare' and parent_id = (select id from categories where name = 'Personal'))),
      ('Combs', (select id from categories where name = 'Haircare' and parent_id = (select id from categories where name = 'Personal'))),

    -- Makeup
      ('Tools', (select id from categories where name = 'Makeup' and parent_id = (select id from categories where name = 'Personal'))),
      ('Concealers', (select id from categories where name = 'Makeup' and parent_id = (select id from categories where name = 'Personal'))),
      ('Lips', (select id from categories where name = 'Makeup' and parent_id = (select id from categories where name = 'Personal'))),
      ('Mascara', (select id from categories where name = 'Makeup' and parent_id = (select id from categories where name = 'Personal'))),
      ('Highlights', (select id from categories where name = 'Makeup' and parent_id = (select id from categories where name = 'Personal'))),
      ('Foundations', (select id from categories where name = 'Makeup' and parent_id = (select id from categories where name = 'Personal'))),
      ('Powder', (select id from categories where name = 'Makeup' and parent_id = (select id from categories where name = 'Personal'))),
      ('Primer', (select id from categories where name = 'Makeup' and parent_id = (select id from categories where name = 'Personal'))),
      ('Nails', (select id from categories where name = 'Makeup' and parent_id = (select id from categories where name = 'Personal'))),

  -- Outdoor
    -- Biking
      ('Bicycles', (select id from categories where name = 'Biking' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Locks', (select id from categories where name = 'Biking' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Wheels', (select id from categories where name = 'Biking' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Helmets', (select id from categories where name = 'Biking' and parent_id = (select id from categories where name = 'Outdoor'))),

    -- Camping
      ('Tents', (select id from categories where name = 'Camping' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Sleeping Bags', (select id from categories where name = 'Camping' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Portable Stove', (select id from categories where name = 'Camping' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Chairs', (select id from categories where name = 'Camping' and parent_id = (select id from categories where name = 'Outdoor'))),

    -- Fishing
      ('Poles', (select id from categories where name = 'Fishing' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Baits', (select id from categories where name = 'Fishing' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Nets', (select id from categories where name = 'Fishing' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Clothing', (select id from categories where name = 'Fishing' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Tools', (select id from categories where name = 'Fishing' and parent_id = (select id from categories where name = 'Outdoor'))),

    -- Hiking
      ('Shoes', (select id from categories where name = 'Hiking' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Clothing', (select id from categories where name = 'Hiking' and parent_id = (select id from categories where name = 'Outdoor'))),

    -- Skiing/Snowboarding
      ('Skis', (select id from categories where name = 'Skiing/Snowboarding' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Helmets', (select id from categories where name = 'Skiing/Snowboarding' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Poles', (select id from categories where name = 'Skiing/Snowboarding' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Boards', (select id from categories where name = 'Skiing/Snowboarding' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Boots', (select id from categories where name = 'Skiing/Snowboarding' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Clothing', (select id from categories where name = 'Skiing/Snowboarding' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Goggles', (select id from categories where name = 'Skiing/Snowboarding' and parent_id = (select id from categories where name = 'Outdoor'))),

    -- Water Activities
      ('Paddles', (select id from categories where name = 'Water Activities' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Canoes', (select id from categories where name = 'Water Activities' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Kayaks', (select id from categories where name = 'Water Activities' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Goggles', (select id from categories where name = 'Water Activities' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Flippers', (select id from categories where name = 'Water Activities' and parent_id = (select id from categories where name = 'Outdoor'))),
      ('Clothing', (select id from categories where name = 'Water Activities' and parent_id = (select id from categories where name = 'Outdoor')));

insert into auth.users (
  id,
  instance_id,
  role,
  aud,
  email,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  encrypted_password,
  created_at,
  updated_at,
  last_sign_in_at,
  email_confirmed_at,
  confirmation_sent_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) values (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@toadyou.com',
  '{"provider":"email","providers":["email"]}',
  '{"is_admin":true}',
  false,
  crypt('11111111', gen_salt('bf')),
  now(),
  now(),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);
