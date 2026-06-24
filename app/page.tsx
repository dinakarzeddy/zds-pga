import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
        <h1 className="font-['Pinyon_Script'] text-6xl text-purple-700 mb-2">ZD's PGA</h1>
        <p className="text-gray-400 text-sm mb-8">Personal Grammar Assistant</p>
        <Link href="/setup" className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition">
          Get Started
        </Link>
      </div>
    </main>
  )
}