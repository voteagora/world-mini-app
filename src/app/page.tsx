import { Page } from "@/components/PageLayout";
import { AuthButton } from "../components/AuthButton";
import {
  BulletListItem,
  CircularIcon,
  Typography,
} from "@worldcoin/mini-apps-ui-kit-react";
import { BulletList } from "@worldcoin/mini-apps-ui-kit-react";
import { Community, Globe, Shield } from "iconoir-react";
import Image from "next/image";

export default function Home() {
  return (
    <Page>
      <Page.Main className="flex flex-col items-between justify-center mt-20 mb-4">
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
            Verified, secure digital governance
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
              Vote on experimental World community proposals with one-person,
              one-vote.
            </BulletListItem>

            <BulletListItem
              className="items-start"
              bulletPoint={
                <CircularIcon className="size-9 bg-gray-500 p-2">
                  <Community className="text-gray-0" />
                </CircularIcon>
              }
            >
              For World ID-verified users to explore new forms of participation.
            </BulletListItem>

            <BulletListItem
              className="items-start"
              bulletPoint={
                <CircularIcon className="size-9 bg-gray-500 p-2">
                  <Globe className="text-gray-0" />
                </CircularIcon>
              }
            >
              All votes are verified and immutable, showcasing how human-first,
              sybil-resistant voting can work in practice.
            </BulletListItem>
          </BulletList>
        </div>
        <div className="w-full flex flex-col items-center justify-center mt-auto">
          <div className="flex gap-4 items-center justify-center mb-4">
            <img src="/world-logo.svg" alt="World" />
            <div className="h-6 w-px bg-gray-900"></div>
            <img src="/agora-logo.svg" alt="Agora" />
          </div>
          <AuthButton />
        </div>
      </Page.Main>
    </Page>
  );
}
