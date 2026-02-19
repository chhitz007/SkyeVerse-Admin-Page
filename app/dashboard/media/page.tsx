'use client'

import { useEffect, useState, useMemo } from "react"
import {
    collection,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"

interface Media {
    id: string
    fullName?: string
    email?: string
    publication?: string
    requestType?: string
    deadline?: string
    message?: string
    createdAt?: any
}

export default function MediaPage() {
    const router = useRouter()

    const [data, setData] = useState<Media[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<Media | null>(null)

    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("newest")

    const [deleteMode, setDeleteMode] = useState(false)
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const q = query(
                collection(db, "contact_media"),
                orderBy("createdAt", "desc")
            )

            const snapshot = await getDocs(q)

            const items = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Media[]

            setData(items)
            setLoading(false)
        }

        fetchData()
    }, [])

    /* ---------------- SEARCH + SORT ---------------- */

    const filteredData = useMemo(() => {
        let filtered = data.filter((item) => {
            const term = search.toLowerCase()
            return (
                item.fullName?.toLowerCase().includes(term) ||
                item.email?.toLowerCase().includes(term) ||
                item.publication?.toLowerCase().includes(term) ||
                item.requestType?.toLowerCase().includes(term)
            )
        })

        if (sortBy === "name-asc") {
            filtered.sort((a, b) =>
                (a.fullName || "").localeCompare(b.fullName || "")
            )
        }

        if (sortBy === "name-desc") {
            filtered.sort((a, b) =>
                (b.fullName || "").localeCompare(a.fullName || "")
            )
        }

        if (sortBy === "oldest") {
            filtered.reverse()
        }

        return filtered
    }, [data, search, sortBy])

    /* ---------------- DELETE ---------------- */

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        )
    }

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return
        const confirmDelete = confirm(
            `Delete ${selectedIds.length} request(s)?`
        )
        if (!confirmDelete) return

        await Promise.all(
            selectedIds.map((id) =>
                deleteDoc(doc(db, "contact_media", id))
            )
        )

        setData((prev) =>
            prev.filter((item) => !selectedIds.includes(item.id))
        )

        setSelectedIds([])
        setDeleteMode(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                Loading...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 px-4 sm:px-8 py-10">

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        Media Requests
                    </h1>

                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg"
                        >
                            ← Back
                        </button>

                        {!deleteMode ? (
                            <button
                                onClick={() => setDeleteMode(true)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                                Delete Mode
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleBulkDelete}
                                    className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
                                >
                                    Confirm Delete ({selectedIds.length})
                                </button>

                                <button
                                    onClick={() => {
                                        setDeleteMode(false)
                                        setSelectedIds([])
                                    }}
                                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* SEARCH + SORT */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by name, email, publication..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                    />

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-slate-900 border border-white/20 text-white rounded-xl px-4 py-2"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name-asc">Name A → Z</option>
                        <option value="name-desc">Name Z → A</option>
                    </select>
                </div>

                {/* TABLE */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <div className="max-h-[70vh] overflow-y-auto">

                        <div className={`grid ${deleteMode ? "grid-cols-5" : "grid-cols-4"} gap-4 p-4 border-b border-white/10 bg-slate-900/80 sticky top-0 text-xs uppercase tracking-wider text-slate-400`}>
                            {deleteMode && <div>Select</div>}
                            <div>Name</div>
                            <div>Email</div>
                            <div>Publication</div>
                            <div>Request Type</div>
                        </div>

                        {filteredData.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => !deleteMode && setSelected(item)}
                                className={`grid ${deleteMode ? "grid-cols-5" : "grid-cols-4"} gap-4 p-4 border-b border-white/10 hover:bg-white/10 transition cursor-pointer`}
                            >
                                {deleteMode && (
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => toggleSelect(item.id)}
                                        />
                                    </div>
                                )}

                                <div className="text-white truncate">
                                    {item.fullName || "—"}
                                </div>

                                <div className="text-slate-300 truncate">
                                    {item.email || "—"}
                                </div>

                                <div className="text-blue-400 truncate">
                                    {item.publication || "—"}
                                </div>

                                <div className="text-slate-300 truncate">
                                    {item.requestType || "—"}
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            {/* MODAL */}
            {selected && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative max-h-[85vh] overflow-y-auto">

                        <button
                            onClick={() => setSelected(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-white mb-6">
                            Media Request Details
                        </h2>

                        <Detail label="Full Name" value={selected.fullName} />
                        <Detail label="Email" value={selected.email} />
                        <Detail label="Publication" value={selected.publication} />
                        <Detail label="Request Type" value={selected.requestType} />
                        <Detail label="Deadline" value={selected.deadline} />
                        <Detail label="Message" value={selected.message} multiline />
                    </div>
                </div>
            )}
        </div>
    )
}

function Detail({
    label,
    value,
    multiline
}: {
    label: string
    value?: string
    multiline?: boolean
}) {
    const display = value && value.trim() !== "" ? value : "—"

    return (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
            <div className="text-slate-400 text-sm mb-2">{label}</div>
            <div className={`text-white ${multiline ? "whitespace-pre-wrap" : ""}`}>
                {display}
            </div>
        </div>
    )
}
