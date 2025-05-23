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
import MarkdownPreview from "@uiw/react-markdown-preview";

interface TruncatedTextProps {
  text: string;
  className?: string;
}

export function TruncatedText({ text, className }: TruncatedTextProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className={twMerge("text-gray-500 line-clamp-5", className)}>
        <MarkdownPreview
          source={text}
          style={{
            backgroundColor: "transparent",
            color: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
          }}
          wrapperElement={{
            "data-color-mode": "light",
          }}
        />
      </div>
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
            <div className="text-gray-500">
              <MarkdownPreview
                source={text}
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  fontSize: "inherit",
                  lineHeight: "inherit",
                }}
                wrapperElement={{
                  "data-color-mode": "light",
                }}
              />
            </div>
          </Page.Main>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
