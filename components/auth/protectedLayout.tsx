import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth-utils";

interface ProtectedLayoutProps {
	children: React.ReactNode;
	redirectTo?: string;
}

export default async function ProtectedLayout({
	children,
	redirectTo = "/sign-in",
}: ProtectedLayoutProps) {
	const session = await getSession();

	if (!session?.user) {
		redirect(redirectTo);
	}

	return <>{children}</>;
}
