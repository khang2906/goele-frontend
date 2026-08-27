import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next's dev server blocks JS/RSC requests whose origin isn't localhost,
  // as a DNS-rebinding guard — which also blocks the phone-over-LAN testing
  // workflow (opening the dev server via the computer's LAN IP) unless that
  // IP is explicitly allowlisted here. Dev-only; irrelevant once deployed.
  allowedDevOrigins: ["192.168.178.126"],
};

export default nextConfig;
