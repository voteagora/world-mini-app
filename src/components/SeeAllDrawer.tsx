"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  Typography,
} from "@worldcoin/mini-apps-ui-kit-react";
import { Page } from "./PageLayout";

interface SeeAllDrawerProps {
  trigger: React.ReactNode;
  title: string;
  items: React.ReactNode[];
  emptyMessage?: string;
  emptyComponent?: React.ReactNode;
  isLoading?: boolean;
}

export function SeeAllDrawer({
  trigger,
  title,
  items,
  emptyMessage = "No items to display",
  emptyComponent,
  isLoading,
}: SeeAllDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <Page.Header className="pb-0">
          <DrawerHeader>
            <Typography variant="subtitle" level={1} color="default">
              {title}
            </Typography>
          </DrawerHeader>
        </Page.Header>
        <Page.Main className="flex flex-col justify-between pt-0 mb-4">
          <div className="flex flex-col gap-8">
            {isLoading ? (
              <div className="flex items-center justify-center w-full">
                <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
              </div>
            ) : items.length ? (
              items
            ) : emptyComponent ? (
              emptyComponent
            ) : (
              <div className="flex items-center justify-center w-full">
                <Typography
                  variant="subtitle"
                  level={3}
                  color="default"
                  className="text-gray-500 italic"
                >
                  {emptyMessage}
                </Typography>
              </div>
            )}
          </div>
        </Page.Main>
      </DrawerContent>
    </Drawer>
  );
}
