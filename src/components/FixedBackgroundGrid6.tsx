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

	// Store grid elements for each card separately [cardIndex][row][col]
	const gridRefs = useRef<(HTMLDivElement | null)[][][]>([])
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
			for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
				// Calculate reverse index so bottom row starts first
				const reverseRowIndex = 9 - rowIndex

				// Get all grid elements in this row for this card
				const rowElements = []
				for (let colIndex = 0; colIndex < 10; colIndex++) {
					if (gridRefs.current[cardIndex] &&
						gridRefs.current[cardIndex][rowIndex] &&
						gridRefs.current[cardIndex][rowIndex][colIndex]) {
						rowElements.push(gridRefs.current[cardIndex][rowIndex][colIndex])
					}
				}

				if (rowElements.length > 0) {
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

					// Animate all elements in this row for this specific card
					tl.fromTo(rowElements,
						{
							scaleY: 0,
							transformOrigin: "bottom"
						},
						{
							scaleY: 1,
							duration: 0.8,
							ease: "power2.inOut"
						}
					)
				}
			}
		})
	}, [])

	return (
		<div className="relative" ref={containerRef}>
			<div className="h-screen w-full flex justify-center bg-gray-900 pt-[200px]" ref={gridContainerRef}>
				<div ref={gridParent} className="h-[400px] relative">
					{/* Base grid structure - visible borders */}
					<div className="absolute top-0 left-0">
						{Array.from({ length: 10 }).map((_, rowIndex) => (
							<div key={rowIndex} className="flex">
								{Array.from({ length: 10 }).map((_, colIndex) => (
									<div
										className="size-10 border border-white/30"
										key={colIndex}
									/>
								))}
							</div>
						))}
					</div>

					{/* Create separate colored layers for each card */}
					{cards.map((card, cardIndex) => {
						// Initialize the card's grid array if it doesn't exist
						if (!gridRefs.current[cardIndex]) {
							gridRefs.current[cardIndex] = []
						}

						return (
							<div key={cardIndex} className="absolute top-0 left-0">
								{Array.from({ length: 10 }).map((_, rowIndex) => {
									// Initialize the row array if it doesn't exist
									if (!gridRefs.current[cardIndex][rowIndex]) {
										gridRefs.current[cardIndex][rowIndex] = []
									}

									return (
										<div key={rowIndex} className="flex">
											{Array.from({ length: 10 }).map((_, colIndex) => (
												<div
													className="size-10 relative"
													key={colIndex}
												>
													<div
														className="h-full w-full absolute left-0 top-0"
														style={{
															backgroundColor: card.hexCode,
															zIndex: cardIndex + 1,
															transform: 'scaleY(0)',
															transformOrigin: 'bottom'
														}}
														ref={(el) => {
															if (el) {
																gridRefs.current[cardIndex][rowIndex][colIndex] = el
															}
														}}
													></div>
												</div>
											))}
										</div>
									)
								})}
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
