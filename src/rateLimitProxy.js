class RateLimitProxy {
  constructor(client, maxRequests = 5, windowMs = 10000) {
    this._client = client;
    this._maxRequests = maxRequests;
    this._windowMs = windowMs;
    this._requests = [];
  }

  async request(req) {
    const now = Date.now();

    this._requests = this._requests.filter(
      (time) => now - time < this._windowMs
    );

    if (this._requests.length >= this._maxRequests) {
      throw new Error(
        `[RateLimitProxy] rate limit exceeded: ${this._maxRequests} requests per ${this._windowMs}ms`
      );
    }

    this._requests.push(now);
    return this._client.request(req);
  }
}

export { RateLimitProxy };