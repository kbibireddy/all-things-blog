import { readdir, readFile } from 'fs/promises'
import { join, relative, resolve, sep } from 'path'
import { cache } from 'react'

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

const PAGES_ROOT = resolve(process.cwd(), 'pages')

function sanitizePathSegments(segments: string[]): string[] | null {
  if (!Array.isArray(segments)) return null

  const safe: string[] = []
  for (const seg of segments) {
    // Disallow empty segments and special traversal segments
    if (!seg || seg === '.' || seg === '..') return null
    // Disallow path separators / null bytes
    if (seg.includes('/') || seg.includes('\\') || seg.includes('\0')) return null
    // Keep hidden files/folders out of routing surface area
    if (seg.startsWith('.')) return null
    safe.push(seg)
  }
  return safe
}

/**
 * Recursively reads directory structure and returns page items
 */
async function _getPagesStructure(baseDir: string = 'pages'): Promise<PageItem[]> {
  const pagesPath = join(process.cwd(), baseDir)
  const items: PageItem[] = []

  try {
    const entries = await readdir(pagesPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = join(pagesPath, entry.name)

      if (entry.isDirectory()) {
        const children = await getPagesStructure(join(baseDir, entry.name))
        items.push({
          name: entry.name,
          path: entry.name,
          type: 'folder',
          children: children.length > 0 ? children : undefined,
          fullPath: fullPath
        })
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        items.push({
          name: entry.name.replace('.md', ''),
          path: entry.name.replace('.md', ''),
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

export const getPagesStructure = cache(_getPagesStructure)

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
  const safeSegments = sanitizePathSegments(segments)
  if (!safeSegments || safeSegments.length === 0) {
    throw new Error('Invalid page path segments')
  }

  const resolved = resolve(PAGES_ROOT, ...safeSegments) + '.md'
  // Ensure the resolved path stays within the pages root.
  if (!resolved.startsWith(PAGES_ROOT + sep)) {
    throw new Error('Path traversal attempt blocked')
  }
  return resolved
}

/**
 * Reads markdown file content by path segments
 */
export async function getPageContent(pathSegments: string[]): Promise<string | null> {
  try {
    if (!Array.isArray(pathSegments) || pathSegments.length === 0) return null
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
      const entries = await readdir(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name)
        
        if (entry.isDirectory()) {
          await traverse(fullPath)
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          // Get relative path from pages directory in a cross-platform way.
          const relativePath = relative(PAGES_ROOT, fullPath).split(sep).join('/')
          files.push(relativePath.replace(/\.md$/, ''))
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
async function _getAllPageSlugs(): Promise<string[][]> {
  const pagesPath = PAGES_ROOT
  const slugs: string[][] = []
  
  async function traverse(dir: string, currentPath: string[] = []) {
    try {
      const entries = await readdir(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name)
        
        if (entry.isDirectory()) {
          await traverse(fullPath, [...currentPath, entry.name])
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          const slug = entry.name.replace('.md', '')
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

export const getAllPageSlugs = cache(_getAllPageSlugs)
