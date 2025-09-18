import { adminAuth } from '@/lib/firebase/firebaseAdmin';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const token = (await cookies()).get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);

    return NextResponse.json({
      user: {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name ?? null,
      },
    });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
