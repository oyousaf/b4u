"use client"

import { motion } from "motion/react"

export default function Signature() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-stone-400">
      <span>Built with</span>
      <motion.span
        aria-hidden="true"
        className="inline-block leading-none"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
      >
        💚
      </motion.span>
      <span>
        by{" "}
        <a
          href="https://legxcysol.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-stone-300 hover:text-white transition-colors"
        >
          Legxcy Solutions
        </a>
      </span>
    </div>
  )
}
