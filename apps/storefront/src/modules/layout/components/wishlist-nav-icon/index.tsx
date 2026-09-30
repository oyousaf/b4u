"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Heart from "@modules/common/icons/heart"

const WishlistNavIcon = () => {
  const { productIds, loggedIn, loaded } = useWishlist()
  const count = productIds.size

  return (
    <LocalizedClientLink
      href={loggedIn ? "/account/wishlist" : "/account"}
      aria-label="Wishlist"
      className="relative flex items-center h-full hover:text-ui-fg-base transition-colors"
      data-testid="nav-wishlist-link"
    >
      <Heart />
      {loaded && count > 0 && (
        <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay-600 px-1 text-[10px] font-medium text-white">
          {count}
        </span>
      )}
    </LocalizedClientLink>
  )
}

export default WishlistNavIcon
