"use server";

import { MiniKit } from "@worldcoin/minikit-js";
import { unstable_cache } from "next/cache";

export const getUserByAddress = unstable_cache(
  async (address: string) => {
    const user = await MiniKit.getUserByAddress(address);
    return user;
  },
  ["user"],
  {
    revalidate: 60 * 60,
  }
);
