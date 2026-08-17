import optimizedImageHostsData from '@/data/optimized-image-hosts.json'

export type OptimizedImageHost = {
  hostname: string
  pathPrefix: string
}

// Typed here so a malformed entry in the JSON fails the build rather than
// silently disagreeing with the remotePatterns next.config.js derives from it.
export const optimizedImageHosts: OptimizedImageHost[] = optimizedImageHostsData

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
    const { protocol, hostname, port, pathname } = new URL(src)

    // `port: ''` in remotePatterns matches the protocol default only, and URL
    // leaves `port` empty for it, so anything else here would be rejected.
    return optimizedImageHosts.some(
      (host) =>
        protocol === 'https:' &&
        port === '' &&
        hostname.toLowerCase() === host.hostname &&
        pathname.startsWith(host.pathPrefix),
    )
  } catch {
    return false
  }
}
