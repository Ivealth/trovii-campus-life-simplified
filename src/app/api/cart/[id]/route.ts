import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cartItems, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHENTICATED' },
        { status: 401 }
      );
    }

    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid cart item ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { quantity } = body;

    if (!quantity || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1', code: 'INVALID_QUANTITY' },
        { status: 400 }
      );
    }

    const existingCartItem = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.id, parseInt(id)))
      .limit(1);

    if (existingCartItem.length === 0) {
      return NextResponse.json(
        { error: 'Cart item not found', code: 'CART_ITEM_NOT_FOUND' },
        { status: 404 }
      );
    }

    if (existingCartItem[0].userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to cart item', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, existingCartItem[0].productId))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json(
        { error: 'Associated product not found', code: 'PRODUCT_NOT_FOUND' },
        { status: 404 }
      );
    }

    if (product[0].stockQuantity < quantity) {
      return NextResponse.json(
        {
          error: `Insufficient stock. Only ${product[0].stockQuantity} items available`,
          code: 'INSUFFICIENT_STOCK',
        },
        { status: 400 }
      );
    }

    const updatedCartItem = await db
      .update(cartItems)
      .set({
        quantity,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(cartItems.id, parseInt(id)),
          eq(cartItems.userId, session.user.id)
        )
      )
      .returning();

    if (updatedCartItem.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update cart item', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedCartItem[0], { status: 200 });
  } catch (error) {
    console.error('PUT cart item error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHENTICATED' },
        { status: 401 }
      );
    }

    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid cart item ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const existingCartItem = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.id, parseInt(id)))
      .limit(1);

    if (existingCartItem.length === 0) {
      return NextResponse.json(
        { error: 'Cart item not found', code: 'CART_ITEM_NOT_FOUND' },
        { status: 404 }
      );
    }

    if (existingCartItem[0].userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to cart item', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    const deletedCartItem = await db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.id, parseInt(id)),
          eq(cartItems.userId, session.user.id)
        )
      )
      .returning();

    if (deletedCartItem.length === 0) {
      return NextResponse.json(
        { error: 'Failed to delete cart item', code: 'DELETE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Cart item removed successfully',
        deletedItem: deletedCartItem[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE cart item error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}