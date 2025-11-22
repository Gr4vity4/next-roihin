import { Link } from '@/i18n/navigation'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  buildHref: (page: number) => string
  previousLabel: string
  nextLabel: string
  pageLabel: string
  summaryLabel: string
  isFirstPage: boolean
  isLastPage: boolean
}

export default function PaginationControls({
  currentPage,
  totalPages,
  buildHref,
  previousLabel,
  nextLabel,
  pageLabel,
  summaryLabel,
  isFirstPage,
  isLastPage,
}: PaginationControlsProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-white/80 md:flex-row md:items-center md:justify-between">
      <div className="text-sm uppercase tracking-[0.3em] text-white/60">
        {pageLabel}
        <span className="ml-2 text-white/40">{summaryLabel}</span>
      </div>
      <div className="flex items-center gap-3">
        {isFirstPage ? (
          <span className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/30">
            {previousLabel}
          </span>
        ) : (
          <Link
            href={buildHref(currentPage - 1)}
            className="rounded-full border border-white/30 px-5 py-2 text-sm text-white hover:border-gold hover:text-gold transition-colors"
          >
            {previousLabel}
          </Link>
        )}

        {isLastPage ? (
          <span className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/30">
            {nextLabel}
          </span>
        ) : (
          <Link
            href={buildHref(currentPage + 1)}
            className="rounded-full border border-white/30 px-5 py-2 text-sm text-white hover:border-gold hover:text-gold transition-colors"
          >
            {nextLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
