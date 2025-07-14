import { JSX } from 'react';
import Image from 'next/image';
import { StaticImageData } from 'next/image';

import config from '@/config';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Use this object to add an icon to the testimonial (optional) like the Product Hunt logo for instance.
// Only change the values if you add more referrings sites (currently Twitter & Product Hunt)
const refTypes: {
	productHunt: {
		id: string;
		ariaLabel: string;
		svg: JSX.Element;
	};
	twitter: {
		id: string;
		ariaLabel: string;
		svg: JSX.Element;
	};
	other: { id: string; ariaLabel?: null; svg?: null };
} = {
	productHunt: {
		id: 'product_hunt',
		ariaLabel: 'See user review on Product Hunt',
		svg: (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 26.245 26.256'
				className='w-[18px] h-[18px]'
			>
				<path
					d='M26.254 13.128c0 7.253-5.875 13.128-13.128 13.128S-.003 20.382-.003 13.128 5.872 0 13.125 0s13.128 5.875 13.128 13.128'
					fill='#da552f'
				/>
				<path
					d='M14.876 13.128h-3.72V9.2h3.72c1.083 0 1.97.886 1.97 1.97s-.886 1.97-1.97 1.97m0-6.564H8.53v13.128h2.626v-3.938h3.72c2.538 0 4.595-2.057 4.595-4.595s-2.057-4.595-4.595-4.595'
					fill='#fff'
				/>
			</svg>
		),
	},
	twitter: {
		id: 'twitter',
		ariaLabel: 'See user post on Twitter',
		svg: (
			<svg
				className='w-5 h-5 fill-[#00aCee]'
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
			>
				<path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
			</svg>
		),
	},
	other: { id: 'other', ariaLabel: null, svg: null },
};

// The list of your testimonials. It needs 9 items to fill the 3x3 grid on big devices. The last one (10th) is featured on big devices (span 2 columns + big font)
const list: {
	username?: string;
	name: string;
	text: string;
	type?: {
		id: string;
		ariaLabel?: string | null;
		svg?: JSX.Element | null;
	};
	link?: string;
	img?: string;
}[] = [
	{
		username: 'sarah_cto',
		name: 'Sarah Chen',
		text: 'This platform revolutionized our development workflow. The automation features are incredible and saved us countless hours. Our team productivity increased by 40%.',
		type: refTypes.twitter,
		link: 'https://twitter.com/sarah_cto',
		img: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
	},
	{
		username: 'marcus_devops',
		name: 'Marcus Rodriguez',
		text: "Best investment we've made for our startup. The scalability and reliability have been outstanding. Highly recommend for any growing tech company.",
		type: refTypes.productHunt,
		link: 'https://www.producthunt.com/posts/example',
		img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
	},
	{
		name: 'Emily Johnson',
		text: 'The analytics dashboard provides insights that completely changed how we make product decisions. Data-driven development has never been easier.',
		type: refTypes.other,
		img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
	},
	{
		username: 'david_startup',
		name: 'David Kim',
		text: 'Seamless integration with our existing tools. The API documentation is excellent and the support team responds within hours.',
		type: refTypes.productHunt,
		link: 'https://www.producthunt.com/posts/example',
		img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
	},
	{
		username: 'alex_engineering',
		name: 'Alex Thompson',
		text: 'The security features give us peace of mind for enterprise clients. SOC2 compliance made our sales cycle much smoother.',
		type: refTypes.twitter,
		link: 'https://twitter.com/alex_engineering',
		img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
	},
	{
		name: 'Maria Garcia',
		text: 'Beautiful UI/UX that our team actually enjoys using. The design system is consistent and the user experience is top-notch.',
		type: refTypes.other,
		img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
	},
	{
		username: 'james_ceo',
		name: 'James Wilson',
		text: 'ROI was positive within the first month. The efficiency gains across our entire organization have been remarkable.',
		type: refTypes.twitter,
		link: 'https://twitter.com/james_ceo',
		img: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
	},
	{
		username: 'lisa_operations',
		name: 'Lisa Park',
		text: 'The collaboration features transformed how our remote team works together. Communication and project management became seamless.',
		type: refTypes.twitter,
		link: 'https://twitter.com/lisa_operations',
		img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
	},
	{
		username: 'ryan_fullstack',
		name: 'Ryan Davis',
		text: 'As a developer, I appreciate the clean APIs and comprehensive documentation. Building integrations has never been this straightforward.',
		type: refTypes.productHunt,
		link: 'https://www.producthunt.com/posts/example',
		img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
	},
	// The last testimonial is featured on big devices (span 2 columns + big font) 👇
	{
		username: 'jordan_tech',
		name: 'Jordan Martinez',
		text: 'This platform transformed our entire business operations. The automation workflows, analytics insights, and seamless integrations have increased our efficiency by 300%. The ROI was immediate and the ongoing support is exceptional. Absolutely essential for any serious SaaS operation.',
		type: refTypes.twitter,
		link: 'https://twitter.com/jordan_tech',
		img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
	},
];

