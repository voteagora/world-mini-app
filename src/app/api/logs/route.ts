/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";

interface LogEntry {
  level: "log" | "error" | "warn" | "info";
  message: string;
  data?: any;
  timestamp: string;
  userAgent?: string;
  url?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { logs }: { logs: LogEntry[] } = await request.json();

    for (const log of logs) {
      const logMessage = `[${log.timestamp}] [${log.level.toUpperCase()}] ${
        log.message
      }`;

      switch (log.level) {
        case "error":
          console.error(logMessage);
          if (log.data)
            console.error("Data:", JSON.stringify(log.data, null, 2));
          break;
        case "warn":
          console.warn(logMessage);
          if (log.data)
            console.warn("Data:", JSON.stringify(log.data, null, 2));
          break;
        case "info":
          console.info(logMessage);
          if (log.data)
            console.info("Data:", JSON.stringify(log.data, null, 2));
          break;
        default:
          console.log(logMessage);
          if (log.data) console.log("Data:", JSON.stringify(log.data, null, 2));
      }
    }

    return NextResponse.json({ success: true, processed: logs.length });
  } catch (error) {
    console.error("Error processing logs:", error);
    return NextResponse.json(
      { error: "Failed to process logs" },
      { status: 500 }
    );
  }
}
