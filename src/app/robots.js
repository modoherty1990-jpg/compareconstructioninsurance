export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://www.compareconstructioninsurance.com.au/sitemap.xml',
  }
}