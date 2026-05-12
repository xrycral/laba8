import { BaseClient } from './baseClient.js';
import {
  AuthProxy,
  ApiKeyStrategy,
  JwtStrategy,
  OAuthStrategy,
} from './authProxy.js';
import { LoggingProxy } from './loggingProxy.js';
import { RateLimitProxy } from './rateLimitProxy.js';
import { GitHubService } from './githubService.js';

const API_KEY = process.env.API_KEY || 'test_api_key';
const JWT_TOKEN = process.env.JWT_SECRET || 'test_jwt_token';
const OAUTH_TOKEN = process.env.OAUTH_TOKEN || 'test_oauth_token';

async function main() {
  console.log('=== Demo 1: API Key auth ===\n');

  const apiKeyClient = new RateLimitProxy(
    new LoggingProxy(
      new AuthProxy(new BaseClient(), new ApiKeyStrategy(API_KEY))
    )
  );

  const github1 = new GitHubService(apiKeyClient);
  const user = await github1.getUser('torvalds');
  console.log('User:', user.body?.name || user.status);

  console.log('\n=== Demo 2: JWT auth ===\n');

  const jwtClient = new LoggingProxy(
    new AuthProxy(new BaseClient(), new JwtStrategy(JWT_TOKEN))
  );

  const github2 = new GitHubService(jwtClient);
  const repos = await github2.getRepos('torvalds');
  console.log('Repos status:', repos.status);

  console.log('\n=== Demo 3: OAuth auth ===\n');

  const oauthClient = new LoggingProxy(
    new AuthProxy(new BaseClient(), new OAuthStrategy(OAUTH_TOKEN))
  );

  const github3 = new GitHubService(oauthClient);
  const user2 = await github3.getUser('torvalds');
  console.log('User status:', user2.status);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
