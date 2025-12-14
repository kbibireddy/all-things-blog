import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPageContent, getAllPageSlugs } from '@/lib/pageUtils'
import Menu from '@/app/components/Menu'
import { getPagesStructure, buildMenuStructure } from '@/lib/pageUtils'

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

export default async function Page({ params }: PageProps) {
  const pathSegments = Array.isArray(params.slug) ? params.slug : []
  const pageData = await getPageContent(pathSegments)
  
  // Get menu structure for navigation
  const pagesStructure = await getPagesStructure()
  const menuItems = buildMenuStructure(pagesStructure)

  // Determine current path for active menu highlighting
  const currentPath = pathSegments.length > 0 ? pathSegments : []

  if (!pageData) {
    return (
      <>
        <Menu items={menuItems} currentPath={currentPath} />
        <main className="main">
          <h1 className="site-title">all things blog</h1>
          <article className="article">
            <p>Page not found.</p>
          </article>
        </main>
      </>
    )
  }

  // Handle different file types
  let content: React.ReactNode = null

  if (pageData.fileType === 'html') {
    // Render HTML content directly
    content = (
      <div 
        className="html-content"
        dangerouslySetInnerHTML={{ __html: pageData.content }}
      />
    )
  } else if (pageData.fileType === 'csv') {
    // For CSV files, display as preformatted text
    content = (
      <pre className="csv-content" style={{ 
        whiteSpace: 'pre-wrap', 
        fontFamily: 'monospace',
        fontSize: '11pt',
        lineHeight: '1.6'
      }}>
        {pageData.content}
      </pre>
    )
  } else {
    // Default to markdown rendering
    content = (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {pageData.content}
      </ReactMarkdown>
    )
  }

  return (
    <>
      <Menu items={menuItems} currentPath={currentPath} />
      <main className="main">
        <h1 className="site-title">all things blog</h1>
        <article className="article">
          {content}
        </article>
      </main>
    </>
  )
}
