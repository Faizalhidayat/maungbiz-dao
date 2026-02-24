import { useWatchContractEvent } from "wagmi"
import { maungDaoAbi } from "../abi/maungDaoAbi"
import { DAO_ADDRESS } from "../lib/config"

export function useProposalEvents() {
  useWatchContractEvent({
    address: DAO_ADDRESS as `0x${string}`,
    abi: maungDaoAbi,
    eventName: "ProposalCreated",
    onLogs(logs) {
      console.log("New Proposal Created:", logs)
    },
  })

  useWatchContractEvent({
    address: DAO_ADDRESS as `0x${string}`,
    abi: maungDaoAbi,
    eventName: "FundsReleased",
    onLogs(logs) {
      console.log("Funds Released:", logs)
    },
  })
}
