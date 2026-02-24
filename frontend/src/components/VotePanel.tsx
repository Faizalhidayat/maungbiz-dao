import { useState } from "react"
import { useWriteContract } from "wagmi"
import { maungDaoAbi } from "../abi/maungDaoAbi"
import { DAO_ADDRESS } from "../lib/config"

export default function VotePanel({
  proposalId,
  onVoted,
}: {
  proposalId: number
  onVoted?: () => void
}) {
  const { writeContractAsync, isPending } = useWriteContract()

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const vote = async (support: boolean) => {
    try {
      setError(null)
      setSuccess(false)

      await writeContractAsync({
        address: DAO_ADDRESS as `0x${string}`,
        abi: maungDaoAbi,
        functionName: "vote",
        args: [BigInt(proposalId), support],
      })

      setSuccess(true)

      // 🔥 Auto refresh parent
      if (onVoted) onVoted()

    } catch (err) {
      console.error("Vote failed:", err)
      setError("Transaction failed.")
    }
  }

  return (
    <div className="space-y-4">

      <div className="flex gap-4">
        <button
          disabled={isPending}
          className="btn-primary"
          onClick={() => vote(true)}
        >
          {isPending ? "Submitting..." : "Approve"}
        </button>

        <button
          disabled={isPending}
          className="bg-red-600 px-4 py-2 rounded-lg"
          onClick={() => vote(false)}
        >
          Reject
        </button>
      </div>

      {success && (
        <div className="text-green-400 text-sm">
          Vote submitted successfully ✅
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm">
          {error}
        </div>
      )}

    </div>
  )
}
