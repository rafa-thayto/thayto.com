'use client'

import React, { useState, useCallback } from 'react'
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'

interface CodeBlockProps {
  children?: React.ReactNode
  className?: string
  [key: string]: any
}

// Custom Pre component to handle the pre wrapper with copy button
export const Pre = ({ children, ...props }: any) => {
  const [copied, setCopied] = useState(false)
  const preRef = React.useRef<HTMLPreElement>(null)

  const copyToClipboard = useCallback(async () => {
    try {
      // Get the text content directly from the DOM element
      const code = preRef.current?.textContent || ''

      if (!code.trim()) {
        console.warn('No code content to copy')
        return
      }

      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
      // Fallback for browsers that don't support clipboard API
      try {
        const textArea = document.createElement('textarea')
        textArea.value = preRef.current?.textContent || ''
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackErr) {
        console.error('Fallback copy also failed:', fallbackErr)
      }
    }
  }, [])

  return (
    <div className="relative group">
      <pre ref={preRef} {...props}>
        {children}
      </pre>

      {/* Copy Button */}
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-3 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={copied ? 'Copied!' : 'Copy code'}
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? (
          <CheckIcon className="h-4 w-4 text-green-400" />
        ) : (
          <ClipboardIcon className="h-4 w-4" />
        )}
      </button>

      {/* Copy feedback */}
      {copied && (
        <div className="absolute top-3 right-16 px-2 py-1 bg-green-600 text-white text-xs rounded opacity-0 animate-fade-in">
          Copied!
        </div>
      )}
    </div>
  )
}

// Regular code component for inline code
export const CodeBlock = ({
  children,
  className,
  ...props
}: CodeBlockProps) => {
  return (
    <code className={className} {...props}>
      {children}
    </code>
  )
}
