import { useReadContract } from "wagmi"
import { maungDaoAbi } from "../abi/maungDaoAbi"
import { DAO_ADDRESS } from "../lib/config"

export function useProposalList(): number[] {
  const { data } = useReadContract({
    address: DAO_ADDRESS as `0x${string}`,
    abi: maungDaoAbi,
    functionName: "proposalCount",
  })

  const count = data ? Number(data) : 0

  if (!count) return []

  return Array.from({ length: count }, (_, i) => i + 1)
}
