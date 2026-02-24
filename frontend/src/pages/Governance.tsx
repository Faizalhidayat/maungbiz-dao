import { useEffect, useState } from "react"
import {
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi"

import { maungDaoAbi } from "../abi/maungDaoAbi"
import { DAO_ADDRESS } from "../lib/config"
import VotePanel from "../components/VotePanel"

const QUORUM_PERCENT = 50

export default function Governance() {
  const [filter, setFilter] =
    useState<"All" | "Active" | "Approved" | "Rejected" | "Released">("All")

  const {
    data: countData,
    refetch: refetchCount,
  } = useReadContract({
    address: DAO_ADDRESS as `0x${string}`,
    abi: maungDaoAbi,
    functionName: "proposalCount",
  })

  const count = countData ? Number(countData) : 0

  const proposalIds =
    count > 0
      ? Array.from({ length: count }, (_, i) => i + 1)
      : []

  // 🔥 Real-time auto refresh
  useWatchContractEvent({
    address: DAO_ADDRESS as `0x${string}`,
    abi: maungDaoAbi,
    eventName: "Voted",
    onLogs() {
      refetchCount()
    },
  })

  useWatchContractEvent({
    address: DAO_ADDRESS as `0x${string}`,
    abi: maungDaoAbi,
    eventName: "ProposalApproved",
    onLogs() {
      refetchCount()
    },
  })

  useWatchContractEvent({
    address: DAO_ADDRESS as `0x${string}`,
    abi: maungDaoAbi,
    eventName: "FundsReleased",
    onLogs() {
      refetchCount()
    },
  })

  return (
    <div className="space-y-16">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold">
          Governance
        </h1>
        <p className="text-gray-400 mt-3">
          Participate in community funding decisions.
        </p>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-4">
        {["All", "Active", "Approved", "Rejected", "Released"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-4 py-2 rounded-lg ${
              filter === tab
                ? "bg-purple-600"
                : "bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}
      {proposalIds.length === 0 && (
        <div className="glass p-10 text-center text-gray-400">
          No proposals found.
        </div>
      )}

      {/* LIST */}
      <div className="space-y-8">
        {proposalIds.map((id) => (
          <ProposalCard
            key={id}
            id={id}
            filter={filter}
          />
        ))}
      </div>

    </div>
  )
}

// =====================================================
// PROPOSAL CARD
// =====================================================

function ProposalCard({
  id,
  filter,
}: {
  id: number
  filter: string
}) {
  const {
    data,
    refetch,
  } = useReadContract({
    address: DAO_ADDRESS as `0x${string}`,
    abi: maungDaoAbi,
    functionName: "getProposal",
    args: [BigInt(id)],
  })

  const { writeContractAsync } = useWriteContract()

  const [timeLeft, setTimeLeft] = useState("")
  const [isExpired, setIsExpired] = useState(false)
  const [finalizing, setFinalizing] = useState(false)

  useEffect(() => {
    if (!data) return

    const proposal = data as any

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000)
      const diff = Number(proposal.deadline) - now

      if (diff <= 0) {
        setTimeLeft("Voting Ended")
        setIsExpired(true)
        clearInterval(interval)
        return
      }

      const hours = Math.floor(diff / 3600)
      const minutes = Math.floor((diff % 3600) / 60)
      const seconds = diff % 60

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }, 1000)

    return () => clearInterval(interval)
  }, [data])

  if (!data) return null

  const proposal = data as any

  const statusMap = ["Active", "Approved", "Rejected", "Released"]
  const status = statusMap[proposal.status]

  if (filter !== "All" && filter !== status) return null

  const totalVotes =
    Number(proposal.yesVotes) + Number(proposal.noVotes)

  const approval =
    totalVotes > 0
      ? (Number(proposal.yesVotes) / totalVotes) * 100
      : 0

  const quorumReached = approval >= QUORUM_PERCENT

  const handleFinalize = async () => {
    try {
      setFinalizing(true)

      await writeContractAsync({
        address: DAO_ADDRESS as `0x${string}`,
        abi: maungDaoAbi,
        functionName: "finalizeProposal",
        args: [BigInt(id)],
      })

      refetch()
    } catch (err) {
      console.error("Finalize failed", err)
    } finally {
      setFinalizing(false)
    }
  }

  return (
    <div className="glass p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {proposal.name}
        </h2>

        <span className="text-xs px-3 py-1 rounded bg-purple-500/20 text-purple-300">
          {status}
        </span>
      </div>

      <p className="text-gray-400">
        {proposal.description}
      </p>

      {/* COUNTDOWN */}
      <div className="text-sm text-yellow-400">
        ⏳ {timeLeft}
      </div>

      {/* PROGRESS BAR */}
      <div>
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>YES: {Number(proposal.yesVotes)}</span>
          <span>NO: {Number(proposal.noVotes)}</span>
          <span>{approval.toFixed(0)}%</span>
        </div>

        <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 bg-green-500 transition-all duration-700"
            style={{ width: `${approval}%` }}
          />
        </div>

        <div className="text-xs mt-2">
          Quorum Required: {QUORUM_PERCENT}% |{" "}
          {quorumReached ? (
            <span className="text-green-400">
              Quorum Reached ✅
            </span>
          ) : (
            <span className="text-yellow-400">
              Not Enough Votes
            </span>
          )}
        </div>
      </div>

      {/* VOTE PANEL */}
      {proposal.status === 0 && !isExpired && (
        <VotePanel
          proposalId={id}
          onVoted={refetch}
        />
      )}

      {/* FINALIZE BUTTON */}
      {proposal.status === 0 && isExpired && (
        <button
          onClick={handleFinalize}
          disabled={finalizing}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          {finalizing
            ? "Finalizing..."
            : "Finalize Proposal"}
        </button>
      )}

    </div>
  )
}
