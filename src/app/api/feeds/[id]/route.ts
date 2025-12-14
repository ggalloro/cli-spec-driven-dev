import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// DELETE /api/feeds/[id] - Delete a feed
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const feedId = parseInt(id);

    if (isNaN(feedId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.feed.delete({
      where: { id: feedId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting feed:", error);
    return NextResponse.json({ error: 'Failed to delete feed' }, { status: 500 });
  }
}
