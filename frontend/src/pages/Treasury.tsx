import { useMemo } from "react"
import {
  useReadContract,
  useReadContracts,
  useBalance,
} from "wagmi"
import { formatUnits } from "viem"

import { maungDaoAbi } from "../abi/maungDaoAbi"
import { DAO_ADDRESS } from "../lib/config"

export default function Treasury() {
  // =============================
  // Contract ETH Balance
  // =============================
  const { data: balanceData } = useBalance({
    address: DAO_ADDRESS as `0x${string}`,
    query: { refetchInterval: 5000 },
  })

  const treasuryBalance = balanceData
    ? Number(
        formatUnits(
          balanceData.value,
          balanceData.decimals
        )
      )
    : 0

  // =============================
  // Proposal Count
  // =============================
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

  // =============================
  // SAFE MULTICALL FETCH
  // =============================
  const contracts =
    proposalIds.length > 0
      ? proposalIds.map((id) => ({
          address: DAO_ADDRESS as `0x${string}`,
          abi: maungDaoAbi,
          functionName: "getProposal",
          args: [BigInt(id)],
        }))
      : []

  const { data: proposalsData } = useReadContracts({
    contracts,
    query: {
      enabled: contracts.length > 0,
    },
  })

  // =============================
  // Derived Analytics
  // =============================
  const analytics = useMemo(() => {
    let approved = 0
    let released = 0

    proposalsData?.forEach((result) => {
      if (!result?.result) return

      const proposal = result.result as any

      if (proposal.status === 1) approved++
      if (proposal.status === 3) released++
    })

    return { approved, released }
  }, [proposalsData])

  return (
    <div className="space-y-16">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold">
          Treasury
        </h1>
        <p className="text-gray-400 mt-3">
          On-chain capital overview (Sepolia).
        </p>
      </div>

      {/* TREASURY BALANCE */}
      <div className="glass p-12 text-center space-y-4">
        <p className="text-gray-400 text-sm">
          Total Treasury Balance
        </p>

        <h2 className="text-5xl font-bold text-green-400">
          {treasuryBalance.toFixed(4)} ETH
        </h2>
      </div>

      {/* ANALYTICS GRID */}
      <div className="grid grid-cols-3 gap-8">

        <div className="glass p-6 space-y-2">
          <p className="text-gray-400 text-sm">
            Total Proposals
          </p>
          <h3 className="text-3xl font-bold">
            {proposalCount}
          </h3>
        </div>

        <div className="glass p-6 space-y-2">
          <p className="text-gray-400 text-sm">
            Approved Proposals
          </p>
          <h3 className="text-3xl font-bold text-blue-400">
            {analytics.approved}
          </h3>
        </div>

        <div className="glass p-6 space-y-2">
          <p className="text-gray-400 text-sm">
            Funds Released
          </p>
          <h3 className="text-3xl font-bold text-purple-400">
            {analytics.released}
          </h3>
        </div>

      </div>
    </div>
  )
}
