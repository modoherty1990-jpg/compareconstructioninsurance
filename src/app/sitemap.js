import { supabase } from './lib/supabase'

export default async function sitemap() {
  const baseUrl = 'https://www.compareconstructioninsurance.com.au'

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/how-matching-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  // Dynamic guide pages
  const { data: guides } = await supabase
    .from('guides')
    .select('slug, created_at')
    .eq('published', true)

  const guidePages = (guides || []).map(guide => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.created_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticPages, ...guidePages]
}