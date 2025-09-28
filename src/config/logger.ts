import { createLogger, format, transports } from 'winston';

const { combine, timestamp, json, colorize, printf } = format;

const consoleFormat = combine(
  colorize(),
  timestamp(),
  printf(({ level, message, timestamp: ts, ...metadata }) => {
    const meta = Object.keys(metadata).length ? ` ${JSON.stringify(metadata)}` : '';
    return `[${ts}] ${level}: ${message}${meta}`;
  }),
);

export const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(timestamp(), json()),
  transports: [
    new transports.Console({
      format: process.env.NODE_ENV === 'production' ? combine(timestamp(), json()) : consoleFormat,
    }),
  ],
});
