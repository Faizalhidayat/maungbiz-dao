export default function FundCard({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="glass p-6">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  )
}
