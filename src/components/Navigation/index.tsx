"use client";

import { TabItem, Tabs } from "@worldcoin/mini-apps-ui-kit-react";
import { Compass, ProfileCircle } from "iconoir-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export const Navigation = () => {
	const router = useRouter();
	const pathname = usePathname();
	const [value, setValue] = useState(
		pathname.startsWith("/delegate") ? "delegate" : "explore",
	);
	return (
		<Tabs value={value} onValueChange={setValue}>
			<TabItem
				onClick={() => router.push("/explore")}
				value="explore"
				icon={<Compass />}
				label="Explore"
			/>
			<TabItem
				onClick={() => router.push("/delegate")}
				value="delegate"
				icon={<ProfileCircle />}
				label="Delegate"
			/>
		</Tabs>
	);
};
