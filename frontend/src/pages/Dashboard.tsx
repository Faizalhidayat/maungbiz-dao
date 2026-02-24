import { Link } from "react-router-dom"
import { useBalance, useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { useMemo } from "react"

import { DAO_ADDRESS } from "../lib/config"
import { maungDaoAbi } from "../abi/maungDaoAbi"
import ProposalPreviewCard from "../components/ProposalPreviewCard"
import AnimatedCounter from "../components/AnimatedCounter"

export default function Dashboard() {

  // ===============================
  // Treasury Balance (Live)
  // ===============================
  const { data: balanceData } = useBalance({
    address: DAO_ADDRESS as `0x${string}`,
    query: { refetchInterval: 5000 },
  })

  const treasuryBalance =
    balanceData && balanceData.value
      ? Number(
          formatUnits(
            balanceData.value,
            balanceData.decimals
          )
        )
      : 0

  // ===============================
  // Proposal Count
  // ===============================
  const { data: countData } = useReadContract({
    address: DAO_ADDRESS as `0x${string}`,
    abi: maungDaoAbi,
    functionName: "proposalCount",
  })

  const proposalCount = countData
    ? Number(countData)
    : 0

  const proposalIds =
    proposalCount > 0
      ? Array.from(
          { length: proposalCount },
          (_, i) => i + 1
        )
      : []

  // ===============================
  // Fetch Proposals for Stats
  // ===============================
  const proposals = proposalIds.map((id) =>
    useReadContract({
      address: DAO_ADDRESS as `0x${string}`,
      abi: maungDaoAbi,
      functionName: "getProposal",
      args: [BigInt(id)],
    })
  )

  const stats = useMemo(() => {
    let active = 0
    let approved = 0
    let released = 0

    proposals.forEach((p) => {
      if (!p.data) return
      const proposal = p.data as any

      if (proposal.status === 0) active++
      if (proposal.status === 1) approved++
      if (proposal.status === 3) released++
    })

    return { active, approved, released }
  }, [proposals])

  return (
    <div className="space-y-24">

      {/* ================= HERO ================= */}
      <div className="glass p-16 flex justify-between items-center">

        <div className="max-w-xl">
          <h1 className="text-5xl font-bold">
            MaungBiz Community Fund
          </h1>

          <p className="text-gray-400 mt-4">
            Community-powered capital. Transparent decisions. Real on-chain impact.
          </p>

          <div className="mt-8 flex gap-4">

            <Link
              to="/apply"
              className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
            >
              Apply for Funding
            </Link>

            <Link
              to="/governance"
              className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              Governance
            </Link>

          </div>
        </div>

        <div className="text-right">
          <p className="text-gray-400 text-sm">
            Treasury Balance
          </p>

          <h2 className="text-5xl font-bold text-green-400 mt-2">
            <AnimatedCounter value={treasuryBalance} /> ETH
          </h2>
        </div>

      </div>

      {/* ================= DAO METRICS ================= */}
      <div className="grid grid-cols-4 gap-6">

        <MetricCard
          title="Total Proposals"
          value={proposalCount}
        />

        <MetricCard
          title="Active"
          value={stats.active}
        />

        <MetricCard
          title="Approved"
          value={stats.approved}
        />

        <MetricCard
          title="Released"
          value={stats.released}
        />

      </div>

      {/* ================= LIVE PROPOSAL PREVIEW ================= */}
      <div className="space-y-6">

        <h2 className="text-2xl font-semibold">
          Latest Proposals
        </h2>

        {proposalIds.length === 0 && (
          <div className="glass p-6 text-gray-400">
            No proposals available on-chain.
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {proposalIds
            .slice(-4)
            .reverse()
            .map((id) => (
              <ProposalPreviewCard
                key={id}
                id={id}
              />
            ))}
        </div>

      </div>

      {/* ================= CTA ================= */}
      <div className="glass p-16 text-center space-y-6">

        <h2 className="text-3xl font-bold">
          Participate in Governance
        </h2>

        <p className="text-gray-400">
          Every proposal and vote is recorded on-chain.
          Transparent. Autonomous. Community-driven.
        </p>

        <Link
          to="/governance"
          className="inline-block px-8 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          View All Proposals
        </Link>

      </div>

    </div>
  )
}

function MetricCard({
  title,
  value,
}: {
  title: string
  value: number
}) {
  return (
    <div className="glass p-8 space-y-3">
      <p className="text-gray-400 text-sm">
        {title}
      </p>
      <h3 className="text-4xl font-bold">
        <AnimatedCounter value={value} />
      </h3>
    </div>
  )
}
