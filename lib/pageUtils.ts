import { readdir, stat, readFile } from 'fs/promises'
import { join } from 'path'
// @ts-ignore - notebookjs doesn't have TypeScript types
const nb = require('notebookjs')

export interface PageItem {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: PageItem[]
  fullPath?: string
}

export interface MenuItem {
  label: string
  path: string
  fullPath: string[] // Full path array for routing (e.g., ['home', 'article'])
  children?: MenuItem[]
  isFolder: boolean
}

/**
 * Recursively reads directory structure and returns page items
 */
export async function getPagesStructure(baseDir: string = 'pages'): Promise<PageItem[]> {
  const pagesPath = join(process.cwd(), baseDir)
  const items: PageItem[] = []

  try {
    const entries = await readdir(pagesPath)
    
    for (const entry of entries) {
      const fullPath = join(pagesPath, entry)
      const stats = await stat(fullPath)
      
      if (stats.isDirectory()) {
        const children = await getPagesStructure(join(baseDir, entry))
        items.push({
          name: entry,
          path: entry,
          type: 'folder',
          children: children.length > 0 ? children : undefined,
          fullPath: fullPath
        })
      } else if (entry.endsWith('.md') || entry.endsWith('.ipynb')) {
        // Remove extension to get the base name (exclude .csv files from menu)
        const baseName = entry.replace(/\.(md|ipynb)$/, '')
        items.push({
          name: baseName,
          path: baseName,
          type: 'file',
          fullPath: fullPath
        })
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${baseDir}:`, error)
  }

  return items.sort((a, b) => {
    // Folders first, then files
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1
    }
    return a.name.localeCompare(b.name)
  })
}

/**
 * Builds menu structure from pages structure
 */
export function buildMenuStructure(pages: PageItem[], parentPath: string[] = []): MenuItem[] {
  return pages.map(page => {
    const fullPath = [...parentPath, page.path]
    const menuItem: MenuItem = {
      label: page.name,
      path: page.path,
      fullPath: fullPath,
      isFolder: page.type === 'folder'
    }

    if (page.children && page.children.length > 0) {
      menuItem.children = buildMenuStructure(page.children, fullPath)
    }

    return menuItem
  })
}

/**
 * Gets the full path for a page given a path array (e.g., ['home', 'article'])
 * Note: This defaults to .md extension. Use getPageContent() which tries all extensions.
 */
export function getPagePath(segments: string[]): string {
  return join(process.cwd(), 'pages', ...segments) + '.md'
}

export interface PageContent {
  content: string
  fileType: 'md' | 'ipynb' | 'csv'
}

/**
 * Reads file content by path segments (supports .md, .ipynb, .csv)
 * Returns content and file type
 */
export async function getPageContent(pathSegments: string[]): Promise<PageContent | null> {
  const basePath = join(process.cwd(), 'pages', ...pathSegments)
  const extensions: Array<{ ext: string; type: 'md' | 'ipynb' | 'csv' }> = [
    { ext: '.md', type: 'md' },
    { ext: '.ipynb', type: 'ipynb' },
    { ext: '.csv', type: 'csv' }
  ]
  
  for (const { ext, type } of extensions) {
    try {
      const filePath = basePath + ext
      const content = await readFile(filePath, 'utf8')
      return { content, fileType: type }
    } catch (error) {
      // Try next extension
      continue
    }
  }
  
  console.error(`Error reading page content for path: ${pathSegments.join('/')}`)
  return null
}

/**
 * Finds a page item by path segments
 */
export function findPageByPath(pages: PageItem[], segments: string[]): PageItem | null {
  if (segments.length === 0) return null
  
  const [first, ...rest] = segments
  const found = pages.find(p => p.name === first)
  
  if (!found) return null
  
  if (rest.length === 0) {
    return found
  }
  
  if (found.children) {
    return findPageByPath(found.children, rest)
  }
  
  return null
}

/**
 * Gets all markdown files recursively from a path
 */
export async function getAllMarkdownFiles(basePath: string): Promise<string[]> {
  const files: string[] = []
  
  async function traverse(dir: string) {
    try {
      const entries = await readdir(dir)
      
      for (const entry of entries) {
        const fullPath = join(dir, entry)
        const stats = await stat(fullPath)
        
        if (stats.isDirectory()) {
          await traverse(fullPath)
        } else if (entry.endsWith('.md') || entry.endsWith('.ipynb')) {
          // Get relative path from pages directory (exclude .csv files)
          const relativePath = fullPath.replace(join(process.cwd(), 'pages') + '/', '')
          // Remove extension
          files.push(relativePath.replace(/\.(md|ipynb)$/, ''))
        }
      }
    } catch (error) {
      console.error(`Error traversing directory ${dir}:`, error)
    }
  }
  
  await traverse(basePath)
  return files
}

/**
 * Gets all markdown file paths for static generation
 * Returns array of slug arrays (e.g., [['home', 'article'], ['random', 'article1']])
 */
export async function getAllPageSlugs(): Promise<string[][]> {
  const pagesPath = join(process.cwd(), 'pages')
  const slugs: string[][] = []
  
  async function traverse(dir: string, currentPath: string[] = []) {
    try {
      const entries = await readdir(dir)
      
      for (const entry of entries) {
        const fullPath = join(dir, entry)
        const stats = await stat(fullPath)
        
        if (stats.isDirectory()) {
          await traverse(fullPath, [...currentPath, entry])
        } else if (entry.endsWith('.md') || entry.endsWith('.ipynb')) {
          // Exclude .csv files from static generation
          const slug = entry.replace(/\.(md|ipynb)$/, '')
          slugs.push([...currentPath, slug])
        }
      }
    } catch (error) {
      console.error(`Error traversing directory ${dir}:`, error)
    }
  }
  
  await traverse(pagesPath)
  return slugs
}

/**
 * Renders a Jupyter notebook JSON to HTML string
 */
export function renderNotebook(notebookJson: any): string {
  try {
    const notebook = nb.parse(notebookJson)
    const renderedElement = notebook.render()
    return renderedElement.outerHTML
  } catch (error) {
    console.error('Error rendering notebook:', error)
    throw error
  }
}
