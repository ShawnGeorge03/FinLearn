import { authMiddleware } from '@clerk/nextjs';

// export default authMiddleware();

export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
