import { auth } from "@/auth";
import { Page } from "@/components/PageLayout";
import { ParticipationItem } from "@/components/ParticipationItem";
import { SeeAllDrawer } from "@/components/SeeAllDrawer";
import { TruncatedText } from "@/components/TruncatedText";
import { delegate } from "@/utils/constants";
import { Marble, TopBar, Typography } from "@worldcoin/mini-apps-ui-kit-react";

export default async function Home() {
	const session = await auth();

	return (
		<>
			<Page.Header className="p-0">
				<TopBar title="Profile" />
			</Page.Header>
			<Page.Main className="flex flex-col items-start justify-start gap-4 mb-16">
				<Marble
					src={
						session?.user.profilePictureUrl ??
						"https://mini-apps-ui-kit.vercel.app/assets/marble1-CnGkEX-1.png"
					}
					className="w-24"
				/>
				<Typography
					variant="heading"
					level={3}
					color="default"
					className="text-gray-900 font-semibold mb-4"
				>
					{session?.user.username}
				</Typography>
				<TruncatedText text={delegate.statement} />
				<div className="mt-4 w-full">
					<div className="flex justify-between items-center mb-2">
						<Typography
							variant="subtitle"
							level={3}
							color="default"
							className="text-gray-400"
						>
							Participation
						</Typography>
						{(delegate.participation?.length ?? 0) > 5 && (
							<SeeAllDrawer
								trigger={
									<button type="button">
										<Typography
											variant="subtitle"
											level={3}
											color="default"
											className="text-gray-400"
										>
											See all
										</Typography>
									</button>
								}
								title="Participation"
								items={
									delegate.participation?.map((participation) => (
										<ParticipationItem
											key={participation.proposalId}
											proposalName={participation.proposalName}
											support={participation.support}
											params={participation.params}
											proposalId={participation.proposalId}
										/>
									)) ?? []
								}
								emptyMessage="No participation yet"
							/>
						)}
					</div>
					<div className="flex flex-col gap-4 mt-4">
						{delegate.participation?.length ? (
							delegate.participation
								.slice(0, 5)
								.map((participation) => (
									<ParticipationItem
										key={participation.proposalId}
										proposalName={participation.proposalName}
										support={participation.support}
										params={participation.params}
										proposalId={participation.proposalId}
									/>
								))
						) : (
							<div className="flex items-center justify-center w-full">
								<Typography
									variant="subtitle"
									level={3}
									color="default"
									className="text-red-500"
								>
									No participation yet
								</Typography>
							</div>
						)}
					</div>
				</div>
			</Page.Main>
		</>
	);
}
