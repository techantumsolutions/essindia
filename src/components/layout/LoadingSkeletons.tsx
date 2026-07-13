export function HeaderSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
      <div className="container mx-auto max-w-7xl px-4 md:px-8 h-20 flex items-center justify-between">
        <div className="h-10 w-40 bg-slate-200 rounded animate-pulse" />
        <div className="hidden lg:flex gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-10 w-28 bg-slate-200 rounded-full animate-pulse" />
      </div>
    </header>
  );
}

export function FooterSkeleton() {
  return (
    <footer className="bg-[#ececec] border-t border-slate-100 pt-8 pb-0 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-24 bg-slate-300 rounded animate-pulse" />
              <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function PageContentSkeleton() {
  return (
    <div className="pt-20">
      <div className="h-[60vh] bg-slate-100 animate-pulse" />
      <div className="container mx-auto max-w-7xl px-4 md:px-8 py-16 space-y-8">
        <div className="h-8 w-1/3 bg-slate-200 rounded animate-pulse mx-auto" />
        <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
