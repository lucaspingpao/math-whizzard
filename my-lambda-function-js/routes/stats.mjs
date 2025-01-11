import { queryDB } from '../db.mjs';

export const getStats = async (event) => {
    const query = "SELECT * FROM stats ORDER BY score DESC LIMIT 10";
    try {
        const stats = await queryDB(query);
        return {
            statusCode: 200,
            body: JSON.stringify(stats),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};