// A single testimonial, to be rendered in a list
const Testimonial = ({ i }: { i: number }) => {
	const testimonial = list[i];

	if (!testimonial) return null;

	const imgSrc =
		typeof testimonial.img === 'string'
			? testimonial.img
			: testimonial.img ||
				`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`;

	return (
		<li key={i}>
			<Card className='relative h-full bg-card/50 border-border backdrop-blur-sm hover:bg-card/70 transition-colors'>
				<CardContent className='p-6'>
					<div className='flex flex-col gap-4 h-full'>
						<blockquote className='text-card-foreground leading-relaxed flex-1'>
							"{testimonial.text}"
						</blockquote>

						<footer className='flex items-center justify-between pt-4 border-t border-border/50'>
							<div className='flex items-center gap-3'>
								<Avatar className='w-10 h-10'>
									<AvatarImage
										src={imgSrc}
										alt={testimonial.name}
									/>
									<AvatarFallback className='text-sm font-medium'>
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
									{testimonial.username && (
										<div className='text-xs text-muted-foreground'>
											@{testimonial.username}
										</div>
									)}
								</div>
							</div>

							{testimonial.type?.svg && (
								<div className='shrink-0'>
									{testimonial.link ? (
										<a
											href={testimonial.link}
											target='_blank'
											rel='noopener noreferrer'
											aria-label={testimonial.type.ariaLabel || undefined}
											className='opacity-60 hover:opacity-100 transition-opacity'
										>
											{testimonial.type.svg}
										</a>
									) : (
										<div className='opacity-60'>{testimonial.type.svg}</div>
									)}
								</div>
							)}
						</footer>
					</div>
				</CardContent>
			</Card>
		</li>
	);
};

const TestimonialWall = () => {
	const featuredTestimonial = list[list.length - 1];

	return (
		<section
			className='bg-muted/30'
			id='testimonials'
			data-slot='testimonials-section'
		>
			<div className='py-24 px-8 max-w-7xl mx-auto'>
				<div className='flex flex-col text-center w-full mb-20'>
					<h2 className='font-bold text-3xl lg:text-5xl tracking-tight text-foreground mb-6'>
						What our customers say
					</h2>
					<p className='text-lg text-muted-foreground max-w-xl mx-auto'>
						Don't take our word for it. Here's what real users say about our
						platform.
					</p>
				</div>

				<ul
					role='list'
					className='grid max-w-2xl grid-cols-1 gap-6 mx-auto sm:gap-8 md:grid-cols-2 lg:max-w-none lg:grid-cols-4'
				>
					<li className='md:hidden lg:block lg:col-span-2 lg:row-span-2'>
						<Card className='relative h-full bg-card/50 border-border backdrop-blur-sm'>
							<CardContent className='p-8'>
								<div className='flex flex-col gap-6 h-full'>
									<Badge
										variant='secondary'
										className='w-fit'
									>
										Featured Review
									</Badge>

									<blockquote className='text-xl font-medium leading-8 text-card-foreground flex-1'>
										"{featuredTestimonial?.text}"
									</blockquote>

									<footer className='flex items-center gap-4 pt-6 border-t border-border/50'>
										<Avatar className='w-12 h-12'>
											<AvatarImage
												src={
													featuredTestimonial?.img ||
													'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
												}
												alt={featuredTestimonial?.name}
											/>
											<AvatarFallback className='font-semibold'>
												{featuredTestimonial?.name
													.split(' ')
													.map((n) => n[0])
													.join('')}
											</AvatarFallback>
										</Avatar>

										<div className='flex-1'>
											<div className='font-semibold text-card-foreground'>
												{featuredTestimonial?.name}
											</div>
											{featuredTestimonial?.username && (
												<div className='text-sm text-muted-foreground'>
													@{featuredTestimonial.username}
												</div>
											)}
										</div>

										{featuredTestimonial?.type?.svg && (
											<div className='shrink-0 opacity-60'>
												{featuredTestimonial.type.svg}
											</div>
										)}
									</footer>
								</div>
							</CardContent>
						</Card>
					</li>

					{list.slice(0, list.length - 1).map((testimonial, i) => (
						<Testimonial
							key={i}
							i={i}
						/>
					))}
				</ul>
			</div>
		</section>
	);
};

export default TestimonialWall;
