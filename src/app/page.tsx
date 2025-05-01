import { Page } from "@/components/PageLayout";
import { AuthButton } from "../components/AuthButton";
import {
	BulletListItem,
	CircularIcon,
	Typography,
} from "@worldcoin/mini-apps-ui-kit-react";
import { BulletList } from "@worldcoin/mini-apps-ui-kit-react";
import { CheckCircleSolid, Community, Globe } from "iconoir-react";

export default function Home() {
	return (
		<Page>
			<Page.Main className="flex flex-col items-between justify-center mt-20 mb-8">
				<div className="w-full flex flex-col items-start justify-center">
					<img src="/app-icon.svg" alt="World Governance" className="mb-8" />
					<Typography
						className="text-left mb-8 w-full"
						variant="heading"
						level={1}
					>
						World Governance
					</Typography>
					<BulletList>
						<BulletListItem
							className="items-start"
							bulletPoint={
								<CircularIcon className="size-9 bg-gray-900 p-2">
									<CheckCircleSolid className="text-gray-0" />
								</CircularIcon>
							}
						>
							Vote securely – Only World ID-verified users can participate,
							ensuring fair governance.
						</BulletListItem>

						<BulletListItem
							className="items-start"
							bulletPoint={
								<CircularIcon className="size-9 bg-gray-900 p-2">
									<Community className="text-gray-0" />
								</CircularIcon>
							}
						>
							Shape the future – Influence key proposals and community
							decisions.
						</BulletListItem>

						<BulletListItem
							className="items-start"
							bulletPoint={
								<CircularIcon className="size-9 bg-gray-900 p-2">
									<Globe className="text-gray-0" />
								</CircularIcon>
							}
						>
							All votes are public and recorded, making governance fair and
							accessible to everyone.
						</BulletListItem>
					</BulletList>
				</div>
				<div className="w-full flex flex-col items-center justify-center mt-auto">
					<Typography
						className="flex items-center gap-2 font-medium w-full justify-center mb-8"
						variant="body"
						level={3}
					>
						Powered by <img src="/agora-logo.svg" alt="Agora" />
					</Typography>
					<AuthButton />
				</div>
			</Page.Main>
		</Page>
	);
}
