import { useProposalList } from "../hooks/useProposalList"
import ProposalPreviewCard from "../components/ProposalPreviewCard"

export default function Projects() {
  const proposalIds = useProposalList()

  return (
    <div className="space-y-12">

      <div>
        <h1 className="text-4xl font-bold">
          Funded Projects
        </h1>
        <p className="text-gray-400 mt-3">
          All projects listed below are live on-chain.
        </p>
      </div>

      {proposalIds.length === 0 && (
        <div className="glass p-12 text-center text-gray-400">
          No proposals found on-chain yet.
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {proposalIds.map((id) => (
          <ProposalPreviewCard key={id} id={id} />
        ))}
      </div>

    </div>
  )
}
