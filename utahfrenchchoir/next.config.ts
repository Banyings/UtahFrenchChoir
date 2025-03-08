/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repoName = '/UtahFrenchChoir';

const nextConfig = {
  output: 'export',
  basePath: isGitHubPages ? repoName : '',
  assetPrefix: isGitHubPages ? repoName : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  }
};

module.exports = nextConfig;