import { useEffect, useState } from "react"

export default function AnimatedCounter({
  value,
}: {
  value: number
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 800
    const start = performance.now()

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1)
      setDisplay(value * progress)

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [value])

  return <span>{display.toFixed(2)}</span>
}
