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
}

export function SeeAllDrawer({
  trigger,
  title,
  items,
  emptyMessage = "No items to display",
  emptyComponent,
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
            {items.length ? (
              items
            ) : emptyComponent ? (
              emptyComponent
            ) : (
              <div className="flex items-center justify-center w-full">
                <Typography
                  variant="subtitle"
                  level={3}
                  color="default"
                  className="text-red-500"
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
