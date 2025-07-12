import ProtectedLayout from "@/components/auth/protectedLayout";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ProtectedLayout>
			{children}
		</ProtectedLayout>
	);
}

