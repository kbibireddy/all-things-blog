import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { readFile } from 'fs/promises'
import { join } from 'path'

async function getArticleContent() {
  const filePath = join(process.cwd(), 'content', 'sample-article.md')
  try {
    const fileContents = await readFile(filePath, 'utf8')
    return fileContents
  } catch (error) {
    return 'Article not found.'
  }
}

export default async function Home() {
  const articleContent = await getArticleContent()

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-link">Home</a>
        <a href="/random" className="nav-link">Random</a>
      </nav>
      
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
