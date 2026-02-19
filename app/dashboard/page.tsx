'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

export default function Dashboard() {
    const router = useRouter()
    const [checking, setChecking] = useState(true)

    const allowedEmails = [
        "kanchanjyoti405@gmail.com",
        "chhitizupadhyay123@gmail.com",
        "gupta.subham30@gmail.com",
        "akaisuichi007@gmail.com"
    ]

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/login')
            } else if (!allowedEmails.includes(user.email || "")) {
                alert("Access Denied")
                router.push('/login')
            } else {
                setChecking(false)
            }
        })

        return () => unsubscribe()
    }, [router])

    const handleLogout = async () => {
        try {
            await signOut(auth)
            router.push('/login')
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    const sections = [
        { name: 'Investor Inquiries', path: '/dashboard/investors' },
        { name: 'Partnership', path: '/dashboard/partnership' },
        { name: 'Careers', path: '/dashboard/careers' },
        { name: 'Waitlist', path: '/dashboard/waitlist' },
        { name: 'General', path: '/dashboard/general' },
        { name: 'Media', path: '/dashboard/media' },
    ]

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                Checking access...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden px-4 sm:px-8 py-10">

            {/* Background Glow */}
            <div className="absolute -top-40 -right-40 w-100 sm:w-125 h-100 sm:h-125 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-100 sm:w-125 h-100 sm:h-125 bg-indigo-600/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-400 mt-3 text-sm sm:text-base">
                            Manage and review all internal form submissions.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl transition active:scale-[0.97]"
                    >
                        Logout
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {sections.map((section) => (
                        <div
                            key={section.name}
                            onClick={() => router.push(section.path)}
                            className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:border-blue-500/40 hover:bg-white/10 active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg sm:text-xl font-semibold text-white">
                                    {section.name}
                                </h2>
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                                    →
                                </div>
                            </div>

                            <p className="text-sm text-slate-400 leading-relaxed">
                                View and manage all {section.name.toLowerCase()} submissions securely.
                            </p>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}
