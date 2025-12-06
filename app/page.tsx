import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getAllPageSlugs, getPagesStructure, buildMenuStructure, getPageContent } from '@/lib/pageUtils'
import Menu from '@/app/components/Menu'

export default async function Home() {
  // Get all pages and find the first one in 'home' directory
  const slugs = await getAllPageSlugs()
  const homeSlug = slugs.find(slug => slug[0] === 'home')
  
  // Get menu structure
  const pagesStructure = await getPagesStructure()
  const menuItems = buildMenuStructure(pagesStructure)
  
  // Try to load the first home page content, or first available page
  const targetSlug = homeSlug || (slugs.length > 0 ? slugs[0] : null)
  const articleContent = targetSlug ? await getPageContent(targetSlug) : null
  
  return (
    <>
      <Menu items={menuItems} currentPath={targetSlug || []} />
      <main className="main">
        <h1 className="site-title">all things blog</h1>
        <article className="article">
          {articleContent ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {articleContent}
            </ReactMarkdown>
          ) : (
            <p>No pages found. Please add markdown files to the pages directory.</p>
          )}
        </article>
      </main>
    </>
  )
}
