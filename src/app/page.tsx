export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <h1 className="text-5xl font-bold mb-6">🚗 Welcome to FlipMode</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-xl text-center">
        Smart, explainable deal decisions for car flippers.  
        Submit a car listing and FlipMode will estimate profit, risks, and confidence in seconds.
      </p>
      <a
        href="/login"
        className="bg-blue-600 text-white px-6 py-3 rounded-md shadow hover:bg-blue-700 transition"
      >
        Get Started
      </a>
      <footer className="mt-12 text-sm text-gray-500">
        FlipMode provides conservative, confidence-adjusted estimates.  
        Actual sale prices and outcomes may vary.
      </footer>
    </div>
  )
}
