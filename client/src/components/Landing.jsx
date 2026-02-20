import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing(){
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center py-24 px-6">
        <div className="mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20">
            Professional Networking for Your College
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Connect. Network.<br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text">Grow Together.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Alumni Connect bridges the gap between students and alumni.
          Get mentored, discover opportunities, and build your professional network.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/sign-up" className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-semibold shadow-lg shadow-indigo-500/25">
            Get Started Free
          </Link>
          <Link to="/sign-in" className="px-8 py-3.5 border border-slate-600 text-gray-300 rounded-lg hover:bg-slate-800 hover:text-white transition font-semibold">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Why Alumni Connect?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 hover:border-indigo-500/30 transition">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 text-2xl">🎓</div>
            <h3 className="text-xl font-semibold text-white mb-3">Student Discovery</h3>
            <p className="text-gray-400 leading-relaxed">Browse verified alumni, filter by company, department, or graduation year. Find the perfect mentor for your career goals.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 hover:border-purple-500/30 transition">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 text-2xl">💬</div>
            <h3 className="text-xl font-semibold text-white mb-3">Real-time Chat</h3>
            <p className="text-gray-400 leading-relaxed">Connect with alumni and start real-time conversations. Get advice on interviews, career paths, and industry insights.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 hover:border-cyan-500/30 transition">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4 text-2xl">🏆</div>
            <h3 className="text-xl font-semibold text-white mb-3">Achievements</h3>
            <p className="text-gray-400 leading-relaxed">Alumni can showcase career milestones, awards, and projects. Get inspired by the success stories of your college community.</p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Built for Everyone</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-b from-indigo-500/5 to-transparent border border-indigo-500/20 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">🧑‍🎓</div>
            <h3 className="text-xl font-semibold text-white mb-3">Students</h3>
            <p className="text-gray-400 text-sm">Explore alumni, send connection requests, chat with mentors, and discover career paths.</p>
          </div>
          <div className="bg-gradient-to-b from-purple-500/5 to-transparent border border-purple-500/20 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">🧑‍💼</div>
            <h3 className="text-xl font-semibold text-white mb-3">Alumni</h3>
            <p className="text-gray-400 text-sm">Share achievements, connect with students and other alumni, mentor the next generation.</p>
          </div>
          <div className="bg-gradient-to-b from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">👨‍💻</div>
            <h3 className="text-xl font-semibold text-white mb-3">Admins</h3>
            <p className="text-gray-400 text-sm">Manage users, moderate content, verify alumni, and monitor platform activity.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">Alumni Connect — Professional Networking Platform for College Communities</p>
        </div>
      </footer>
    </div>
  )
}
