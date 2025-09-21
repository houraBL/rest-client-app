import { adminAuth } from '@/lib/firebase/firebaseAdmin';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const token = (await cookies()).get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = await adminAuth.verifySessionCookie(token);
    return NextResponse.json({
      user: {
        uid: decoded.uid,
        email: decoded.email,
        displayName: decoded.name,
      },
    });
  } catch (err) {
    (await cookies()).set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
