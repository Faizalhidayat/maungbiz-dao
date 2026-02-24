import { useParams, Link } from "react-router-dom"
import {
  useReadContract,
  useWriteContract,
  useAccount,
  useConnect,
  useSwitchChain,
} from "wagmi"
import { sepolia } from "wagmi/chains"
import { formatUnits } from "viem"
import { useState } from "react"

import { maungDaoAbi } from "../abi/maungDaoAbi"
import { DAO_ADDRESS } from "../lib/config"

export default function ProjectDetail() {
  const { id } = useParams()
  const proposalId = Number(id)

  const { address, chainId } = useAccount()
  const { connect, connectors } = useConnect()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()

  const { data, error, refetch } = useReadContract({
    address: DAO_ADDRESS as `0x${string}`,
    abi: maungDaoAbi,
    functionName: "getProposal",
    args: [BigInt(proposalId)],
  })

  const [txLoading, setTxLoading] = useState(false)
  const [txError, setTxError] = useState<string | null>(null)

  // fallback empty structure supaya tidak blank
  const proposal = data as any

  const requestedETH = proposal
    ? Number(formatUnits(proposal.requestedAmount, 18))
    : 0

  const totalVotes = proposal
    ? Number(proposal.yesVotes) + Number(proposal.noVotes)
    : 0

  const approval =
    totalVotes > 0
      ? (Number(proposal.yesVotes) / totalVotes) * 100
      : 0

  const statusMap = ["Active", "Approved", "Rejected", "Released"]
  const status = proposal ? statusMap[proposal.status] : "Loading..."

  const isReleased = proposal?.status === 3
  const isApproved = proposal?.status === 1

  const handleReleaseFunds = async () => {
    try {
      setTxError(null)

      if (!address) {
        await connect({ connector: connectors[0] })
        return
      }

      if (chainId !== sepolia.id) {
        await switchChainAsync({ chainId: sepolia.id })
        return
      }

      if (!isApproved) {
        setTxError("Proposal not approved yet.")
        return
      }

      setTxLoading(true)

      await writeContractAsync({
        address: DAO_ADDRESS as `0x${string}`,
        abi: maungDaoAbi,
        functionName: "releaseFunds",
        args: [BigInt(proposalId)],
      })

      refetch()

    } catch {
      setTxError("Transaction failed.")
    } finally {
      setTxLoading(false)
    }
  }

  return (
    <div className="space-y-16">

      {/* HERO */}
      <div className="relative h-72 w-full bg-black rounded-2xl flex items-center px-12">
        <div>
          <h1 className="text-4xl font-bold text-white">
            {proposal?.name || "Loading project..."}
          </h1>

          <p className="text-gray-400 mt-3">
            {proposal?.category || ""}
          </p>

          <span className="inline-block mt-4 px-4 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
            {status}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-12">

        {/* LEFT */}
        <div className="col-span-2 space-y-10">

          <Link
            to="/projects"
            className="text-sm text-gray-500 hover:text-white"
          >
            ← Back to Projects
          </Link>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Overview
            </h2>

            <p className="text-gray-300">
              {proposal?.description || "Fetching on-chain data..."}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Funding Requested
            </h2>

            <div className="text-3xl font-bold text-green-400">
              {proposal
                ? `${requestedETH.toFixed(2)} ETH`
                : "--"}
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-8">

          <div className="glass p-6 space-y-6">

            <div>
              <p className="text-gray-500 text-sm">
                Yes Votes
              </p>
              <h3 className="text-2xl font-semibold">
                {proposal ? Number(proposal.yesVotes) : "--"}
              </h3>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                No Votes
              </p>
              <h3 className="text-2xl font-semibold">
                {proposal ? Number(proposal.noVotes) : "--"}
              </h3>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Approval Rate
              </p>
              <h3 className="text-2xl font-semibold">
                {proposal ? `${approval.toFixed(0)}%` : "--"}
              </h3>
            </div>

          </div>

          <div className="glass p-6 space-y-4">

            {txError && (
              <div className="text-red-400 text-sm">
                {txError}
              </div>
            )}

            {isReleased ? (
              <div className="text-green-400 font-semibold">
                Funds Released ✅
              </div>
            ) : (
              <button
                onClick={handleReleaseFunds}
                disabled={txLoading || !proposal}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
              >
                {txLoading
                  ? "Processing..."
                  : "Release Funds"}
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}
