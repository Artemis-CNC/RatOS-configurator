import { PlayIcon, ForwardIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { classNames } from '../helpers/classNames';
import { Button } from './button';
import { Spinner } from './spinner';

export interface StepNavButton {
	label?: string;
	onClick?: () => void;
	disabled?: boolean;
	isLoading?: boolean;
}

interface StepNavButtonsProps {
	right: StepNavButton;
	left: StepNavButton;
	skip?: Omit<StepNavButton, 'isLoading'>;
}

export const StepNavButtons: React.FC<StepNavButtonsProps> = (props) => {
	const leftIcon = props.left.isLoading ? (
		<Spinner />
	) : (
		<PlayIcon className="mr-3 h-5 w-5 text-black rotate-180" aria-hidden="true" />
	);
	const left = props.left.onClick ? (
		<div className="flex-1 flex justify-start">
			<Button color="gray" disabled={props.left.disabled} onClick={props.left.onClick}>
				{leftIcon}
				{props.left.label ?? 'Back'}
			</Button>
		</div>
	) : null;

	const rightIcon = props.right.isLoading ? (
		<Spinner />
	) : (
		<PlayIcon className="ml-3 h-5 w-5 text-black-400" aria-hidden="true" />
	);

	const right = props.right.onClick ? (
		<div className="flex-1 flex justify-end space-x-4">
			{props.skip && (
				<Button color="gray" onClick={props.skip.onClick} disabled={props.skip.disabled}>
					{props.skip.label ?? 'Skip'}
					<ForwardIcon className="ml-3 h-5 w-5 text-black" aria-hidden="true" />
				</Button>
			)}
			<Button color="brand" disabled={props.right.disabled} onClick={props.right.onClick}>
				{props.right.label ?? 'Next'}
				{rightIcon}
			</Button>
		</div>
	) : null;

	return (
		<div className="px-8 pb-5">
			<nav
				className="bg-white py-3 flex items-center 
		justify-between border-t border-gray-200"
				aria-label="Pagination"
			>
				{left}
				{right}
			</nav>
		</div>
	);
};
