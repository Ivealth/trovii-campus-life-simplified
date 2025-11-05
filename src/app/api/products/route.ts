import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq, and, gte, lte, like, or, desc, asc, count, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse and validate query parameters
    const categoryParam = searchParams.get('category');
    const search = searchParams.get('search')?.trim();
    const sortParam = searchParams.get('sort') ?? 'newest';
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const limitParam = searchParams.get('limit') ?? '12';
    const offsetParam = searchParams.get('offset') ?? '0';

    // Validate and parse numeric parameters
    let categoryId: number | null = null;
    if (categoryParam) {
      categoryId = parseInt(categoryParam);
      if (isNaN(categoryId)) {
        return NextResponse.json(
          { error: 'Invalid category parameter', code: 'INVALID_CATEGORY' },
          { status: 400 }
        );
      }
    }

    let minPrice: number | null = null;
    if (minPriceParam) {
      minPrice = parseInt(minPriceParam);
      if (isNaN(minPrice) || minPrice < 0) {
        return NextResponse.json(
          { error: 'Invalid minPrice parameter', code: 'INVALID_MIN_PRICE' },
          { status: 400 }
        );
      }
    }

    let maxPrice: number | null = null;
    if (maxPriceParam) {
      maxPrice = parseInt(maxPriceParam);
      if (isNaN(maxPrice) || maxPrice < 0) {
        return NextResponse.json(
          { error: 'Invalid maxPrice parameter', code: 'INVALID_MAX_PRICE' },
          { status: 400 }
        );
      }
    }

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      return NextResponse.json(
        { error: 'minPrice cannot be greater than maxPrice', code: 'INVALID_PRICE_RANGE' },
        { status: 400 }
      );
    }

    const limit = Math.min(parseInt(limitParam), 50);
    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json(
        { error: 'Invalid limit parameter', code: 'INVALID_LIMIT' },
        { status: 400 }
      );
    }

    const offset = parseInt(offsetParam);
    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { error: 'Invalid offset parameter', code: 'INVALID_OFFSET' },
        { status: 400 }
      );
    }

    const validSorts = ['price-asc', 'price-desc', 'rating', 'newest', 'popular'];
    if (!validSorts.includes(sortParam)) {
      return NextResponse.json(
        { error: 'Invalid sort parameter. Valid options: price-asc, price-desc, rating, newest, popular', code: 'INVALID_SORT' },
        { status: 400 }
      );
    }

    // Build where conditions - check in_stock field
    const conditions = [eq(products.inStock, 1)];

    if (categoryId !== null) {
      conditions.push(eq(products.categoryId, categoryId));
    }

    if (minPrice !== null) {
      conditions.push(gte(products.price, minPrice));
    }

    if (maxPrice !== null) {
      conditions.push(lte(products.price, maxPrice));
    }

    if (search) {
      const searchCondition = or(
        like(products.name, `%${search}%`),
        like(products.description, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    const whereCondition = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Determine sort order
    let orderByClause;
    switch (sortParam) {
      case 'price-asc':
        orderByClause = [asc(products.price)];
        break;
      case 'price-desc':
        orderByClause = [desc(products.price)];
        break;
      case 'rating':
        orderByClause = [desc(products.rating), desc(products.reviewCount)];
        break;
      case 'popular':
        orderByClause = [desc(products.reviewCount), desc(products.rating)];
        break;
      case 'newest':
      default:
        orderByClause = [desc(products.createdAt)];
        break;
    }

    // Get total count
    const totalCountResult = await db
      .select({ count: count() })
      .from(products)
      .where(whereCondition);

    const total = totalCountResult[0]?.count ?? 0;

    // Fetch products with category information
    const results = await db
      .select({
        id: products.id,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        name: products.name,
        slug: products.slug,
        description: products.description,
        shortDescription: products.shortDescription,
        price: products.price,
        originalPrice: products.originalPrice,
        imageUrl: products.imageUrl,
        additionalImages: products.additionalImages,
        stockQuantity: products.stockQuantity,
        inStock: products.inStock,
        badge: products.badge,
        rating: products.rating,
        reviewCount: products.reviewCount,
        isFeatured: products.isFeatured,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(whereCondition)
      .orderBy(...orderByClause)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      products: results,
      total,
      limit,
      offset,
    });

  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}