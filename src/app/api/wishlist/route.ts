import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { wishlistItems, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const userWishlist = await db
      .select({
        id: wishlistItems.id,
        userId: wishlistItems.userId,
        productId: wishlistItems.productId,
        createdAt: wishlistItems.createdAt,
        product: {
          id: products.id,
          categoryId: products.categoryId,
          name: products.name,
          slug: products.slug,
          description: products.description,
          price: products.price,
          originalPrice: products.originalPrice,
          imageUrl: products.imageUrl,
          badge: products.badge,
          rating: products.rating,
          reviewCount: products.reviewCount,
          stockQuantity: products.stockQuantity,
          isActive: products.isActive,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
        }
      })
      .from(wishlistItems)
      .innerJoin(products, eq(wishlistItems.productId, products.id))
      .where(eq(wishlistItems.userId, session.user.id));

    return NextResponse.json(userWishlist, { status: 200 });
  } catch (error) {
    console.error('GET wishlist error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ 
        error: 'Product ID is required',
        code: 'MISSING_PRODUCT_ID' 
      }, { status: 400 });
    }

    if (isNaN(parseInt(productId))) {
      return NextResponse.json({ 
        error: 'Valid product ID is required',
        code: 'INVALID_PRODUCT_ID' 
      }, { status: 400 });
    }

    const product = await db.select()
      .from(products)
      .where(eq(products.id, parseInt(productId)))
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
        code: 'PRODUCT_INACTIVE' 
      }, { status: 400 });
    }

    const existingItem = await db.select()
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.userId, session.user.id),
          eq(wishlistItems.productId, parseInt(productId))
        )
      )
      .limit(1);

    if (existingItem.length > 0) {
      return NextResponse.json({ 
        error: 'Product already in wishlist',
        code: 'DUPLICATE_WISHLIST_ITEM' 
      }, { status: 400 });
    }

    const newWishlistItem = await db.insert(wishlistItems)
      .values({
        userId: session.user.id,
        productId: parseInt(productId),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newWishlistItem[0], { status: 201 });
  } catch (error) {
    console.error('POST wishlist error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const existingItem = await db.select()
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.id, parseInt(id)),
          eq(wishlistItems.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingItem.length === 0) {
      return NextResponse.json({ 
        error: 'Wishlist item not found',
        code: 'WISHLIST_ITEM_NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(wishlistItems)
      .where(
        and(
          eq(wishlistItems.id, parseInt(id)),
          eq(wishlistItems.userId, session.user.id)
        )
      )
      .returning();

    return NextResponse.json({ 
      message: 'Wishlist item removed successfully',
      item: deleted[0] 
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE wishlist error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}