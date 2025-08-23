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
	const gridRefs = useRef<(HTMLDivElement | null)[]>([])
	const gridParent = useRef<HTMLDivElement>(null)



	useGSAP(() => {
		ScrollTrigger.create({
			trigger: containerRef.current,
			pin: gridContainerRef.current,
			start: "top top",
			pinSpacing: false
		})

		// Create a timeline that spans all sections
		const totalHeight = cardRefs.current.length * window.innerHeight
		const gridsParentHeight = gridParent.current?.getBoundingClientRect().height
		const gridsParentStartPoint = gridParent.current?.clientTop


		const cardStartPoint = window.innerHeight - gridsParentStartPoint
		const cardEndPoint = cardStartPoint + gridsParentHeight

		cardRefs.current.forEach((card, i) => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: card,
					start: (self) => {
						return `${self.trigger?.clientTop + 200} ${self.trigger?.clientTop + 200 + 400}`
					},
					end: (self) => {
						return `${self.trigger?.clientTop + 200 + 400} ${self.trigger?.clientTop + 200}`
					},
					scrub: 1,
					markers: true,
					// onEnter: () => {
					// 	// Change color when entering section
					// 	gridRefs.current.forEach(gridItem => {
					// 		if (gridItem) {
					// 			gsap.to(gridItem, {
					// 				backgroundColor: cards[i].hexCode,
					// 				duration: 0.5,
					// 				ease: "power2.out"
					// 			})
					// 		}
					// 	})
					// },
				}
			})

			// Scale animation for each section
			tl.fromTo(gridRefs.current,
				{
					backgroundColor: cards[i].hexCode,
					scaleY: 0,
					transformOrigin: "bottom"
				},
				{
					scaleY: 1,
					duration: 1,
					stagger: {
						amount: 0.5,
						grid: [10, 10],
						from: "end",
						axis: "y"
					},
					ease: "power2.inOut"
				}
			)
		})
	}, [])

	return (
		<div className="relative" ref={containerRef}>
			<div className="h-screen w-full flex justify-center  bg-gray-900 pt-[200px]" ref={gridContainerRef}>
				<div ref={gridParent} className="grid grid-cols-10 h-[400px]">
					{Array.from({ length: 100 }).map((_, i) => (
						<div
							className="size-10 relative border border-white/30"
							key={i}
						>
							<div className="h-full w-full absolute left-0 top-0"
								ref={(el) => {
									if (el) {
										gridRefs.current[i] = el
									}
								}}

							></div>
						</div>
					))}
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
					className="h-screen border-y-2  border-gray-800 relative w-full flex items-center justify-center"
				>
					<div
						className={`${card.color} absolute size-20 rounded-full top-20 left-20`}></div>
				</div>
			))}
		</div>
	)
}
