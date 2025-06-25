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
      const contextInfo = {
        url: log.url,
        userAgent: log.userAgent,
        data: log.data,
      };

      switch (log.level) {
        case "error":
          console.error(logMessage, contextInfo);
          break;
        case "warn":
          console.warn(logMessage, contextInfo);
          break;
        case "info":
          console.info(logMessage, contextInfo);
          break;
        default:
          console.log(logMessage, contextInfo);
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
