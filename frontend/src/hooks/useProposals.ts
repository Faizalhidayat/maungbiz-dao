import { useReadContract } from "wagmi"
import { maungDaoAbi } from "../abi/maungDaoAbi"
import { DAO_ADDRESS } from "../lib/config"

export function useProposals(): number {
  const { data } = useReadContract({
    address: DAO_ADDRESS as `0x${string}`,
    abi: maungDaoAbi,
    functionName: "proposalCount",
  })

  return data ? Number(data) : 0
}
