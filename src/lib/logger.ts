/* eslint-disable @typescript-eslint/no-explicit-any */

type LogLevel = "log" | "error" | "warn" | "info";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  userAgent?: string;
  url?: string;
}

class ServerLogger {
  private queue: LogEntry[] = [];
  private isProcessing = false;
  private readonly maxQueueSize = 50;
  private readonly flushInterval = 5000; // 5 seconds

  constructor() {
    if (typeof window !== "undefined") {
      setInterval(() => this.flush(), this.flushInterval);
      window.addEventListener("beforeunload", () => this.flush());
    }
  }

  private async sendToServer(logs: LogEntry[]) {
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ logs }, (key, value) =>
          typeof value === "bigint" ? value.toString() + "n" : value
        ),
      });
    } catch (error) {
      console.error("Failed to send logs to server:", error);
    }
  }

  private async flush() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const logsToSend = [...this.queue];
    this.queue = [];

    await this.sendToServer(logsToSend);
    this.isProcessing = false;
  }

  private serializeData(data: any): any {
    if (data === null || data === undefined) return data;

    try {
      // Use JSON stringify/parse to deep clone and handle BigInt
      return JSON.parse(
        JSON.stringify(data, (key, value) => {
          if (typeof value === "bigint") {
            return value.toString() + "n";
          }
          if (typeof value === "function") {
            return "[Function]";
          }
          if (value instanceof Error) {
            return {
              name: value.name,
              message: value.message,
              stack: value.stack,
            };
          }
          return value;
        })
      );
    } catch (error) {
      console.error("Failed to serialize data:", error);
      return `[Unserializable: ${String(data)}]`;
    }
  }

  private addToQueue(level: LogLevel, message: string, data?: any) {
    const logEntry: LogEntry = {
      level,
      message,
      data: data ? this.serializeData(data) : undefined,
      timestamp: new Date().toISOString(),
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };

    this.queue.push(logEntry);

    if (this.queue.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  log(message: string, ...data: any[]) {
    console.log(message, ...data);
    this.addToQueue("log", message, data.length > 0 ? data : undefined);
  }

  error(message: string, ...data: any[]) {
    console.error(message, ...data);
    this.addToQueue("error", message, data.length > 0 ? data : undefined);
  }

  warn(message: string, ...data: any[]) {
    console.warn(message, ...data);
    this.addToQueue("warn", message, data.length > 0 ? data : undefined);
  }

  info(message: string, ...data: any[]) {
    console.info(message, ...data);
    this.addToQueue("info", message, data.length > 0 ? data : undefined);
  }
}

export const logger = new ServerLogger();
