'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	Settings,
	BarChart3,
	Home,
	Users,
	FileText,
	Activity,
	ChevronRight,
	Command,
} from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarTrigger,
	SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

/**
 * Navigation menu items configuration
 */
const navigationItems = [
	{
		title: 'Overview',
		items: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: Home,
			},
			{
				title: 'Analytics',
				url: '/analytics',
				icon: BarChart3,
			},
		],
	},
	{
		title: 'Management',
		items: [
			{
				title: 'Users',
				url: '/users',
				icon: Users,
			},
			{
				title: 'Reports',
				url: '/reports',
				icon: FileText,
				items: [
					{
						title: 'User Reports',
						url: '/reports/users',
					},
					{
						title: 'Activity Reports',
						url: '/reports/activity',
					},
					{
						title: 'Performance Reports',
						url: '/reports/performance',
					},
				],
			},
			{
				title: 'Activity',
				url: '/activity',
				icon: Activity,
			},
		],
	},
	{
		title: 'System',
		items: [
			{
				title: 'Settings',
				url: '/settings',
				icon: Settings,
				items: [
					{
						title: 'General',
						url: '/settings/general',
					},
					{
						title: 'Security',
						url: '/settings/security',
					},
					{
						title: 'Integrations',
						url: '/settings/integrations',
					},
				],
			},
		],
	},
];

/**
 * Modern sidebar navigation component using shadcn/ui
 *
 * Features:
 * - Collapsible design with proper state management
 * - Multi-level navigation with sub-menus
 * - Active state highlighting based on current route
 * - Responsive design with mobile support
 * - Uses proper shadcn sidebar components
 * - Keyboard navigation support
 */
function AppSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar
			variant='inset'
			data-slot='app-sidebar'
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size='lg'
							asChild
						>
							<Link href='/dashboard'>
								<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
									<Command className='size-4' />
								</div>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-semibold'>Dashboard</span>
									<span className='truncate text-xs'>Enterprise</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				{navigationItems.map((group) => (
					<SidebarGroup key={group.title}>
						<SidebarGroupLabel>{group.title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={pathname === item.url}
										>
											<Link href={item.url}>
												<item.icon className='size-4' />
												<span>{item.title}</span>
												{item.items && (
													<ChevronRight className='ml-auto size-4' />
												)}
											</Link>
										</SidebarMenuButton>
										{item.items && (
											<SidebarMenuSub>
												{item.items.map((subItem) => (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton
															asChild
															isActive={pathname === subItem.url}
														>
															<Link href={subItem.url}>
																<span>{subItem.title}</span>
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										)}
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size='lg'
							asChild
						>
							<Link href='/profile'>
								<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground'>
									<Users className='size-4' />
								</div>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-semibold'>Your Account</span>
									<span className='truncate text-xs'>Profile & Settings</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}

/**
 * Sidebar layout wrapper component
 *
 * Features:
 * - Provides sidebar context for the entire app section
 * - Includes trigger button for mobile/collapsed state
 * - Responsive layout with proper content area
 */
function SidebarLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
					<SidebarTrigger className='-ml-1' />
					<Separator
						orientation='vertical'
						className='mr-2 h-4'
					/>
					<h1 className='text-lg font-semibold'>Dashboard</h1>
				</header>
				<div className='flex flex-1 flex-col gap-4 p-4'>{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

export default SidebarLayout;
export { AppSidebar };
