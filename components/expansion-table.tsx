"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ExpansionCard } from "@/components/expansion-card"
import { Tables } from "@/types/database"
import { useSupabase } from "@/contexts/supabase-context"
import { PersistentTooltip } from "@/components/persistent-tooltip"
import { usePathname } from "next/navigation"

export function ExpansionTable() {
  const supabase = useSupabase()
  const pathname = usePathname()
  const [expansions, setExpansions] = useState<Tables<"expansion">[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchExpansions() {
      try {
        setLoading(true)
        const { data } = await supabase
          .from("expansion")
          .select("*")
          .order("is_active", { ascending: false })
          .order("release_date", { ascending: true })

        setExpansions(data || [])
      } catch (err) {
        console.error("Error fetching expansions:", err)
        setError("Failed to load expansions")
      } finally {
        setLoading(false)
      }
    }

    fetchExpansions()
  }, [supabase])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="h-64 rounded-md bg-muted animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-destructive">{error}</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {expansions.map((expansion) => (
        expansion.is_active ? (
          <Link
            href={pathname === "/match" ? `/match/${expansion.slug}` : `/expansion/${expansion.slug}`}
            key={expansion.id}
            prefetch={true}
          >
            <ExpansionCard
              name={expansion.name || "Unknown Expansion"}
              image={expansion.logo_uri || "/placeholder.svg"}
            />
          </Link>
        ) : (
          <PersistentTooltip
            key={expansion.id}
            expansion={expansion}
            content="Coming soon"
            side="top"
          >
            <div className="cursor-not-allowed opacity-50">
              <ExpansionCard
                name={expansion.name || "Unknown Expansion"}
                image={expansion.logo_uri || "/placeholder.svg"}
              />
            </div>
          </PersistentTooltip>
        )
      ))}
    </div>
  )
}
