import Image from 'next/image';
import { StaticImageData } from 'next/image';

import config from '@/config';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// The list of your testimonials. It needs 3 items to fill the row.
const testimonials = [
	{
		name: 'Alex Chen',
		text: 'This platform transformed our workflow. The automation features saved us hours every week and improved our team productivity significantly.',
		img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
		title: 'CTO, TechFlow Inc',
		verified: true,
	},
	{
		name: 'Sarah Rodriguez',
		text: 'The analytics dashboard gives us insights we never had before. Making data-driven decisions has never been easier.',
		img: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
		title: 'Product Manager, DataViz',
		verified: true,
	},
	{
		name: 'Michael Kim',
		text: 'Integration was seamless and the support team is outstanding. Our ROI became positive within the first month.',
		img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
		title: 'CEO, StartupLab',
		verified: true,
	},
	{
		name: 'Emily Johnson',
		text: 'The collaboration features helped our remote team stay connected and productive. Game-changer for distributed teams.',
		img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
		title: 'Operations Director, RemoteFirst',
		verified: true,
	},
	{
		name: 'David Martinez',
		text: 'Security and compliance features exceeded our expectations. Perfect for enterprise-level requirements.',
		img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
		title: 'CISO, SecureCorpå',
		verified: true,
	},
	{
		name: 'Lisa Thompson',
		text: 'The automation workflows saved our team 20+ hours per week. The ROI speaks for itself.',
		img: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`,
		title: 'VP Engineering, AutoScale',
		verified: true,
	},
];

// A single testimonial, to be rendered in a list
const Testimonial = ({
	testimonial,
}: {
	testimonial: (typeof testimonials)[0];
}) => {
	return (
		<Card className='relative h-full bg-card/50 border-border backdrop-blur-sm hover:bg-card/70 transition-colors'>
			<CardContent className='p-6 md:p-8 flex flex-col h-full'>
				<blockquote className='relative flex-1'>
					<p className='text-card-foreground leading-relaxed text-sm md:text-base'>
						"{testimonial.text}"
					</p>
				</blockquote>
				<figcaption className='relative flex items-center justify-start gap-3 pt-4 mt-4 border-t border-border/20'>
					<Avatar className='w-10 h-10 shrink-0'>
						<AvatarImage
							src={
								testimonial.img ||
								`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`
							}
							alt={testimonial.name}
							className='object-cover'
						/>
						<AvatarFallback className='font-medium text-muted-foreground'>
							{testimonial.name
								.split(' ')
								.map((n) => n[0])
								.join('')}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className='font-medium text-card-foreground text-sm'>
							{testimonial.name}
						</div>
						<div className='text-xs text-muted-foreground'>
							{testimonial.title}
						</div>
					</div>
				</figcaption>
			</CardContent>
		</Card>
	);
};

const TestimonialGrid = () => {
	return (
		<section
			className='bg-muted/30'
			id='testimonials'
			aria-labelledby='testimonials-heading'
			data-slot='testimonials-section'
		>
			<div className='py-24 px-8 max-w-7xl mx-auto'>
				<div className='flex flex-col text-center w-full mb-20'>
					<h2
						id='testimonials-heading'
						className='font-bold text-3xl lg:text-5xl tracking-tight text-foreground mb-6'
					>
						What our customers say
					</h2>
					<p className='text-lg text-muted-foreground max-w-xl mx-auto'>
						Real feedback from real users who love our platform.
					</p>
				</div>

				<div
					className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
					aria-label='Customer testimonials'
				>
					{testimonials.map((testimonial, i) => (
						<Testimonial
							key={i}
							testimonial={testimonial}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default TestimonialGrid;
