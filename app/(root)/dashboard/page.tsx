import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Activity, BarChart3 } from "lucide-react";
import { getUser } from "@/lib/auth-utils";

async function DashboardStats() {
	const user = await getUser();

	const stats = [
		{ title: "Total Users", value: "2,847", icon: User },
		{ title: "Active Sessions", value: "127", icon: Activity },
		{ title: "Revenue", value: "$12,847", icon: BarChart3 },
	];

	return (
		<div className="grid gap-4 md:grid-cols-3">
			{stats.map((stat) => {
				const Icon = stat.icon;
				return (
					<Card key={stat.title}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{stat.title}
							</CardTitle>
							<Icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}

export default async function DashboardPage() {
	const user = await getUser();

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<p className="text-muted-foreground">Welcome back, {user?.name}</p>
			</div>
			<DashboardStats />
		</div>
	);
}
