import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

const SortDropdown = ({ sortBy, onSortChange, sortOrder, onOrderChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  const sortOptions = [
    { id: 'popularity', label: 'Popularity' },
    { id: 'rating', label: 'Rating' },
    { id: 'date', label: 'Release Date' },
    { id: 'price', label: 'Price' },
    { id: 'title', label: 'Title (A-Z)' }
  ]
  
  const currentOption = sortOptions.find(opt => opt.id === sortBy)?.label || 'Popularity'
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const toggleOrder = (e) => {
    e.stopPropagation()
    onOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
  }
  
  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2A2A2A] border border-gray-700 rounded-lg text-gray-300 text-sm hover:border-[#FF0040] hover:text-white transition-colors"
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>{currentOption}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Order Toggle Button */}
        <button
          onClick={toggleOrder}
          className={`p-2.5 rounded-lg border transition-colors ${
            sortOrder === 'asc' 
              ? 'bg-[#FF0040] border-[#FF0040] text-white' 
              : 'bg-[#2A2A2A] border-gray-700 text-gray-400 hover:border-[#FF0040] hover:text-[#FF0040]'
          }`}
          title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        >
          {sortOrder === 'asc' ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
        </button>
      </div>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-[#2A2A2A] border border-gray-700 rounded-lg shadow-xl py-2 min-w-48 z-50">
          {sortOptions.map(option => (
            <button
              key={option.id}
              onClick={() => {
                onSortChange(option.id)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                sortBy === option.id
                  ? 'bg-[#FF0040]/10 text-[#FF0040]'
                  : 'text-gray-300 hover:bg-[#3A3A3A] hover:text-white'
              }`}
            >
              <span>{option.label}</span>
              {sortBy === option.id && (
                <span className="flex items-center gap-1">
                  <span className="text-xs opacity-50">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SortDropdown
