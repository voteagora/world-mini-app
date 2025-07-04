import { Page } from "@/components/PageLayout";
// import { AuthButton } from "../components/AuthButton";
import {
  BulletListItem,
  CircularIcon,
  Typography,
} from "@worldcoin/mini-apps-ui-kit-react";
import { BulletList } from "@worldcoin/mini-apps-ui-kit-react";
import { Community, Globe, Shield } from "iconoir-react";
import Image from "next/image";
import { WaitlistButton } from "@/components/WaitlistButton";

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-between justify-center mt-20 mb-8">
        <div className="w-full flex flex-col items-start justify-center">
          <Image
            width={88}
            height={88}
            src="/app-icon.png"
            alt="World Vote"
            className="mb-8 rounded-3xl"
          />
          <Typography
            className="text-left mb-8 w-full"
            variant="heading"
            level={1}
          >
            Verified votes. <br /> Securely onchain.
          </Typography>
          <BulletList>
            <BulletListItem
              className="items-start"
              bulletPoint={
                <CircularIcon className="size-9 bg-gray-500 p-2">
                  <Shield className="text-gray-0" />
                </CircularIcon>
              }
            >
              Vote on World Foundation proposals for World ID-verified users
              only.
            </BulletListItem>

            <BulletListItem
              className="items-start"
              bulletPoint={
                <CircularIcon className="size-9 bg-gray-500 p-2">
                  <Community className="text-gray-0" />
                </CircularIcon>
              }
            >
              Shape the future by influencing key proposals and community
              decisions.
            </BulletListItem>

            <BulletListItem
              className="items-start"
              bulletPoint={
                <CircularIcon className="size-9 bg-gray-500 p-2">
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
          <div className="flex gap-4 items-center justify-center mb-8">
            <img src="/world-logo.svg" alt="World" />
            <div className="h-6 w-px bg-gray-900"></div>
            <img src="/agora-logo.svg" alt="Agora" />
          </div>
          <WaitlistButton />
          {/* <AuthButton /> */}
        </div>
      </Page.Main>
    </Page>
  );
}
