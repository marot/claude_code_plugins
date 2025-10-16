import { loadConfig } from '../lib/config.js';
/**
 * Query Maestro documentation or get cheat sheet
 * - With query: POST to /v2/bot/query-docs
 * - Without query: GET /v2/bot/maestro-cheat-sheet
 */
export async function queryDocs(query) {
    const config = loadConfig();
    if (!config.apiKey) {
        throw new Error('API key required. Set MAESTRO_API_KEY or add to ~/.mobiledev/authtoken');
    }
    const baseUrl = 'https://api.copilot.mobile.dev';
    const url = query
        ? `${baseUrl}/v2/bot/query-docs`
        : `${baseUrl}/v2/bot/maestro-cheat-sheet`;
    const response = await fetch(url, {
        method: query ? 'POST' : 'GET',
        headers: {
            Authorization: `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
        },
        body: query ? JSON.stringify({ question: query }) : undefined,
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.text();
    console.log(data);
}
//# sourceMappingURL=query-docs.js.map