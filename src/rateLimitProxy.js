class RateLimitProxy {
  constructor(client, maxRequests = 5, windowMs = 10000) {
    this._client = client;
    this._maxRequests = maxRequests;
    this._windowMs = windowMs;
    this._requests = [];
  }

  _cleanup(now) {
    this._requests = this._requests.filter(
      (time) => now - time < this._windowMs
    );
  }

  async request(req) {
    const now = Date.now();

    this._cleanup(now);

    if (this._requests.length >= this._maxRequests) {
      const oldest = this._requests[0];
      const waitMs = this._windowMs - (now - oldest);
      console.warn(`[RateLimitProxy] limit reached, waiting ${waitMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      this._cleanup(Date.now());
    }

    this._requests.push(Date.now());
    return this._client.request(req);
  }
}

export { RateLimitProxy };