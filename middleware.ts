import { type NextRequest } from 'next/server';

// Better Auth handles session management automatically
// No custom middleware needed for basic auth functionality
export async function middleware(request: NextRequest) {
	// If you need custom middleware logic, add it here
	// For now, just pass through all requests
	return;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
		 * Feel free to modify this pattern to include more paths.
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
};
