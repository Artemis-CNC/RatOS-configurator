import { Fragment, useCallback, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { trpc } from '../../helpers/trpc';
import { MutationModal } from './mutation-modal';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

export const ActionsDropdown = () => {
	const [isSymlinkModalOpen, setIsSymlinkModalOpen] = useState(false);
	const [isFlashModalOpen, setIsFlashModalOpen] = useState(false);
	const [flashModalContent, setFlashModalContent] = useState({
		title: '',
		children: null as React.ReactNode,
		dismissText: 'OK',
	});
	const [symlinkModalContent, setSymlinkModalContent] = useState({
		title: '',
		children: null as React.ReactNode,
		dismissText: 'OK',
	});

	const symlinkExtensions = trpc.useMutation('klippy-extensions.symlink');
	const flashFirmware = trpc.useMutation('mcu.flash-all-connected');

	const symlinkModal = isSymlinkModalOpen ? (
		<MutationModal
			{...symlinkModalContent}
			setOpen={setIsSymlinkModalOpen}
			open={isSymlinkModalOpen}
			isFailed={symlinkExtensions.isError}
			isLoading={symlinkExtensions.isLoading}
		/>
	) : null;
	const flashModal = isFlashModalOpen ? (
		<MutationModal
			{...flashModalContent}
			setOpen={setIsFlashModalOpen}
			open={isFlashModalOpen}
			isFailed={flashFirmware.isError}
			isLoading={flashFirmware.isLoading}
		/>
	) : null;

	const onClickFlash = useCallback(() => {
		setFlashModalContent({
			title: 'Flash Firmware',
			children: <p>Please wait while RatOS is flashing your connected boards...</p>,
			dismissText: 'Please wait...',
		});
		setIsFlashModalOpen(true);
		flashFirmware.mutateAsync().then(
			(value) => {
				setFlashModalContent({
					title: 'Flashing Complete',
					children: <p dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br />') }} />,
					dismissText: 'OK',
				});
			},
			(value) => {
				setFlashModalContent({
					title: 'Flashing Failed',
					children:
						typeof value === 'string' || value instanceof String ? (
							<p dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br />') }} />
						) : (
							<p>Something wen't wrong while flashing the connected boards, please try again.</p>
						),
					dismissText: 'OK',
				});
			},
		);
	}, [flashFirmware]);

	const onClickSymlink = useCallback(() => {
		setSymlinkModalContent({
			title: 'Symlink Extensions',
			children: <p>Please wait while RatOS is symlinking klippy extensions...</p>,
			dismissText: 'Please wait...',
		});
		setIsSymlinkModalOpen(true);
		symlinkExtensions.mutateAsync().then(
			(value) => {
				setSymlinkModalContent({
					title: 'Symlink Complete',
					children: <p dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br />') }} />,
					dismissText: 'OK',
				});
			},
			(value) => {
				setSymlinkModalContent({
					title: 'Symlink Failed',
					children:
						typeof value === 'string' || value instanceof String ? (
							<p dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br />') }} />
						) : (
							<p>Something wen't wrong while symlinking the extensions, please try again.</p>
						),
					dismissText: 'OK',
				});
			},
		);
	}, [symlinkExtensions]);

	return (
		<>
			<Menu as="div" className="relative inline-block text-left">
				<div>
					<Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-gray-100">
						Actions
						<ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
					</Menu.Button>
				</div>

				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
						<div className="py-1">
							<Menu.Item>
								{({ active }) => (
									<span
										onClick={onClickSymlink}
										className={classNames(
											active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
											'block px-4 py-2 text-sm cursor-pointer',
										)}
									>
										Symlink klippy extensions
									</span>
								)}
							</Menu.Item>
						</div>
						<div className="py-1">
							<Menu.Item>
								{({ active }) => (
									<span
										onClick={onClickFlash}
										className={classNames(
											active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
											'block px-4 py-2 text-sm cursor-pointer',
										)}
									>
										Flash all connected MCU's
									</span>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
			{symlinkModal}
			{flashModal}
		</>
	);
};
