import { Page } from "@/components/PageLayout";
import { LoadingSpinner } from "@/components/Spinner";
import { TopBar } from "@worldcoin/mini-apps-ui-kit-react";

export default function Loading() {
  return (
    <>
      <Page.Header className="p-0">
        <TopBar title=" " />
      </Page.Header>
      <Page.Main className="flex items-center justify-center">
        <LoadingSpinner />
      </Page.Main>
    </>
  );
}
