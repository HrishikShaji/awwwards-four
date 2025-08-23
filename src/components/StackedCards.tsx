"use client"

import { useGSAP } from "@gsap/react"
import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"

gsap.registerPlugin(ScrollTrigger)

const cards = [
	{ color: "bg-blue-500" },
	{ color: "bg-red-500" },
	{ color: "bg-yellow-500" },
	{ color: "bg-green-500" },
	{ color: "bg-orange-500" },
]

export default function StackedCards() {
	const cardRefs = useRef<(HTMLDivElement | null)[]>([])
	const containerRef = useRef<HTMLDivElement>(null)

	useGSAP(() => {
		const cards = cardRefs.current.filter(Boolean)

		cards.forEach((card, index) => {
			ScrollTrigger.create({
				trigger: containerRef.current,
				start: `+=${index * window.innerHeight}`,
				pin: card,
				pinSpacing: false,
				scrub: true,
			})
		})
	}, [])

	return (
		<div className="" ref={containerRef}>
			{cards.map((card, i) => (
				<div
					ref={(el) => {
						if (el) {
							cardRefs.current.push(el)
						}
					}}
					key={i} className="h-screen border-y-2 border-gray-800 w-full flex items-center justify-center">
					<div className="grid grid-cols-20">
						{Array.from({ length: 400 }).map((_, j) => (
							<div className={`size-20 ${card.color}`} key={j}></div>
						))}
					</div>
				</div>
			))}
		</div>
	)
}
