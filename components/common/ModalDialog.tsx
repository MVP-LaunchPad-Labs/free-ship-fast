"use client";

import type * as React from "react";
import { X } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from "@/components/ui/dialog";

interface ModalDialogProps {
	isModalOpen: boolean;
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isStatic?: boolean;
	title?: string;
	children?: React.ReactNode;
}

/**
 * Modal component using shadcn/ui Dialog
 *
 * Features:
 * - Controlled open/close state
 * - Optional static mode (prevents closing on overlay click)
 * - Customizable title
 * - Accessible with proper ARIA attributes
 * - Styled with tailwind variable colors
 */
const ModalDialog = ({
	isModalOpen,
	setIsModalOpen,
	title = "I'm a modal",
	isStatic = false,
	children,
}: ModalDialogProps) => {
	return (
		<Dialog
			open={isModalOpen}
			onOpenChange={isStatic ? undefined : setIsModalOpen}
			data-slot="modal"
		>
			<DialogContent
				className="bg-background border-border shadow-lg max-w-3xl"
				showCloseButton={!isStatic}
				data-slot="modal-content"
			>
				<DialogHeader className="border-b border-border pb-4">
					<DialogTitle className="text-foreground font-semibold">
						{title}
					</DialogTitle>
					{!isStatic && (
						<DialogClose
							className="absolute right-4 top-4 hover:bg-accent hover:text-accent-foreground rounded-sm p-1 transition-colors"
							data-slot="modal-close"
						>
							<X className="size-4" />
							<span className="sr-only">Close</span>
						</DialogClose>
					)}
				</DialogHeader>

				<div className="text-foreground" data-slot="modal-body">
					{children}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ModalDialog;
