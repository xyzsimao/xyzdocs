import type { NextConfig } from 'next'
import { createMDX } from 'xyzdocs-mdx/next'

/** @type {import('next').NextConfig} */
const config: NextConfig = {
  reactStrictMode: true,
}

const withMDX = createMDX({
  configPath: 'source.config.ts',
})
export default withMDX(config)
