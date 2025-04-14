import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
  },
  /* config options here */
};

export default nextConfig;
const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
  },
});