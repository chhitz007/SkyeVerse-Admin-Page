'use client'

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useState } from "react"

const provider = new GoogleAuthProvider()

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        try {
            setLoading(true)
            await signInWithPopup(auth, provider)
            router.push("/dashboard")
        } catch (error) {
            console.error("Login failed:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden px-4">

            {/* Background Glow */}
            <div className="absolute -top-40 -right-40 w-100 sm:w-125 h-100 sm:h-125 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-100 sm:w-125 h-100 sm:h-125 bg-indigo-600/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 w-full max-w-md">

                {/* Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                        SkyeVerse Admin
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm sm:text-base">
                        Secure access to internal operations
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-10">

                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-6 text-center">
                        Sign in to continue
                    </h2>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? (
                            <span>Signing in...</span>
                        ) : (
                            <>
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="#4285F4"
                                        d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.26-2.08 3.57-5.15 3.57-8.64z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.87-3a7.17 7.17 0 0 1-10.68-3.76H1.41v3.07A12 12 0 0 0 12 24z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.4 14.33a7.2 7.2 0 0 1 0-4.66V6.6H1.41a12 12 0 0 0 0 10.8l3.99-3.07z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.96 1.07 15.24 0 12 0A12 12 0 0 0 1.41 6.6l3.99 3.07A7.17 7.17 0 0 1 12 4.77z"
                                    />
                                </svg>
                                Sign in with Google
                            </>
                        )}
                    </button>

                    <p className="text-xs text-slate-400 text-center mt-6 leading-relaxed">
                        Access restricted to authorized personnel only.
                    </p>
                </div>

            </div>
        </div>
    )
}
