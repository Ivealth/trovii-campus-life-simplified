import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { menuItems, restaurants } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID is valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const menuItemId = parseInt(id);

    // Query menu item with JOIN to restaurants table
    const result = await db
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
          imageUrl: restaurants.imageUrl,
          rating: restaurants.rating,
          deliveryTime: restaurants.deliveryTime,
          deliveryFee: restaurants.deliveryFee,
          isOpen: restaurants.isOpen,
        },
      })
      .from(menuItems)
      .innerJoin(restaurants, eq(menuItems.restaurantId, restaurants.id))
      .where(and(eq(menuItems.id, menuItemId), eq(menuItems.isAvailable, 1)))
      .limit(1);

    // If not found or not available, return 404
    if (result.length === 0) {
      return NextResponse.json(
        { 
          error: 'Menu item not found or not available',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}