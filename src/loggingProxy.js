class LoggingProxy {
  constructor(client) {
    this._client = client;
  }

  async request(req) {
    console.log(`[LoggingProxy] ${req.method || 'GET'} ${req.url}`);

    const response = await this._client.request(req);

    console.log(`[LoggingProxy] response status: ${response.status}`);

    return response;
  }
}

export { LoggingProxy };