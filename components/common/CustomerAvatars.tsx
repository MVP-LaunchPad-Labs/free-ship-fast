import Image from 'next/image';
import { Star } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const customers = [
	{
		name: 'Sarah Chen',
		src: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
	},
	{
		name: 'Alex Rodriguez',
		src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
	},
	{
		name: 'Jordan Kim',
		src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
	},
	{
		name: 'Morgan Taylor',
		src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
	},
	{
		name: 'Casey Johnson',
		src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
	},
];

const CustomerAvatars = ({ priority }: { priority?: boolean }) => {
	return (
		<div className='flex flex-col md:flex-row justify-center items-center md:items-start gap-3'>
			{/* AVATARS */}
			<div className='flex -space-x-2'>
				{customers.map((customer, i) => (
					<Avatar
						key={i}
						className='w-12 h-12 border-2 border-background'
					>
						<AvatarImage
							src={customer.src}
							alt={customer.name}
							className='object-cover'
						/>
						<AvatarFallback className='text-sm font-medium'>
							{customer.name
								.split(' ')
								.map((word) => word[0])
								.join('')}
						</AvatarFallback>
					</Avatar>
				))}
			</div>

			{/* RATING */}
			<div className='flex flex-col justify-center items-center md:items-start gap-1'>
				<div className='flex items-center gap-1'>
					{[...Array(5)].map((_, i) => (
						<Star
							key={i}
							className='w-4 h-4 fill-yellow-400 text-yellow-400'
						/>
					))}
				</div>
				<div className='text-muted-foreground text-sm text-center md:text-left'>
					<span className='font-semibold text-foreground'>1000+</span> happy
					customers
				</div>
			</div>
		</div>
	);
};

export default CustomerAvatars;
