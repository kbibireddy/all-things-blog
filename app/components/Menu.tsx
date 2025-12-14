'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { MenuItem } from '@/lib/pageUtils'

interface MenuProps {
  items: MenuItem[]
  currentPath?: string[]
}

export default function Menu({ items, currentPath = [] }: MenuProps) {
  // Track which top-level dropdown is open (only one at a time)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Close dropdown when clicking outside any menu item
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      const nav = document.querySelector('.nav')
      if (nav && !nav.contains(target)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="nav">
      {items.map((item) => (
        <MenuDropdown
          key={item.path}
          item={item}
          currentPath={currentPath}
          level={0}
          parentPath={[]}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
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
  openDropdown: string | null
  setOpenDropdown: (path: string | null) => void
}

function MenuDropdown({ 
  item, 
  currentPath, 
  level, 
  parentPath,
  openDropdown,
  setOpenDropdown
}: MenuDropdownProps) {
  const [nestedOpen, setNestedOpen] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // For top-level dropdowns, use shared state
  // For nested dropdowns, use local state
  const dropdownId = item.fullPath.join('/')
  const isTopLevel = level === 0
  const isOpen = isTopLevel 
    ? openDropdown === dropdownId
    : nestedOpen === dropdownId

  // Close nested dropdowns when parent closes
  useEffect(() => {
    if (!isTopLevel && openDropdown === null) {
      setNestedOpen(null)
    }
  }, [openDropdown, isTopLevel])

  const handleToggle = () => {
    if (isTopLevel) {
      // Top-level: close others when opening this one
      setOpenDropdown(isOpen ? null : dropdownId)
    } else {
      // Nested: use local state
      setNestedOpen(isOpen ? null : dropdownId)
    }
  }

  const handleMouseEnter = () => {
    if (isTopLevel && item.children && item.children.length > 0) {
      // Only auto-open on hover for top-level items
      setOpenDropdown(dropdownId)
    }
  }

  // Use fullPath from menu item for routing
  const href = '/' + item.fullPath.join('/')
  
  // Check if current path matches this item
  const pathnameSegments = pathname ? pathname.split('/').filter(Boolean) : []
  const isActive = pathname === href || 
    (pathnameSegments.length > 0 && pathnameSegments[0] === item.path) ||
    JSON.stringify(pathnameSegments) === JSON.stringify(item.fullPath)
  
  const hasChildren = item.children && item.children.length > 0

  if (hasChildren && item.children) {
    // It's a folder with children - show dropdown
    return (
      <div 
        className="nav-item-dropdown" 
        ref={dropdownRef}
      >
        <button
          className={`nav-link ${isActive ? 'active' : ''}`}
          onClick={handleToggle}
          onMouseEnter={handleMouseEnter}
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
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
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
        onClick={() => {
          // Close all dropdowns when navigating
          setOpenDropdown(null)
        }}
      >
        {item.label}
      </Link>
    )
  }
}
