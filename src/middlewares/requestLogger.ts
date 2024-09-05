import logger from "config/logger";
import expressWinston from "express-winston";

const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  msg: "{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
  meta: true,
  expressFormat: true,
  colorize: false,
});

export default requestLogger;
