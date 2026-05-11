class AuthProxy {
  constructor(client, authStrategy) {
    this._client = client;
    this._strategy = authStrategy;
  }

  async request(req) {
    const authHeaders = this._strategy.getHeaders();

    const modifiedReq = {
      ...req,
      headers: {
        ...req.headers,
        ...authHeaders,
      },
    };

    return this._client.request(modifiedReq);
  }
}

class ApiKeyStrategy {
  constructor(apiKey) {
    this._apiKey = apiKey;
  }

  getHeaders() {
    return { 'X-API-Key': this._apiKey };
  }
}

class JwtStrategy {
  constructor(token) {
    this._token = token;
  }

  getHeaders() {
    return { Authorization: `Bearer ${this._token}` };
  }
}

class OAuthStrategy {
  constructor(token) {
    this._token = token;
  }

  getHeaders() {
    return { Authorization: `OAuth ${this._token}` };
  }
}

export { AuthProxy, ApiKeyStrategy, JwtStrategy, OAuthStrategy };