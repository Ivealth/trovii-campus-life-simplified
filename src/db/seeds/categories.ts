import { db } from '@/db';
import { categories } from '@/db/schema';

async function main() {
    const sampleCategories = [
        {
            name: 'Electronics',
            slug: 'electronics',
            icon: '💻',
            description: 'Laptops, phones, headphones, and tech accessories',
            createdAt: new Date('2024-01-01').toISOString(),
        },
        {
            name: 'Fashion',
            slug: 'fashion',
            icon: '👕',
            description: 'Clothing, shoes, and style essentials',
            createdAt: new Date('2024-01-01').toISOString(),
        },
        {
            name: 'Books & Supplies',
            slug: 'books-supplies',
            icon: '📚',
            description: 'Textbooks, notebooks, and study materials',
            createdAt: new Date('2024-01-01').toISOString(),
        },
        {
            name: 'Home & Living',
            slug: 'home-living',
            icon: '🏠',
            description: 'Dorm essentials, furniture, and home decor',
            createdAt: new Date('2024-01-01').toISOString(),
        },
        {
            name: 'Sports & Fitness',
            slug: 'sports-fitness',
            icon: '⚽',
            description: 'Sports equipment, gym gear, and fitness accessories',
            createdAt: new Date('2024-01-01').toISOString(),
        },
        {
            name: 'Beauty & Health',
            slug: 'beauty-health',
            icon: '💄',
            description: 'Skincare, cosmetics, and wellness products',
            createdAt: new Date('2024-01-01').toISOString(),
        },
        {
            name: 'Food & Snacks',
            slug: 'food-snacks',
            icon: '🍕',
            description: 'Snacks, drinks, and food essentials',
            createdAt: new Date('2024-01-01').toISOString(),
        },
        {
            name: 'Accessories',
            slug: 'accessories',
            icon: '👜',
            description: 'Bags, watches, jewelry, and fashion accessories',
            createdAt: new Date('2024-01-01').toISOString(),
        }
    ];

    await db.insert(categories).values(sampleCategories);
    
    console.log('✅ Categories seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});