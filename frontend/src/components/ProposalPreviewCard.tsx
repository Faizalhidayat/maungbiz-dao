import { useReadContract } from "wagmi"
import { formatUnits } from "viem"
import { Link } from "react-router-dom"

import { maungDaoAbi } from "../abi/maungDaoAbi"
import { DAO_ADDRESS } from "../lib/config"

export default function ProposalPreviewCard({
  id,
}: {
  id: number
}) {
  const { data } = useReadContract({
    address: DAO_ADDRESS as `0x${string}`,
    abi: maungDaoAbi,
    functionName: "getProposal",
    args: [BigInt(id)],
  })

  if (!data) return null

  const proposal = data as any

  const requestedETH = Number(
    formatUnits(proposal.requestedAmount, 18)
  )

  const totalVotes =
    Number(proposal.yesVotes) + Number(proposal.noVotes)

  const progress =
    totalVotes > 0
      ? (Number(proposal.yesVotes) / totalVotes) * 100
      : 0

  const statusMap = ["Active", "Approved", "Rejected", "Released"]

  return (
    <Link
      to={`/projects/${id}`}
      className="glass p-6 glow-hover block space-y-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">
          {proposal.name}
        </h3>

        <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">
          {statusMap[proposal.status]}
        </span>
      </div>

      <p className="text-gray-400 text-sm line-clamp-2">
        {proposal.description}
      </p>

      <div className="text-sm text-gray-400">
        Requested: {requestedETH.toFixed(2)} ETH
      </div>

      <div>
        <div className="w-full bg-black rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>YES: {Number(proposal.yesVotes)}</span>
          <span>NO: {Number(proposal.noVotes)}</span>
        </div>
      </div>
    </Link>
  )
}
