"use client";

import { TabItem, Tabs } from "@worldcoin/mini-apps-ui-kit-react";
import { InfoCircle, Page } from "iconoir-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(
    pathname.startsWith("/about") ? "about" : "proposals"
  );
  return (
    <Tabs className="pt-2" value={value} onValueChange={setValue}>
      <TabItem
        onClick={() => router.push("/proposals")}
        value="proposals"
        icon={<Page />}
        label="Proposals"
      />
      <TabItem
        onClick={() => router.push("/about")}
        value="about"
        icon={<InfoCircle />}
        label="About"
      />
    </Tabs>
  );
};
