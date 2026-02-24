export default function AllocationCard({
  name,
  amount,
}: {
  name: string
  amount: string
}) {
  return (
    <div className="glass p-6 flex justify-between">
      <span>{name}</span>
      <span className="text-green-400">{amount}</span>
    </div>
  )
}
