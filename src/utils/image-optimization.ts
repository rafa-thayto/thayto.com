import optimizedImageHosts from '@/data/optimized-image-hosts.json'

/**
 * Whether `next/image` can serve this source. Remote images only work when
 * they match `remotePatterns` in next.config.js — which is derived from the
 * same JSON this reads — otherwise next/image throws at runtime. Callers fall
 * back to a plain img tag when this returns false.
 */
export const canOptimizeImage = (src: string): boolean => {
  if (!/^https?:\/\//i.test(src)) {
    return true
  }

  try {
    const { protocol, hostname, pathname } = new URL(src)

    return optimizedImageHosts.some(
      (host) =>
        protocol === 'https:' &&
        hostname.toLowerCase() === host.hostname &&
        pathname.startsWith(host.pathPrefix),
    )
  } catch {
    return false
  }
}
