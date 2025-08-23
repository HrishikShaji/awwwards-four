"use client"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const cards = [
	{ color: "bg-blue-500", hexCode: "blue" },
	{ color: "bg-red-500", hexCode: "red" },
	{ color: "bg-yellow-500", hexCode: "yellow" },
	{ color: "bg-green-500", hexCode: "green" },
	{ color: "bg-orange-500", hexCode: "orange" },
]
export default function FixedBackgroundGrid() {
	const cardRefs = useRef<(HTMLDivElement | null)[]>([])
	const containerRef = useRef<HTMLDivElement>(null)
	const gridContainerRef = useRef<HTMLDivElement>(null)
	const gridRefs = useRef<(HTMLDivElement | null)[]>([])
	const levelRefs = useRef<(HTMLDivElement | null)[]>([])

	useGSAP(() => {
		ScrollTrigger.create({
			trigger: containerRef.current,
			pin: gridContainerRef.current,
			start: "top top",
			pinSpacing: false
		})

		cardRefs.current.forEach((card, i) => {
			gsap.to(gridRefs.current, {
				scale: 2,
				background: cards[i].hexCode,
				scrollTrigger: {
					trigger: card,
					start: `top bottom`,
					end: "bottom bottom",
					scrub: true,
					markers: true
				}
			})
		})
	}, {})

	return (
		<div className="relative" ref={containerRef}>
			<div className=" h-screen w-full flex justify-center items-center" ref={gridContainerRef}>
				<div className="grid grid-cols-10">
					{Array.from({ length: 10 }).map((_, i) => (
						<div key={i} ref={(el) => {
							if (el) {
								levelRefs.current.push(el)
							}
						}} className="flex">
							{Array.from({ length: 10 }).map((_, j) => (
								<div key={j} className="size-10 border-white border-1">
									<div
										ref={(element) => {
											if (element) {
												gridRefs.current.push(element)
											}
										}}
										className="h-full w-full" key={j}>
									</div>

								</div>
							))}
						</div>
					))}
				</div>
			</div>
			{cards.map((card, i) => (
				<div
					ref={(el) => {
						if (el) {
							cardRefs.current.push(el)
						}
					}}
					key={i} className="h-screen border-y-2 border-gray-800 relative w-full flex items-center justify-center">
					<div className={`${card.color} absolute size-20 rounded-full top-20 left-20`}></div>
				</div>
			))}
		</div>
	)
}
