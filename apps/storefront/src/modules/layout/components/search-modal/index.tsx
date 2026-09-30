"use client"

import { convertToLocale } from "@lib/util/money"
import useToggleState from "@lib/hooks/use-toggle-state"
import { MagnifyingGlass } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Modal from "@modules/common/components/modal"
import X from "@modules/common/icons/x"
import Thumbnail from "@modules/products/components/thumbnail"
import { useEffect, useRef, useState } from "react"

type SearchResult = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  price: number | null
  currency_code: string | null
}

const SearchModal = () => {
  const { state: isOpen, open, close } = useToggleState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Modal's enter transition takes a moment to mount the input.
      const timer = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
    setQuery("")
    setResults([])
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setResults(data.products ?? []))
        .finally(() => setLoading(false))
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Search"
        className="flex items-center h-full hover:text-ui-fg-base transition-colors"
        data-testid="nav-search-button"
      >
        <MagnifyingGlass />
      </button>

      <Modal isOpen={isOpen} close={close} search data-testid="nav-search-modal">
        <div className="flex items-center gap-x-3 bg-ui-bg-base border border-ui-border-base rounded-rounded shadow-xl px-4 py-3">
          <MagnifyingGlass className="text-ui-fg-subtle shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search beds..."
            className="flex-1 bg-transparent outline-none text-base-regular text-ui-fg-base placeholder:text-ui-fg-muted"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close search"
            className="text-ui-fg-subtle hover:text-ui-fg-base shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {query.trim() && (
          <div className="mt-2 bg-ui-bg-base border border-ui-border-base rounded-rounded shadow-xl max-h-[60vh] overflow-y-auto">
            {loading ? (
              <p className="p-6 text-center text-ui-fg-subtle">Searching...</p>
            ) : results.length ? (
              <ul className="divide-y divide-ui-border-base">
                {results.map((product) => (
                  <li key={product.id}>
                    <LocalizedClientLink
                      href={`/products/${product.handle}`}
                      onClick={close}
                      className="flex items-center gap-x-4 p-3 hover:bg-ui-bg-subtle transition-colors"
                    >
                      <Thumbnail
                        thumbnail={product.thumbnail}
                        size="small"
                        className="!w-14"
                      />
                      <div className="flex flex-col text-left">
                        <span className="text-base-regular text-ui-fg-base">
                          {product.title}
                        </span>
                        {product.price !== null && product.currency_code && (
                          <span className="text-small-regular text-ui-fg-subtle">
                            {convertToLocale({
                              amount: product.price,
                              currency_code: product.currency_code,
                            })}
                          </span>
                        )}
                      </div>
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-6 text-center text-ui-fg-subtle">
                No beds found for &quot;{query}&quot;.
              </p>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}

export default SearchModal
