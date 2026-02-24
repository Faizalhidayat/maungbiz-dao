import { useMemo } from "react"
import { useReadContract } from "wagmi"
import { formatUnits } from "viem"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { maungDaoAbi } from "../abi/maungDaoAbi"
import { DAO_ADDRESS } from "../lib/config"
import AnimatedCounter from "../components/AnimatedCounter"

export default function Impact() {

  const { data: countData } = useReadContract({
    address: DAO_ADDRESS as `0x${string}`,
    abi: maungDaoAbi,
    functionName: "proposalCount",
  })

  const proposalCount = countData ? Number(countData) : 0

  const proposalIds =
    proposalCount > 0
      ? Array.from({ length: proposalCount }, (_, i) => i + 1)
      : []

  const proposals = proposalIds.map((id) =>
    useReadContract({
      address: DAO_ADDRESS as `0x${string}`,
      abi: maungDaoAbi,
      functionName: "getProposal",
      args: [BigInt(id)],
    })
  )

  const impact = useMemo(() => {

    let totalRequested = 0
    let totalApproved = 0
    let totalReleased = 0
    let totalJobs = 0
    let approvedCount = 0
    let rejectedCount = 0

    proposals.forEach((p) => {
      if (!p.data) return

      const proposal = p.data as any
      const requested = Number(
        formatUnits(proposal.requestedAmount, 18)
      )

      totalRequested += requested
      totalJobs += Number(proposal.jobs)

      if (proposal.status === 1) {
        totalApproved += requested
        approvedCount++
      }

      if (proposal.status === 2) {
        rejectedCount++
      }

      if (proposal.status === 3) {
        totalReleased += requested
      }
    })

    return {
      totalRequested,
      totalApproved,
      totalReleased,
      totalJobs,
      approvedCount,
      rejectedCount,
    }

  }, [proposals])

  const donutData = [
    { name: "Approved", value: impact.approvedCount },
    { name: "Rejected", value: impact.rejectedCount },
  ]

  const COLORS = ["#10B981", "#EF4444"]

  return (
    <div className="space-y-20">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold">
          Impact Overview
        </h1>
        <p className="text-gray-400 mt-3">
          Real-world impact powered by on-chain governance.
        </p>
      </div>

      {/* CAPITAL METRICS */}
      <div className="grid grid-cols-3 gap-8">

        <ImpactCard
          title="Total Capital Requested"
          value={impact.totalRequested}
          suffix=" ETH"
        />

        <ImpactCard
          title="Capital Approved"
          value={impact.totalApproved}
          suffix=" ETH"
        />

        <ImpactCard
          title="Capital Released"
          value={impact.totalReleased}
          suffix=" ETH"
        />

      </div>

      {/* JOB IMPACT */}
      <div className="glass p-12 text-center space-y-4">
        <p className="text-gray-400 text-sm">
          Total Jobs Created
        </p>

        <h2 className="text-6xl font-bold text-green-400">
          <AnimatedCounter value={impact.totalJobs} />
        </h2>
      </div>

      {/* DONUT CHART */}
      <div className="glass p-12 space-y-6">

        <h2 className="text-xl font-semibold">
          Proposal Outcome Distribution
        </h2>

        {impact.approvedCount === 0 &&
         impact.rejectedCount === 0 && (
          <div className="text-gray-400">
            No finalized proposals yet.
          </div>
        )}

        {(impact.approvedCount > 0 ||
          impact.rejectedCount > 0) && (

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={donutData}
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        )}

      </div>

    </div>
  )
}

function ImpactCard({
  title,
  value,
  suffix = "",
}: {
  title: string
  value: number
  suffix?: string
}) {
  return (
    <div className="glass p-8 space-y-3">
      <p className="text-gray-400 text-sm">
        {title}
      </p>
      <h3 className="text-4xl font-bold">
        <AnimatedCounter value={value} />
        {suffix}
      </h3>
    </div>
  )
}
