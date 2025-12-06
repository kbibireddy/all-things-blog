import { readdir, stat, readFile } from 'fs/promises'
import { join } from 'path'

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
      } else if (entry.endsWith('.md')) {
        items.push({
          name: entry.replace('.md', ''),
          path: entry.replace('.md', ''),
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
 */
export function getPagePath(segments: string[]): string {
  return join(process.cwd(), 'pages', ...segments) + '.md'
}

/**
 * Reads markdown file content by path segments
 */
export async function getPageContent(pathSegments: string[]): Promise<string | null> {
  try {
    const filePath = getPagePath(pathSegments)
    const content = await readFile(filePath, 'utf8')
    return content
  } catch (error) {
    console.error(`Error reading page content:`, error)
    return null
  }
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
        } else if (entry.endsWith('.md')) {
          // Get relative path from pages directory
          const relativePath = fullPath.replace(join(process.cwd(), 'pages') + '/', '')
          files.push(relativePath.replace('.md', ''))
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
        } else if (entry.endsWith('.md')) {
          const slug = entry.replace('.md', '')
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
