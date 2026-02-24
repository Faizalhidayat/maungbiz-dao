import { useState } from "react"
import {
  useAccount,
  useConnect,
  useSwitchChain,
  useWriteContract,
} from "wagmi"
import { sepolia } from "wagmi/chains"
import { parseEther } from "viem"

import { maungDaoAbi } from "../abi/maungDaoAbi"
import { DAO_ADDRESS } from "../lib/config"

const CATEGORIES = [
  "Retail & UMKM",
  "Food & Beverage",
  "Agriculture",
  "Creative Industry",
  "Technology",
  "Education",
  "Health",
  "Manufacturing",
  "Digital Services",
  "Logistics",
  "Other",
]

export default function Apply() {
  const { address, chainId } = useAccount()
  const { connect, connectors } = useConnect()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync, isPending } = useWriteContract()

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    amount: "",
    jobs: "",
  })

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      setError(null)

      if (
        !form.name ||
        !form.category ||
        !form.amount ||
        !form.description
      ) {
        setError("Please complete all required fields.")
        return
      }

      if (Number(form.amount) < 0.01) {
        setError("Minimum funding request is 0.01 ETH.")
        return
      }

      // Auto connect
      if (!address) {
        await connect({ connector: connectors[0] })
        return
      }

      // Auto switch network
      if (chainId !== sepolia.id) {
        await switchChainAsync({ chainId: sepolia.id })
        return
      }

      await writeContractAsync({
        address: DAO_ADDRESS as `0x${string}`,
        abi: maungDaoAbi,
        functionName: "createFundingProposal",
        args: [
          form.name,
          form.category,
          form.description,
          parseEther(form.amount),
          BigInt(form.jobs || 0),
        ],
      })

      setSuccess(true)

    } catch (err) {
      console.error(err)
      setError("Transaction failed.")
    }
  }

  if (success) {
    return (
      <div className="max-w-3xl mx-auto glass p-12 text-center space-y-6">
        <h2 className="text-3xl font-bold text-green-400">
          🚀 Proposal Created
        </h2>

        <p className="text-gray-400">
          Your funding proposal is now live and awaiting governance voting.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-3 gap-12">

      {/* LEFT FORM */}
      <div className="col-span-2 space-y-8">

        <h1 className="text-4xl font-bold">
          Apply for Funding
        </h1>

        {/* Business Name */}
        <input
          name="name"
          placeholder="Business Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
        />

        {/* Category Dropdown */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
        >
          <option value="">
            Select Business Category
          </option>

          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Business Description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
        />

        {/* Requested Amount */}
        <input
          name="amount"
          type="number"
          placeholder="Requested Amount (ETH)"
          value={form.amount}
          onChange={handleChange}
          className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
        />

        {/* Jobs */}
        <input
          name="jobs"
          type="number"
          placeholder="Estimated Jobs Created"
          value={form.jobs}
          onChange={handleChange}
          className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
        />

      </div>

      {/* RIGHT PANEL */}
      <div className="glass p-6 space-y-6">

        <p className="text-xs text-gray-400">
          {address
            ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`
            : "Wallet not connected"}
        </p>

        <div className="text-sm text-gray-400 space-y-2">
          <p>
            Requested:
            <span className="text-white ml-2">
              {form.amount || "0"} ETH
            </span>
          </p>

          <p>
            Category:
            <span className="text-white ml-2">
              {form.category || "-"}
            </span>
          </p>

          <p>
            Jobs Impact:
            <span className="text-white ml-2">
              {form.jobs || "0"}
            </span>
          </p>
        </div>

        {error && (
          <div className="text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          {isPending
            ? "Submitting..."
            : "Submit Proposal On-Chain"}
        </button>

        <div className="text-xs text-gray-500">
          Proposal will enter governance voting.
          Funds are locked until approved.
        </div>

      </div>

    </div>
  )
}
