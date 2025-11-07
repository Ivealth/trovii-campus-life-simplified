import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { restaurants } from '@/db/schema';
import { eq, like, or, desc, asc, count, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract query parameters
    const cuisine = searchParams.get('cuisine');
    const isOpenParam = searchParams.get('isOpen');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') ?? 'rating';
    const limitParam = searchParams.get('limit') ?? '12';
    const offsetParam = searchParams.get('offset') ?? '0';

    // Validate isOpen parameter
    if (isOpenParam && isOpenParam !== 'true' && isOpenParam !== 'false') {
      return NextResponse.json({
        error: 'isOpen must be "true" or "false"',
        code: 'INVALID_IS_OPEN_PARAMETER'
      }, { status: 400 });
    }

    // Validate sort parameter
    const validSorts = ['rating', 'deliveryFee', 'deliveryTime', 'newest'];
    if (!validSorts.includes(sort)) {
      return NextResponse.json({
        error: `Sort must be one of: ${validSorts.join(', ')}`,
        code: 'INVALID_SORT_PARAMETER'
      }, { status: 400 });
    }

    // Parse and validate limit
    const limit = parseInt(limitParam);
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json({
        error: 'Limit must be a positive integer',
        code: 'INVALID_LIMIT'
      }, { status: 400 });
    }
    const finalLimit = Math.min(limit, 50);

    // Parse and validate offset
    const offset = parseInt(offsetParam);
    if (isNaN(offset) || offset < 0) {
      return NextResponse.json({
        error: 'Offset must be a non-negative integer',
        code: 'INVALID_OFFSET'
      }, { status: 400 });
    }

    // Build WHERE conditions
    const conditions = [];

    if (cuisine) {
      conditions.push(eq(restaurants.cuisine, cuisine));
    }

    if (isOpenParam) {
      const isOpenValue = isOpenParam === 'true' ? 1 : 0;
      conditions.push(eq(restaurants.isOpen, isOpenValue));
    }

    if (search) {
      conditions.push(
        or(
          like(restaurants.name, `%${search}%`),
          like(restaurants.description, `%${search}%`),
          like(restaurants.cuisine, `%${search}%`),
          like(restaurants.location, `%${search}%`)
        )
      );
    }

    // Build base query
    let query = db.select().from(restaurants);

    // Apply WHERE conditions
    if (conditions.length > 0) {
      query = query.where(
        conditions.length === 1 ? conditions[0] : sql`${conditions.join(' AND ')}`
      );
    }

    // Apply sorting
    switch (sort) {
      case 'rating':
        query = query.orderBy(desc(restaurants.rating));
        break;
      case 'deliveryFee':
        query = query.orderBy(asc(restaurants.deliveryFee));
        break;
      case 'deliveryTime':
        // Extract numeric value from delivery time string for sorting
        query = query.orderBy(
          sql`CAST(SUBSTR(${restaurants.deliveryTime}, 1, INSTR(${restaurants.deliveryTime} || '-', '-') - 1) AS INTEGER)`
        );
        break;
      case 'newest':
        query = query.orderBy(desc(restaurants.createdAt));
        break;
    }

    // Apply pagination
    query = query.limit(finalLimit).offset(offset);

    // Execute query
    const results = await query;

    // Get total count with same filters
    let countQuery = db.select({ count: count() }).from(restaurants);
    
    if (conditions.length > 0) {
      countQuery = countQuery.where(
        conditions.length === 1 ? conditions[0] : sql`${conditions.join(' AND ')}`
      );
    }

    const totalResult = await countQuery;
    const total = totalResult[0]?.count ?? 0;

    // Return response
    return NextResponse.json({
      restaurants: results,
      total,
      limit: finalLimit,
      offset
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}