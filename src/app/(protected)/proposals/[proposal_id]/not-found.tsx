import { Page } from "@/components/PageLayout";
import { Typography, TopBar, Button } from "@worldcoin/mini-apps-ui-kit-react";
import { ArrowLeft, InfoCircle } from "iconoir-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Page.Header className="p-0">
        <TopBar
          startAdornment={
            <Link href="/proposals">
              <div className="flex items-center justify-center rounded-full p-2 bg-gray-200 w-10 h-10">
                <ArrowLeft className="text-gray-900" />
              </div>
            </Link>
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-center gap-6 px-4 h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
            <InfoCircle className="w-8 h-8 text-gray-500" />
          </div>
          <Typography
            variant="heading"
            level={2}
            color="default"
            className="text-center"
          >
            Page Not Found
          </Typography>
          <Typography
            variant="body"
            level={2}
            color="default"
            className="text-gray-500 text-center"
          >
            The page you're looking for doesn't exist or has been removed.
          </Typography>
        </div>
        <Button variant="primary" size="lg" asChild>
          <Link href="/proposals">Back to Proposals</Link>
        </Button>
      </Page.Main>
    </>
  );
}
