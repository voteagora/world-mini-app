"use client";

import {
	Checkbox,
	RadioGroup,
	RadioGroupItem,
} from "@worldcoin/mini-apps-ui-kit-react";

export const Options = ({
	options,
	maxNumber,
}: {
	options: string[];
	maxNumber: number;
}) => {
	if (maxNumber === 1) {
		return (
			<RadioGroup>
				<div className="flex flex-col gap-2">
					{options.map((option) => (
						<button
							key={option}
							type="button"
							className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4 w-full cursor-pointer text-left"
							onClick={() => {
								const radio = document.getElementById(
									option,
								) as HTMLInputElement;
								if (radio) radio.click();
							}}
						>
							<RadioGroupItem id={option} value={option} />
							<label htmlFor={option}>{option}</label>
						</button>
					))}
				</div>
			</RadioGroup>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			{options.map((option) => (
				<button
					key={option}
					type="button"
					className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4 w-full cursor-pointer text-left"
					onClick={() => {
						const radio = document.getElementById(option) as HTMLInputElement;
						if (radio) radio.click();
					}}
				>
					<Checkbox id={option} value={option} />
					<label htmlFor={option}>{option}</label>
				</button>
			))}
		</div>
	);
};
