import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { foodOrders, foodOrderItems, menuItems, restaurants } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled"
] as const;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication required
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const id = params.id;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const orderId = parseInt(id);

    // Fetch order with user ownership check
    const orderResult = await db
      .select()
      .from(foodOrders)
      .where(and(
        eq(foodOrders.id, orderId),
        eq(foodOrders.userId, userId)
      ))
      .limit(1);

    if (orderResult.length === 0) {
      return NextResponse.json(
        { error: 'Order not found', code: 'ORDER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const order = orderResult[0];

    // Fetch restaurant details
    const restaurantResult = await db
      .select({
        id: restaurants.id,
        name: restaurants.name,
        slug: restaurants.slug,
        imageUrl: restaurants.imageUrl,
        phone: restaurants.phone,
      })
      .from(restaurants)
      .where(eq(restaurants.id, order.restaurantId))
      .limit(1);

    const restaurant = restaurantResult[0] || null;

    // Fetch order items with menu item details
    const orderItemsResult = await db
      .select({
        id: foodOrderItems.id,
        orderId: foodOrderItems.orderId,
        menuItemId: foodOrderItems.menuItemId,
        quantity: foodOrderItems.quantity,
        price: foodOrderItems.price,
        specialInstructions: foodOrderItems.specialInstructions,
        createdAt: foodOrderItems.createdAt,
        menuItemName: menuItems.name,
        menuItemImageUrl: menuItems.imageUrl,
        menuItemRestaurantId: menuItems.restaurantId,
      })
      .from(foodOrderItems)
      .leftJoin(menuItems, eq(foodOrderItems.menuItemId, menuItems.id))
      .where(eq(foodOrderItems.orderId, orderId));

    const orderItemsWithDetails = orderItemsResult.map(item => ({
      id: item.id,
      orderId: item.orderId,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      price: item.price,
      specialInstructions: item.specialInstructions,
      createdAt: item.createdAt,
      menuItem: {
        name: item.menuItemName,
        imageUrl: item.menuItemImageUrl,
        restaurantId: item.menuItemRestaurantId,
      }
    }));

    // Return complete order with items and restaurant
    return NextResponse.json({
      ...order,
      orderItems: orderItemsWithDetails,
      restaurant,
    });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication required
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const id = params.id;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const orderId = parseInt(id);

    // Parse request body
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required', code: 'MISSING_STATUS' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { 
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
          code: 'INVALID_STATUS'
        },
        { status: 400 }
      );
    }

    // Check if order exists and belongs to user
    const existingOrder = await db
      .select()
      .from(foodOrders)
      .where(and(
        eq(foodOrders.id, orderId),
        eq(foodOrders.userId, userId)
      ))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json(
        { error: 'Order not found', code: 'ORDER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Update order status
    const updated = await db
      .update(foodOrders)
      .set({
        status,
        updatedAt: new Date().toISOString()
      })
      .where(and(
        eq(foodOrders.id, orderId),
        eq(foodOrders.userId, userId)
      ))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update order', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updated[0]);

  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}