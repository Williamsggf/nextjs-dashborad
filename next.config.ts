import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
});

const nextConfig = {
  experimental: {
    ppr: "incremental",
  },
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
