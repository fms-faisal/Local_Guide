const NotFound = () => (
  <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl w-full rounded-[2rem] border border-gray-200 bg-white p-10 text-center shadow-sm">
      <p className="text-sm uppercase tracking-[0.35em] text-blue-600 mb-3">Page not found</p>
      <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved. Return to the homepage to continue exploring.</p>
      <a href="/" className="inline-flex rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-sm transition hover:bg-blue-700">
        Go Home
      </a>
    </div>
  </main>
);

export default NotFound;
