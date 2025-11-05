import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems, cartItems, products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    // Get all orders for the authenticated user
    const userOrders = await db.select()
      .from(orders)
      .where(eq(orders.userId, session.user.id))
      .orderBy(desc(orders.createdAt));

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db.select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          orderItems: items
        };
      })
    );

    return NextResponse.json(ordersWithItems);
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const requestBody = await request.json();
    const { deliveryAddress, deliveryPhone, deliveryNotes, deliveryFee } = requestBody;

    // Security check: reject if userId provided in body
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Validate required fields
    if (!deliveryAddress || deliveryAddress.trim() === '') {
      return NextResponse.json({ 
        error: "Delivery address is required",
        code: "MISSING_DELIVERY_ADDRESS" 
      }, { status: 400 });
    }

    if (!deliveryPhone || deliveryPhone.trim() === '') {
      return NextResponse.json({ 
        error: "Delivery phone is required",
        code: "MISSING_DELIVERY_PHONE" 
      }, { status: 400 });
    }

    // Get user's cart items with product details
    const userCartItems = await db.select({
      cartItem: cartItems,
      product: products
    })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, session.user.id));

    // Validate cart is not empty
    if (userCartItems.length === 0) {
      return NextResponse.json({ 
        error: "Cart is empty",
        code: "EMPTY_CART" 
      }, { status: 400 });
    }

    // Validate all products exist and are in stock
    for (const item of userCartItems) {
      // Check in_stock field (integer 0/1)
      if (item.product.inStock !== 1) {
        return NextResponse.json({ 
          error: `Product "${item.product.name}" is no longer available`,
          code: "PRODUCT_NOT_ACTIVE" 
        }, { status: 400 });
      }

      // Validate sufficient stock
      if (item.cartItem.quantity > item.product.stockQuantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for "${item.product.name}". Available: ${item.product.stockQuantity}`,
          code: "INSUFFICIENT_STOCK" 
        }, { status: 400 });
      }
    }

    // Calculate subtotal
    const subtotal = userCartItems.reduce((sum, item) => {
      return sum + (item.cartItem.quantity * item.product.price);
    }, 0);

    // Set delivery fee
    const finalDeliveryFee = deliveryFee !== undefined ? deliveryFee : 0;

    // Calculate total
    const total = subtotal + finalDeliveryFee;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const now = new Date().toISOString();

    // Use transaction to ensure data consistency
    const result = await db.batch([
      // Create order
      db.insert(orders).values({
        userId: session.user.id,
        orderNumber,
        status: 'pending',
        subtotal,
        deliveryFee: finalDeliveryFee,
        total,
        deliveryAddress: deliveryAddress.trim(),
        deliveryPhone: deliveryPhone.trim(),
        deliveryNotes: deliveryNotes?.trim() || null,
        createdAt: now,
        updatedAt: now
      }).returning(),
      
      // Get the created order to use its ID
      db.select().from(orders).where(eq(orders.orderNumber, orderNumber))
    ]);

    const newOrder = result[0][0];
    const createdOrder = result[1][0];

    // Create order items
    const orderItemsData = userCartItems.map(item => ({
      orderId: createdOrder.id,
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.imageUrl,
      quantity: item.cartItem.quantity,
      unitPrice: item.product.price,
      totalPrice: item.cartItem.quantity * item.product.price,
      createdAt: now
    }));

    const createdOrderItems = await db.insert(orderItems)
      .values(orderItemsData)
      .returning();

    // Clear user's cart
    await db.delete(cartItems)
      .where(eq(cartItems.userId, session.user.id));

    // Return created order with items
    return NextResponse.json({
      ...newOrder,
      orderItems: createdOrderItems
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}