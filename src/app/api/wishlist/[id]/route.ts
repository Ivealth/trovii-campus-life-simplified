import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { wishlistItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTHENTICATION_REQUIRED' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const wishlistItemId = parseInt(id);

    // Check if wishlist item exists and belongs to user
    const existingItem = await db
      .select()
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.id, wishlistItemId),
          eq(wishlistItems.userId, session.user.id)
        )
      )
      .limit(1);

    if (existingItem.length === 0) {
      // Check if item exists at all
      const itemExists = await db
        .select()
        .from(wishlistItems)
        .where(eq(wishlistItems.id, wishlistItemId))
        .limit(1);

      if (itemExists.length === 0) {
        return NextResponse.json(
          { error: 'Wishlist item not found', code: 'WISHLIST_ITEM_NOT_FOUND' },
          { status: 404 }
        );
      }

      // Item exists but doesn't belong to user
      return NextResponse.json(
        { 
          error: 'You do not have permission to delete this wishlist item', 
          code: 'FORBIDDEN' 
        },
        { status: 403 }
      );
    }

    // Delete the wishlist item
    const deleted = await db
      .delete(wishlistItems)
      .where(
        and(
          eq(wishlistItems.id, wishlistItemId),
          eq(wishlistItems.userId, session.user.id)
        )
      )
      .returning();

    return NextResponse.json(
      {
        message: 'Wishlist item deleted successfully',
        deletedItem: deleted[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}