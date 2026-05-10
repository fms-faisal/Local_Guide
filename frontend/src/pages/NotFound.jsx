const NotFound = () => (
  <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
    <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
      <p className="text-sm uppercase tracking-[0.35em] text-blue-600">Page not found</p>
      <h1 className="mt-5 text-6xl font-extrabold tracking-tight text-slate-900">404</h1>
      <p className="mt-6 text-base leading-relaxed text-slate-600">The page you're looking for doesn't exist or has moved. Head back to the homepage to resume your journey.</p>
      <a href="/" className="mt-10 inline-flex rounded-3xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Go Home</a>
    </div>
  </main>
);

export default NotFound;
