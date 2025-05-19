"use client";

import {
  Typography,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
} from "@worldcoin/mini-apps-ui-kit-react";
import { twMerge } from "tailwind-merge";
import { Page } from "@/components/PageLayout";

interface TruncatedTextProps {
  text: string;
  className?: string;
}

export function TruncatedText({ text, className }: TruncatedTextProps) {
  return (
    <div className="flex flex-col gap-2">
      <Typography
        variant="body"
        level={2}
        color="default"
        className={twMerge("text-gray-500 line-clamp-5", className)}
      >
        {text}
      </Typography>
      <Drawer>
        <DrawerTrigger asChild>
          <button type="button" className="flex">
            <Typography
              variant="subtitle"
              level={3}
              color="default"
              className="text-gray-900 font-medium"
            >
              Read more
            </Typography>
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <Page.Header className="pb-0">
            <DrawerHeader />
          </Page.Header>
          <Page.Main className="flex flex-col gap-4 pt-0">
            <Typography
              variant="body"
              level={2}
              color="default"
              className="text-gray-500 whitespace-pre-wrap"
            >
              {text}
            </Typography>
          </Page.Main>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
