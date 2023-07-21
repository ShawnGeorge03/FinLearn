import { load } from 'ts-dotenv';

export type AlphaVantageParams = Record<string, string | number>;

/**
 * Makes an API request to AlphaVantage.
 *
 * @param {AlphaVantageParams} params - The parameters to pass to the API.
 * @return {Promise} A Promise that resolves with the API response or rejects with an error.
 */
export const queryAlphaVantage = async (params: AlphaVantageParams) => {
  try {
    // Load and Set API key from environment variable
    const { ALPHAVANTAGE_API_KEY } = load({ ALPHAVANTAGE_API_KEY: String });

    // Serializes the Params Dictionary
    const serializedParams = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    // Sends the Request and returns a Response
    const url = `https://www.alphavantage.co/query?${serializedParams}&apikey=${ALPHAVANTAGE_API_KEY}`;
    const response: Response = await fetch(url);
    return response.ok ? await response.json() : {};
  } catch (error) {
    console.error(error);
    return {
      type: 'InternalServerError',
      message: 'An error occurred while making the API request.',
    };
  }
};
