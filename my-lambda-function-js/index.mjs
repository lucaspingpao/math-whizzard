import { getStats } from './routes/stats.mjs';

// Main Lambda handler
export const handler = async (event) => {
    const { path, httpMethod } = event;

    // stats routes
    if (path.startsWith("/stats")) {
        if (httpMethod === "GET") {
            return await getStats(event);
        } else {
            return { statusCode: 405, body: "Method Not Allowed" };
        }
    }

    // If no matching route found
    return {
        statusCode: 404,
        body: JSON.stringify({ message: "Route not found" }),
    };
};