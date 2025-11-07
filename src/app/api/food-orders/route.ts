import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { foodOrders, foodOrderItems, menuItems, restaurants } from '@/db/schema';
import { eq, desc, and, inArray } from 'drizzle-orm';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const orders = await db.select({
      id: foodOrders.id,
      userId: foodOrders.userId,
      restaurantId: foodOrders.restaurantId,
      orderNumber: foodOrders.orderNumber,
      status: foodOrders.status,
      subtotal: foodOrders.subtotal,
      deliveryFee: foodOrders.deliveryFee,
      total: foodOrders.total,
      deliveryAddress: foodOrders.deliveryAddress,
      deliveryInstructions: foodOrders.deliveryInstructions,
      phone: foodOrders.phone,
      paymentMethod: foodOrders.paymentMethod,
      estimatedDeliveryTime: foodOrders.estimatedDeliveryTime,
      createdAt: foodOrders.createdAt,
      updatedAt: foodOrders.updatedAt,
    })
      .from(foodOrders)
      .where(eq(foodOrders.userId, session.user.id))
      .orderBy(desc(foodOrders.createdAt));

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await db.select({
          id: foodOrderItems.id,
          orderId: foodOrderItems.orderId,
          menuItemId: foodOrderItems.menuItemId,
          quantity: foodOrderItems.quantity,
          price: foodOrderItems.price,
          specialInstructions: foodOrderItems.specialInstructions,
          createdAt: foodOrderItems.createdAt,
          menuItemName: menuItems.name,
          menuItemDescription: menuItems.description,
          menuItemImageUrl: menuItems.imageUrl,
        })
          .from(foodOrderItems)
          .leftJoin(menuItems, eq(foodOrderItems.menuItemId, menuItems.id))
          .where(eq(foodOrderItems.orderId, order.id));

        return {
          ...order,
          orderItems: items,
        };
      })
    );

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { restaurantId, items, deliveryAddress, deliveryInstructions, phone, paymentMethod } = body;

    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    if (!restaurantId) {
      return NextResponse.json({ 
        error: "Restaurant ID is required",
        code: "MISSING_RESTAURANT_ID" 
      }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ 
        error: "Items array is required and must not be empty",
        code: "INVALID_ITEMS" 
      }, { status: 400 });
    }

    if (!deliveryAddress || !deliveryAddress.trim()) {
      return NextResponse.json({ 
        error: "Delivery address is required",
        code: "MISSING_DELIVERY_ADDRESS" 
      }, { status: 400 });
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json({ 
        error: "Phone number is required",
        code: "MISSING_PHONE" 
      }, { status: 400 });
    }

    for (const item of items) {
      if (!item.menuItemId || isNaN(parseInt(item.menuItemId))) {
        return NextResponse.json({ 
          error: "All menu item IDs must be valid integers",
          code: "INVALID_MENU_ITEM_ID" 
        }, { status: 400 });
      }
      if (!item.quantity || parseInt(item.quantity) <= 0) {
        return NextResponse.json({ 
          error: "All quantities must be positive integers",
          code: "INVALID_QUANTITY" 
        }, { status: 400 });
      }
    }

    const restaurant = await db.select()
      .from(restaurants)
      .where(eq(restaurants.id, parseInt(restaurantId)))
      .limit(1);

    if (restaurant.length === 0) {
      return NextResponse.json({ 
        error: "Restaurant not found",
        code: "RESTAURANT_NOT_FOUND" 
      }, { status: 404 });
    }

    if (!restaurant[0].isOpen) {
      return NextResponse.json({ 
        error: "Restaurant is currently closed",
        code: "RESTAURANT_CLOSED" 
      }, { status: 400 });
    }

    const menuItemIds = items.map(item => parseInt(item.menuItemId));
    const menuItemsData = await db.select()
      .from(menuItems)
      .where(
        and(
          inArray(menuItems.id, menuItemIds),
          eq(menuItems.restaurantId, parseInt(restaurantId))
        )
      );

    if (menuItemsData.length !== menuItemIds.length) {
      return NextResponse.json({ 
        error: "One or more menu items not found or do not belong to this restaurant",
        code: "INVALID_MENU_ITEMS" 
      }, { status: 404 });
    }

    for (const menuItem of menuItemsData) {
      if (!menuItem.isAvailable) {
        return NextResponse.json({ 
          error: `Menu item "${menuItem.name}" is currently unavailable`,
          code: "MENU_ITEM_UNAVAILABLE" 
        }, { status: 400 });
      }
    }

    const menuItemMap = new Map(menuItemsData.map(item => [item.id, item]));
    let subtotal = 0;

    for (const item of items) {
      const menuItem = menuItemMap.get(parseInt(item.menuItemId));
      if (menuItem) {
        subtotal += menuItem.price * parseInt(item.quantity);
      }
    }

    if (restaurant[0].minimumOrder && subtotal < restaurant[0].minimumOrder) {
      return NextResponse.json({ 
        error: `Minimum order amount is ${restaurant[0].minimumOrder}. Current subtotal is ${subtotal}`,
        code: "BELOW_MINIMUM_ORDER" 
      }, { status: 400 });
    }

    const deliveryFee = restaurant[0].deliveryFee || 0;
    const total = subtotal + deliveryFee;

    const timestamp = Date.now();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `FO-${timestamp}-${randomDigits}`;

    let estimatedDeliveryTime = null;
    if (restaurant[0].deliveryTime) {
      const currentTime = new Date();
      const deliveryMinutes = parseInt(restaurant[0].deliveryTime.split('-')[1] || '30');
      currentTime.setMinutes(currentTime.getMinutes() + deliveryMinutes);
      estimatedDeliveryTime = currentTime.toISOString();
    }

    const newOrder = await db.insert(foodOrders)
      .values({
        userId: session.user.id,
        restaurantId: parseInt(restaurantId),
        orderNumber,
        status: 'pending',
        subtotal,
        deliveryFee,
        total,
        deliveryAddress: deliveryAddress.trim(),
        deliveryInstructions: deliveryInstructions?.trim() || null,
        phone: phone.trim(),
        paymentMethod: paymentMethod || 'cash',
        estimatedDeliveryTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    if (newOrder.length === 0) {
      return NextResponse.json({ 
        error: "Failed to create order",
        code: "ORDER_CREATION_FAILED" 
      }, { status: 500 });
    }

    const orderId = newOrder[0].id;
    const orderItemsData = items.map(item => {
      const menuItem = menuItemMap.get(parseInt(item.menuItemId));
      return {
        orderId,
        menuItemId: parseInt(item.menuItemId),
        quantity: parseInt(item.quantity),
        price: menuItem!.price,
        specialInstructions: item.specialInstructions?.trim() || null,
        createdAt: new Date().toISOString(),
      };
    });

    const createdOrderItems = await db.insert(foodOrderItems)
      .values(orderItemsData)
      .returning();

    const orderItemsWithDetails = await db.select({
      id: foodOrderItems.id,
      orderId: foodOrderItems.orderId,
      menuItemId: foodOrderItems.menuItemId,
      quantity: foodOrderItems.quantity,
      price: foodOrderItems.price,
      specialInstructions: foodOrderItems.specialInstructions,
      createdAt: foodOrderItems.createdAt,
      menuItemName: menuItems.name,
      menuItemDescription: menuItems.description,
      menuItemImageUrl: menuItems.imageUrl,
    })
      .from(foodOrderItems)
      .leftJoin(menuItems, eq(foodOrderItems.menuItemId, menuItems.id))
      .where(eq(foodOrderItems.orderId, orderId));

    return NextResponse.json(
      {
        ...newOrder[0],
        orderItems: orderItemsWithDetails,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}