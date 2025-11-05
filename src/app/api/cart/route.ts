import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cartItems, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED' 
      }, { status: 401 });
    }

    const userId = session.user.id;

    const items = await db
      .select({
        id: cartItems.id,
        userId: cartItems.userId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
        updatedAt: cartItems.updatedAt,
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          imageUrl: products.imageUrl,
          stockQuantity: products.stockQuantity,
          isActive: products.isActive,
        }
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));

    const itemsWithSubtotal = items.map(item => ({
      ...item,
      subtotal: item.quantity * (item.product.price || 0)
    }));

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = itemsWithSubtotal.reduce((sum, item) => sum + item.subtotal, 0);

    return NextResponse.json({
      items: itemsWithSubtotal,
      totalItems,
      subtotal
    }, { status: 200 });

  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED' 
      }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId) {
      return NextResponse.json({ 
        error: 'Product ID is required',
        code: 'MISSING_PRODUCT_ID' 
      }, { status: 400 });
    }

    if (!quantity || isNaN(parseInt(quantity.toString())) || parseInt(quantity.toString()) < 1) {
      return NextResponse.json({ 
        error: 'Valid quantity (>= 1) is required',
        code: 'INVALID_QUANTITY' 
      }, { status: 400 });
    }

    const productIdInt = parseInt(productId.toString());
    const quantityInt = parseInt(quantity.toString());

    if (isNaN(productIdInt)) {
      return NextResponse.json({ 
        error: 'Valid product ID is required',
        code: 'INVALID_PRODUCT_ID' 
      }, { status: 400 });
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productIdInt))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json({ 
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND' 
      }, { status: 404 });
    }

    // Check in_stock field (integer 0/1)
    if (product[0].inStock !== 1) {
      return NextResponse.json({ 
        error: 'Product is not available',
        code: 'PRODUCT_NOT_ACTIVE' 
      }, { status: 400 });
    }

    if ((product[0].stockQuantity || 0) < quantityInt) {
      return NextResponse.json({ 
        error: 'Insufficient stock available',
        code: 'INSUFFICIENT_STOCK' 
      }, { status: 400 });
    }

    const existingCartItem = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, userId),
          eq(cartItems.productId, productIdInt)
        )
      )
      .limit(1);

    if (existingCartItem.length > 0) {
      const newQuantity = existingCartItem[0].quantity + quantityInt;
      
      if ((product[0].stockQuantity || 0) < newQuantity) {
        return NextResponse.json({ 
          error: 'Insufficient stock for combined quantity',
          code: 'INSUFFICIENT_STOCK' 
        }, { status: 400 });
      }

      const updated = await db
        .update(cartItems)
        .set({
          quantity: newQuantity,
          updatedAt: new Date().toISOString()
        })
        .where(
          and(
            eq(cartItems.id, existingCartItem[0].id),
            eq(cartItems.userId, userId)
          )
        )
        .returning();

      return NextResponse.json(updated[0], { status: 200 });
    }

    const newCartItem = await db
      .insert(cartItems)
      .values({
        userId,
        productId: productIdInt,
        quantity: quantityInt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newCartItem[0], { status: 201 });

  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}