import pino from "pino";
import config from "@/config";
import { version } from "os";

const isDev = config.app.env === "development";


export const logger = pino({
    enabled: config.app.logs,

    level: isDev ? "debug" : "info",

    base:{
        app: config.app.name,
        version:config.app.version,
    },

    timestamp: pino.stdTimeFunctions.isoTime,

    transport: isDev
    ? {
        target: "pino-pretty",

        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
    
});
