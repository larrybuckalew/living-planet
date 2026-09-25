/** Calm placeholder shown while the three.js globe chunk loads. */
export default function GlobeSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#060d09]" aria-hidden="true">
      <div className="h-40 w-40 animate-pulse rounded-full border border-fg/10 bg-[radial-gradient(circle_at_35%_35%,#123024,#060d09_70%)] sm:h-56 sm:w-56" />
    </div>
  )
}
