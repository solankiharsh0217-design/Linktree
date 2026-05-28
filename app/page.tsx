import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-sm">
        <h1 className="text-2xl font-semibold text-indigo-600 tracking-tight">
          Linktree
        </h1>
        <p className="text-sm text-gray-500">
          Choose a variant to preview
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/cloud"
            className="rounded-full border border-indigo-600/30 bg-white text-indigo-600 py-3.5 text-center font-medium text-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300"
          >
            Cloud Outline
          </Link>
          <Link
            href="/athletic"
            className="rounded-full border border-indigo-600/30 bg-white text-indigo-600 py-3.5 text-center font-medium text-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300"
          >
            Athletic Dark
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-gray-200 bg-gray-50 text-gray-500 py-3 text-center text-xs hover:bg-gray-100 hover:text-gray-700 transition-all duration-300"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </div>
  );
}
