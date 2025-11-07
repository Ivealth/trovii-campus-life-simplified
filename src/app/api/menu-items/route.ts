import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { menuItems, restaurants } from '@/db/schema';
import { eq, and, like, or, count, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse and validate query parameters
    const restaurantIdParam = searchParams.get('restaurantId');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isAvailableParam = searchParams.get('isAvailable');
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    // Validate restaurantId
    let restaurantId: number | null = null;
    if (restaurantIdParam) {
      restaurantId = parseInt(restaurantIdParam);
      if (isNaN(restaurantId) || restaurantId <= 0) {
        return NextResponse.json({
          error: 'Invalid restaurantId. Must be a positive integer.',
          code: 'INVALID_RESTAURANT_ID'
        }, { status: 400 });
      }
    }

    // Validate isAvailable
    let isAvailable: boolean | null = null;
    if (isAvailableParam) {
      if (isAvailableParam !== 'true' && isAvailableParam !== 'false') {
        return NextResponse.json({
          error: 'Invalid isAvailable. Must be "true" or "false".',
          code: 'INVALID_IS_AVAILABLE'
        }, { status: 400 });
      }
      isAvailable = isAvailableParam === 'true';
    } else {
      // Default to available items only if not explicitly set
      isAvailable = true;
    }

    // Validate and parse limit
    const limit = Math.min(parseInt(limitParam ?? '20'), 50);
    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json({
        error: 'Invalid limit. Must be a positive integer.',
        code: 'INVALID_LIMIT'
      }, { status: 400 });
    }

    // Validate and parse offset
    const offset = parseInt(offsetParam ?? '0');
    if (isNaN(offset) || offset < 0) {
      return NextResponse.json({
        error: 'Invalid offset. Must be a non-negative integer.',
        code: 'INVALID_OFFSET'
      }, { status: 400 });
    }

    // Build WHERE conditions
    const conditions = [];

    // Add restaurantId filter
    if (restaurantId !== null) {
      conditions.push(eq(menuItems.restaurantId, restaurantId));
    }

    // Add category filter
    if (category) {
      conditions.push(eq(menuItems.category, category));
    }

    // Add availability filter
    if (isAvailable !== null) {
      conditions.push(eq(menuItems.isAvailable, isAvailable ? 1 : 0));
    }

    // Add search filter
    if (search) {
      const searchCondition = or(
        like(menuItems.name, `%${search}%`),
        like(menuItems.description, `%${search}%`)
      );
      conditions.push(searchCondition!);
    }

    // Combine all conditions
    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const countQuery = whereCondition
      ? db.select({ count: sql<number>`count(*)` }).from(menuItems).where(whereCondition)
      : db.select({ count: sql<number>`count(*)` }).from(menuItems);

    const countResult = await countQuery;
    const total = Number(countResult[0]?.count ?? 0);

    // Build main query with join
    let query = db
      .select({
        id: menuItems.id,
        restaurantId: menuItems.restaurantId,
        name: menuItems.name,
        slug: menuItems.slug,
        description: menuItems.description,
        price: menuItems.price,
        originalPrice: menuItems.originalPrice,
        imageUrl: menuItems.imageUrl,
        category: menuItems.category,
        isAvailable: menuItems.isAvailable,
        badge: menuItems.badge,
        preparationTime: menuItems.preparationTime,
        createdAt: menuItems.createdAt,
        restaurant: {
          id: restaurants.id,
          name: restaurants.name,
          slug: restaurants.slug,
          cuisine: restaurants.cuisine,
        }
      })
      .from(menuItems)
      .leftJoin(restaurants, eq(menuItems.restaurantId, restaurants.id));

    // Apply WHERE condition
    if (whereCondition) {
      query = query.where(whereCondition) as any;
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    // Transform results to match response format
    const menuItemsData = results.map(item => ({
      id: item.id,
      restaurantId: item.restaurantId,
      name: item.name,
      slug: item.slug,
      description: item.description,
      price: item.price,
      originalPrice: item.originalPrice,
      imageUrl: item.imageUrl,
      category: item.category,
      isAvailable: item.isAvailable,
      badge: item.badge,
      preparationTime: item.preparationTime,
      createdAt: item.createdAt,
      restaurant: item.restaurant
    }));

    return NextResponse.json({
      menuItems: menuItemsData,
      total,
      limit,
      offset
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}