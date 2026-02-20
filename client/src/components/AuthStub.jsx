import React from 'react'

export default function AuthStub(){
  return (
    <div className="max-w-xl mx-auto card">
      <h2 className="text-xl font-semibold text-white mb-2">Auth (Stub)</h2>
      <p className="text-gray-300 mb-4">Integrate Clerk here. For dev, set `x-user-id` and `x-user-role` headers when calling the API.</p>
      <div className="flex gap-2">
        <a href="/student" className="px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700">Student Demo</a>
        <a href="/alumni" className="px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700">Alumni Demo</a>
        <a href="/admin" className="px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700">Admin Demo</a>
      </div>
    </div>
  )
}
