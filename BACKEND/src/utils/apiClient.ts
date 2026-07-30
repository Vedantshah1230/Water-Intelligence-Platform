import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class ResilientApiClient {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Fetches data with in-memory TTL caching, automatic retries with exponential backoff,
   * and optional fallback options.
   */
  public async fetchWithResilience<T>(
    url: string,
    options: {
      axiosConfig?: AxiosRequestConfig;
      ttlMs?: number; // Cache duration in ms (default: 15 mins)
      retries?: number; // Number of retry attempts (default: 2)
      retryDelayMs?: number; // Initial retry delay (default: 500ms)
      fallbackData?: T; // Default data if all network requests fail
    } = {}
  ): Promise<T> {
    const {
      axiosConfig = {},
      ttlMs = 15 * 60 * 1000,
      retries = 2,
      retryDelayMs = 500,
      fallbackData
    } = options;

    const cacheKey = `${url}_${JSON.stringify(axiosConfig.params || {})}`;

    // 1. Return cached response if valid
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }

    // 2. Attempt HTTP request with retry logic
    let attempt = 0;
    while (attempt <= retries) {
      try {
        const response: AxiosResponse<T> = await axios.get(url, {
          timeout: 8000, // 8 second timeout per request
          headers: {
            'User-Agent': 'AquaSenseAI-WaterIntelligencePlatform/1.0',
            ...axiosConfig.headers
          },
          ...axiosConfig
        });

        const data = response.data;

        // Store in cache if TTL is greater than 0
        if (ttlMs > 0) {
          this.cache.set(cacheKey, {
            data,
            expiry: Date.now() + ttlMs
          });
        }

        return data;
      } catch (error: any) {
        attempt++;
        const status = error.response?.status;
        console.warn(
          `[ResilientApiClient] Request failed for ${url} (Attempt ${attempt}/${retries + 1}):`,
          error.message || status
        );

        if (attempt > retries) {
          break;
        }

        // Exponential backoff delay
        const delay = retryDelayMs * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // 3. Fallback logic if all retries failed
    if (fallbackData !== undefined) {
      console.info(`[ResilientApiClient] Returning fallback data for ${url}`);
      return fallbackData;
    }

    throw new Error(`[ResilientApiClient] Failed to fetch data from ${url} after ${retries + 1} attempts.`);
  }

  /**
   * Attempts sequential provider calls until one succeeds.
   */
  public async executePipeline<T>(
    providers: Array<() => Promise<T>>,
    fallback: T
  ): Promise<T> {
    for (const provider of providers) {
      try {
        return await provider();
      } catch (err: any) {
        console.warn('[ResilientApiClient] Provider pipeline step failed:', err.message);
      }
    }
    return fallback;
  }
}

export const apiClient = new ResilientApiClient();
