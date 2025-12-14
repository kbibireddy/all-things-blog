import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPageContent, getAllPageSlugs } from '@/lib/pageUtils'
import Menu from '@/app/components/Menu'
import { getPagesStructure, buildMenuStructure } from '@/lib/pageUtils'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    slug?: string[]
  }
}

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()
  return slugs.map((slug) => ({
    slug: slug,
  }))
}

// Ensure only `generateStaticParams()` routes are generated (important for `output: 'export'`).
export const dynamicParams = false

export default async function Page({ params }: PageProps) {
  const pathSegments = Array.isArray(params.slug) ? params.slug : []
  const articleContent = await getPageContent(pathSegments)
  
  if (!articleContent) {
    notFound()
  }

  // Get menu structure for navigation
  const pagesStructure = await getPagesStructure()
  const menuItems = buildMenuStructure(pagesStructure)

  // Determine current path for active menu highlighting
  const currentPath = pathSegments.length > 0 ? pathSegments : []

  return (
    <>
      <Menu items={menuItems} currentPath={currentPath} />
      <main className="main">
        <h1 className="site-title">all things blog</h1>
        <article className="article">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {articleContent}
          </ReactMarkdown>
        </article>
      </main>
    </>
  )
}
