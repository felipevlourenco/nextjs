import { withAuth } from 'next-auth/middleware';
import type { NextRequestWithAuth } from 'next-auth/middleware';

export function proxy(request: NextRequestWithAuth) {
  return withAuth(request);
}

export const config = {
  matcher: ['/chats/:chatid*'],
};
