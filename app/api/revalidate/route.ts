import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
  secret: z.string(),
  path: z.string().optional(),
  tag: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const { secret, path, tag } = schema.parse(body);

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    if (path) revalidatePath(path);
    if (tag) revalidateTag(tag);

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
