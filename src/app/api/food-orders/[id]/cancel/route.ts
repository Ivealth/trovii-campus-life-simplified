import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { foodOrders } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Extract and validate id
    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid order ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const orderId = parseInt(id);

    // Query order by id AND userId to ensure user owns the order
    const existingOrder = await db.select()
      .from(foodOrders)
      .where(and(
        eq(foodOrders.id, orderId),
        eq(foodOrders.userId, session.user.id)
      ))
      .limit(1);

    // Check if order exists and belongs to user
    if (existingOrder.length === 0) {
      return NextResponse.json(
        { error: 'Order not found', code: 'ORDER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const order = existingOrder[0];

    // Check if order is already cancelled
    if (order.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Order is already cancelled', code: 'ALREADY_CANCELLED' },
        { status: 400 }
      );
    }

    // Check if order can be cancelled based on current status
    const nonCancellableStatuses = ['preparing', 'ready', 'out_for_delivery', 'delivered'];
    if (nonCancellableStatuses.includes(order.status)) {
      return NextResponse.json(
        { error: 'Order cannot be cancelled at this stage', code: 'CANNOT_CANCEL' },
        { status: 400 }
      );
    }

    // Update order status to cancelled
    const updatedOrder = await db.update(foodOrders)
      .set({
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      })
      .where(and(
        eq(foodOrders.id, orderId),
        eq(foodOrders.userId, session.user.id)
      ))
      .returning();

    return NextResponse.json(updatedOrder[0], { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}