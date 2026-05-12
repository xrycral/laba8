class GitHubService {
  constructor(client) {
    this._client = client;
  }

  async getUser(username) {
    return this._client.request({
      url: `https://api.github.com/users/${username}`,
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });
  }

  async getRepos(username) {
    return this._client.request({
      url: `https://api.github.com/users/${username}/repos`,
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });
  }
}

export { GitHubService };