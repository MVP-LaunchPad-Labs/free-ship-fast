'use client';

import * as React from 'react';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * FAQ item interface for type safety
 */
interface FAQItemProps {
	question: string;
	answer: React.ReactNode;
}

/**
 * FAQ content configuration
 */
const faqList: FAQItemProps[] = [
	{
		question: 'How can I purchase the product?',
		answer: (
			<div className='space-y-2 leading-relaxed text-muted-foreground'>
				You can purchase our product through our subscription plans. Each plan
				has different pricing tiers. We accept major credit cards as payment.
			</div>
		),
	},
	{
		question: 'Can I get a refund?',
		answer: (
			<p className='text-muted-foreground'>
				Yes! You can request a full refund within 7 days of your purchase.
				Simply contact us via email and we'll process your refund.
			</p>
		),
	},
	{
		question: 'I have another question',
		answer: (
			<div className='space-y-2 leading-relaxed text-muted-foreground'>
				Great! Feel free to reach out to us via email and we'll be happy to help
				you with any questions or concerns.
			</div>
		),
	},
];

/**
 * FAQ section component using shadcn/ui Accordion
 *
 * Features:
 * - Accessible accordion with proper ARIA attributes
 * - Smooth expand/collapse animations
 * - Responsive two-column layout
 * - Tailwind variable colors for consistent theming
 */
const FAQ = () => {
	return (
		<section
			className='bg-muted/30'
			id='faq'
			aria-labelledby='faq-heading'
			data-slot='faq-section'
		>
			<div className='py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12'>
				<div className='flex flex-col text-left basis-1/2'>
					<p
						className='inline-block font-semibold text-primary mb-4'
						aria-label='Section category'
					>
						FAQ
					</p>
					<h2
						id='faq-heading'
						className='sm:text-4xl text-3xl font-extrabold text-foreground'
					>
						Frequently asked questions
					</h2>
				</div>

				<div className='basis-1/2'>
					<Accordion
						type='single'
						collapsible
						className='w-full'
						aria-label='Frequently asked questions'
					>
						{faqList.map((item, i) => (
							<AccordionItem
								key={i}
								value={`item-${i}`}
								className='border-b border-border'
							>
								<AccordionTrigger className='text-left font-semibold text-foreground hover:text-primary transition-colors'>
									{item.question}
								</AccordionTrigger>
								<AccordionContent className='pb-4'>
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</section>
	);
};

export default FAQ;
