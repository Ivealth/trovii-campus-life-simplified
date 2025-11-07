import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { restaurants, menuItems } from '@/db/schema';
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
          error: 'Valid restaurant ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const restaurantId = parseInt(id);

    // Query restaurant by id where isOpen = 1
    const restaurantResult = await db
      .select()
      .from(restaurants)
      .where(and(eq(restaurants.id, restaurantId), eq(restaurants.isOpen, 1)))
      .limit(1);

    if (restaurantResult.length === 0) {
      return NextResponse.json(
        {
          error: 'Restaurant not found',
          code: 'RESTAURANT_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    const restaurant = restaurantResult[0];

    // Fetch all menu items for this restaurant where isAvailable = 1
    const menuItemsResult = await db
      .select()
      .from(menuItems)
      .where(
        and(
          eq(menuItems.restaurantId, restaurantId),
          eq(menuItems.isAvailable, 1)
        )
      );

    // Group menu items by category
    const menuByCategory: Record<string, typeof menuItemsResult> = {};
    
    menuItemsResult.forEach((item) => {
      const category = item.category || 'Other';
      if (!menuByCategory[category]) {
        menuByCategory[category] = [];
      }
      menuByCategory[category].push(item);
    });

    // Return restaurant data with menu items
    return NextResponse.json({
      ...restaurant,
      menuItems: menuItemsResult,
      menuByCategory,
    });
  } catch (error) {
    console.error('GET restaurant error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}