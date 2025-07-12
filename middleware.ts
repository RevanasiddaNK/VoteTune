import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  // Custom middleware logic (optional)
  function onMiddleware(req) {
    return NextResponse.next(); // Continue to the requested page
  },
  {
    // Specify the login page for unauthenticated users
    pages: {
      signIn: '/signIn',
    },
  }
);

// Configure which routes to protect
export const config = {
    matcher: ['/dashboard', '/dashboard/:path*', '/'], 
};
