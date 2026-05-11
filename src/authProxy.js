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

    const response = await this._client.request(modifiedReq);

    if (response.status === 401 && this._strategy.refresh) {
      await this._strategy.refresh();

      const retryHeaders = this._strategy.getHeaders();
      const retryReq = {
        ...req,
        headers: {
          ...req.headers,
          ...retryHeaders,
        },
      };

      return this._client.request(retryReq);
    }

    return response;
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

  async refresh() {
    console.log('[JwtStrategy] refreshing token...');
    this._token = 'new_refreshed_jwt_token';
  }
}

class OAuthStrategy {
  constructor(token) {
    this._token = token;
  }

  getHeaders() {
    return { Authorization: `OAuth ${this._token}` };
  }

  async refresh() {
    console.log('[OAuthStrategy] refreshing OAuth token...');
    this._token = 'new_refreshed_oauth_token';
  }
}

export { AuthProxy, ApiKeyStrategy, JwtStrategy, OAuthStrategy };