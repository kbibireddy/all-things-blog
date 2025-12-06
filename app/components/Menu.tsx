'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuItem } from '@/lib/pageUtils'

interface MenuProps {
  items: MenuItem[]
  currentPath?: string[]
}

export default function Menu({ items, currentPath = [] }: MenuProps) {
  return (
    <nav className="nav">
      {items.map((item) => (
        <MenuDropdown
          key={item.path}
          item={item}
          currentPath={currentPath}
          level={0}
          parentPath={[]}
        />
      ))}
    </nav>
  )
}

interface MenuDropdownProps {
  item: MenuItem
  currentPath: string[]
  level: number
  parentPath: string[]
}

function MenuDropdown({ item, currentPath, level, parentPath }: MenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Use fullPath from menu item for routing
  const href = '/' + item.fullPath.join('/')
  
  // Check if current path matches this item
  const pathnameSegments = pathname.split('/').filter(Boolean)
  const isActive = pathname === href || 
    (pathnameSegments.length > 0 && pathnameSegments[0] === item.path) ||
    JSON.stringify(pathnameSegments) === JSON.stringify(item.fullPath)
  
  const hasChildren = item.children && item.children.length > 0

  if (hasChildren && item.children) {
    // It's a folder with children - show dropdown
    return (
      <div className="nav-item-dropdown" ref={dropdownRef}>
        <button
          className={`nav-link ${isActive ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => level === 0 && setIsOpen(true)}
        >
          {item.label}
          <span className="dropdown-arrow">▼</span>
        </button>
        {isOpen && (
          <div className="dropdown-menu" style={{ marginLeft: `${level * 20}px` }}>
            {item.children.map((child) => (
              <MenuDropdown
                key={child.fullPath.join('/')}
                item={child}
                currentPath={currentPath.slice(1)}
                level={level + 1}
                parentPath={item.fullPath}
              />
            ))}
          </div>
        )}
      </div>
    )
  } else {
    // It's a file or folder without children - show as link
    return (
      <Link
        href={href}
        className={`nav-link ${isActive ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        {item.label}
      </Link>
    )
  }
}
