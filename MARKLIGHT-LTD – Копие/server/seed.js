import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Subcategory from './models/Subcategory.js';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Subcategory.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const adminPasswordHash = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      email: 'admin@luxury.com',
      password: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      isAdmin: true
    });
    await adminUser.save();

    // Create regular user
    console.log('Creating regular user...');
    const userPasswordHash = await bcrypt.hash('user123', 12);
    const regularUser = new User({
      email: 'user@example.com',
      password: userPasswordHash,
      firstName: 'John',
      lastName: 'Doe',
      isAdmin: false
    });
    await regularUser.save();


    // --- Нови категории със slug ---
    const categories = [
      { name: 'Люстри', slug: 'lyustri', description: 'Елегантни люстри за всяка стая', sortOrder: 1 },
      { name: 'Настолни лампи', slug: 'nastolni-lampi', description: 'Стилни настолни лампи за работа и четене', sortOrder: 2 },
      { name: 'Стенни лампи', slug: 'stenni-lampi', description: 'Модерни стенни лампи за акцентно осветление', sortOrder: 3 },
      { name: 'Подови лампи', slug: 'podovi-lampi', description: 'Дизайнерски подови лампи за атмосферно осветление', sortOrder: 4 },
      { name: 'LED осветление', slug: 'led-osvetlenie', description: 'Енергоспестяващо LED осветление', sortOrder: 5 }
    ];
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // --- Подкатегории със slug ---
    const subcategories = [
      { name: 'Класически', slug: 'klasicheski', category: createdCategories[0]._id },
      { name: 'Модерни', slug: 'moderni', category: createdCategories[0]._id },
      { name: 'LED', slug: 'led', category: createdCategories[0]._id },
      { name: 'Дървени', slug: 'darveni', category: createdCategories[3]._id },
      { name: 'Метални', slug: 'metalni', category: createdCategories[3]._id },
      { name: 'RGB', slug: 'rgb', category: createdCategories[4]._id },
      { name: 'Бели', slug: 'beli', category: createdCategories[4]._id }
    ];
    const createdSubcategories = await Subcategory.insertMany(subcategories);
    console.log(`Created ${createdSubcategories.length} subcategories`);

    // Карта за бърз достъп
    const categoryMap = {};
    createdCategories.forEach(cat => { categoryMap[cat.name] = cat._id; });
    const subcategoryMap = {};
    createdSubcategories.forEach(sub => { subcategoryMap[sub.name] = sub._id; });

    // --- Продукти с подкатегории ---
    const products = [
      {
        name: 'Кристална люстра "Диамант"',
        description: 'Луксозна кристална люстра с 12 крака, перфектна за елегантни трапезарии и салони. Изработена от висококачествен кристал с хромирана основа.',
        price: 2599.99,
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop',
        category: categoryMap['Люстри'],
        subcategory: subcategoryMap['Класически'],
        inStock: true,
        featured: true,
        stockQuantity: 5
      },
      {
        name: 'Модерна настолна лампа "Минимал"',
        description: 'Стилна LED настолна лампа с безжично зареждане и регулируема яркост. Идеална за офис или спалня.',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        category: categoryMap['Настолни лампи'],
        inStock: true,
        featured: false,
        stockQuantity: 15
      },
      {
        name: 'Стенна лампа "Арт Деко"',
        description: 'Винтидж стенна лампа в стил Арт Деко с месингова отделка. Добавя характер към всяка стая.',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=400&fit=crop',
        category: categoryMap['Стенни лампи'],
        inStock: true,
        featured: true,
        stockQuantity: 8
      },
      {
        name: 'Подова лампа "Скандинавски стил"',
        description: 'Елегантна подова лампа в скандинавски стил с дървена основа и текстилен абажур.',
        price: 399.99,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
        category: categoryMap['Подови лампи'],
        subcategory: subcategoryMap['Дървени'],
        inStock: true,
        featured: false,
        stockQuantity: 12
      },
      {
        name: 'LED панел "Умен дом"',
        description: 'Интелигентен LED панел с възможност за контрол чрез смартфон. Променлива цветова температура.',
        price: 159.99,
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
        category: categoryMap['LED осветление'],
        subcategory: subcategoryMap['Бели'],
        inStock: true,
        featured: true,
        stockQuantity: 20
      },
      {
        name: 'Индустриална люстра "Лофт"',
        description: 'Метална люстра в индустриален стил с Edison лампи. Перфектна за лофт апартаменти.',
        price: 899.99,
        image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=400&fit=crop',
        category: categoryMap['Люстри'],
        subcategory: subcategoryMap['Модерни'],
        inStock: true,
        featured: false,
        stockQuantity: 3
      },
      {
        name: 'Настолна лампа "Ретро"',
        description: 'Винтидж настолна лампа с медна основа и класически дизайн. Топла атмосфера за четене.',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        category: categoryMap['Настолни лампи'],
        inStock: true,
        featured: false,
        stockQuantity: 18
      },
      {
        name: 'LED лента "Амбиент"',
        description: 'Гъвкава RGB LED лента с дистанционно управление. Идеална за декоративно осветление.',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
        category: categoryMap['LED осветление'],
        subcategory: subcategoryMap['RGB'],
        inStock: true,
        featured: false,
        stockQuantity: 25
      }
    ];
    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    console.log('\n=== Seed data created successfully! ===');
    console.log('Admin user: admin@luxury.com / admin123');
    console.log('Regular user: user@example.com / user123');
    console.log(`Categories: ${createdCategories.length}`);
    console.log(`Products: ${createdProducts.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
