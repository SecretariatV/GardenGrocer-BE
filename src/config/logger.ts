import { createLogger, format, transports } from "winston";
import { ConsoleTransportOptions } from "winston/lib/winston/transports";

const customConsoleTransport: ConsoleTransportOptions = {
  level: "info",
  format: format.combine(
    format.colorize(),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}] : ${message}`;
    })
  ),
};

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message, ...metadata }) => {
      let msg = `${timestamp} [${level}] : ${message}`;
      if (Object.keys(metadata).length) {
        msg += JSON.stringify(metadata);
      }
      return msg;
    })
  ),
  transports: [
    new transports.Console(customConsoleTransport),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
