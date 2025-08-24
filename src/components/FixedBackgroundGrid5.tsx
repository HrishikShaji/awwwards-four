"use client"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const cards = [
	{ color: "bg-blue-500", hexCode: "#3b82f6" },
	{ color: "bg-red-500", hexCode: "#ef4444" },
	{ color: "bg-yellow-500", hexCode: "#eab308" },
	{ color: "bg-green-500", hexCode: "#22c55e" },
	{ color: "bg-orange-500", hexCode: "#f97316" },
]

export default function FixedBackgroundGrid() {
	const cardRefs = useRef<(HTMLDivElement | null)[]>([])
	const containerRef = useRef<HTMLDivElement>(null)
	const gridContainerRef = useRef<HTMLDivElement>(null)
	// Store all grid elements in a 2D array [row][col]
	const gridRefs = useRef<(HTMLDivElement | null)[][]>([])
	const gridParent = useRef<HTMLDivElement>(null)

	useGSAP(() => {
		ScrollTrigger.create({
			trigger: containerRef.current,
			pin: gridContainerRef.current,
			start: "top top",
			pinSpacing: false
		})

		cardRefs.current.forEach((card, cardIndex) => {
			// Create animations for each row based on the card
			// Reverse the order so bottom row (index 9) animates first
			gridRefs.current.forEach((row, rowIndex) => {
				// Calculate reverse index so bottom row starts first
				const reverseRowIndex = gridRefs.current.length - 1 - rowIndex

				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: card,
						start: `top ${85 - (reverseRowIndex * 4)}%`, // Bottom rows trigger first
						end: `top ${60 - (reverseRowIndex * 4)}%`, // Longer animation duration
						scrub: 1,
						markers: true,
						id: `card-${cardIndex}-row-${rowIndex}`
					}
				})

				// Add delay before the row animation starts
				tl.to({}, { duration: reverseRowIndex * 0.1 }) // Delay increases for higher rows

				// Animate only the current row's grid elements
				tl.fromTo(row,
					{
						backgroundColor: cards[cardIndex].hexCode,
						scaleY: 0,
						transformOrigin: "bottom"
					},
					{
						scaleY: 1,
						duration: 0.8,
						ease: "power2.inOut"
					}
				)
			})
		})
	}, [])

	return (
		<div className="relative" ref={containerRef}>
			<div className="h-screen w-full flex justify-center bg-gray-900 pt-[200px]" ref={gridContainerRef}>
				<div ref={gridParent} className="h-[400px]">
					{Array.from({ length: 10 }).map((_, rowIndex) => {
						// Initialize the row array if it doesn't exist
						if (!gridRefs.current[rowIndex]) {
							gridRefs.current[rowIndex] = []
						}

						return (
							<div key={rowIndex} className="flex">
								{Array.from({ length: 10 }).map((_, colIndex) => (
									<div
										className="size-10 relative border border-white/30"
										key={colIndex}
									>
										<div
											className="h-full w-full absolute left-0 top-0"
											ref={(el) => {
												if (el) {
													gridRefs.current[rowIndex][colIndex] = el
												}
											}}
										></div>
									</div>
								))}
							</div>
						)
					})}
				</div>
			</div>
			{cards.map((card, i) => (
				<div
					ref={(el) => {
						if (el) {
							cardRefs.current[i] = el
						}
					}}
					key={i}
					className="h-screen border-y-2 border-gray-800 relative w-full flex items-center justify-center"
				>
					<div
						className={`${card.color} absolute size-20 rounded-full top-20 left-20`}
					></div>
				</div>
			))}
		</div>
	)
}
