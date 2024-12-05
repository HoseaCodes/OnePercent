/* eslint-disable no-return-await */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
// middleware/logging.js
import { v4 as uuidv4 } from "uuid";
import Logger from "../lib/logger/winston-config";

// Request context to store request-specific data
const requestContext = new AsyncLocalStorage();

export function initRequestContext(req) {
  const context = {
    requestId: uuidv4(),
    startTime: Date.now(),
    userId: null,
    path: req.url,
    method: req.method,
  };
  return context;
}

export function logError(error) {
  const context = requestContext.getStore();

  Logger.error("Error occurred during request processing", {
    requestId: context?.requestId,
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    },
    request: {
      method: context?.method,
      path: context?.path,
    },
  });
}

export async function logRequest(req, handler) {
  const context = initRequestContext(req);

  return await requestContext.run(context, async () => {
    try {
      // Log request details
      Logger.info(`Incoming ${req.method} request to ${req.url}`, {
        requestId: context.requestId,
        method: req.method,
        url: req.url,
        headers: Object.fromEntries(req.headers),
        query: Object.fromEntries(new URL(req.url).searchParams),
      });

      // Start performance monitoring
      const startTime = process.hrtime();

      // Process the request
      const response = await handler(req);

      // Calculate request duration
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const duration = seconds * 1000 + nanoseconds / 1000000;

      // Log response details
      Logger.info(`Request completed in ${duration.toFixed(2)}ms`, {
        requestId: context.requestId,
        status: response.status,
        duration: duration.toFixed(2),
      });

      return response;
    } catch (error) {
      logError(error);
      throw error;
    }
  });
}

// Performance monitoring middleware
export function logPerformance(label) {
  const context = requestContext.getStore();
  const startTime = process.hrtime();

  return {
    end: () => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const duration = seconds * 1000 + nanoseconds / 1000000;

      Logger.debug(`Performance: ${label}`, {
        requestId: context?.requestId,
        label,
        duration: duration.toFixed(2),
      });
    },
  };
}

// Database query logging
export function logQuery(query, duration) {
  const context = requestContext.getStore();

  Logger.debug("Database query executed", {
    requestId: context?.requestId,
    query: {
      operation: query.op,
      collection: query.collection,
      filter: query.filter,
      duration,
    },
  });
}

// Middleware for monitoring MongoDB performance
export const mongooseLogger = {
  logQuery: (query) => {
    const startTime = process.hrtime();

    return {
      end: () => {
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const duration = seconds * 1000 + nanoseconds / 1000000;

        logQuery(query, duration);
      },
    };
  },
};
