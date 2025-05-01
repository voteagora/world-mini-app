import { auth } from "@/auth";
import { Page } from "@/components/PageLayout";
import { ProposalList } from "@/components/ProposalList";
import { TopBar, Marble } from "@worldcoin/mini-apps-ui-kit-react";

export default async function Explore() {
	const session = await auth();

	const profilePicture = session?.user.profilePictureUrl;

	return (
		<>
			<Page.Header className="p-0">
				<TopBar
					title="Explore"
					endAdornment={
						<div className="flex items-center">
							<Marble
								className="rounded-full h-10 w-10"
								src={
									profilePicture ??
									"https://mini-apps-ui-kit.vercel.app/assets/marble1-CnGkEX-1.png"
								}
							/>
						</div>
					}
				/>
			</Page.Header>
			<Page.Main className="flex flex-col items-start justify-start gap-4 mb-16 px-4">
				<ProposalList />
			</Page.Main>
		</>
	);
}
