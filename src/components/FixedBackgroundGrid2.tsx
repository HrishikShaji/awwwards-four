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

	useGSAP(() => {
		ScrollTrigger.create({
			trigger: containerRef.current,
			pin: gridContainerRef.current,
			start: "top top",
			pinSpacing: false
		})

		// Create a timeline that spans all sections
		const totalHeight = cardRefs.current.length * window.innerHeight

		cardRefs.current.forEach((card, i) => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: card,
					start: "top bottom",
					end: "bottom top",
					scrub: 1,
					markers: true,
					onEnter: () => {
						// Change color when entering section
						gridRefs.current.forEach(gridItem => {
							if (gridItem) {
								gsap.to(gridItem, {
									backgroundColor: cards[i].hexCode,
									duration: 0.5,
									ease: "power2.out"
								})
							}
						})
					}
				}
			})

			// Scale animation for each section
			tl.fromTo(gridRefs.current,
				{
					scale: 0.2,
					opacity: 0.1
				},
				{
					scale: 1.5,
					opacity: 1,
					duration: 1,
					stagger: {
						amount: 0.5,
						grid: [10, 10],
						from: "center"
					},
					ease: "power2.inOut"
				}
			)
		})
	}, [])

	return (
		<div className="relative" ref={containerRef}>
			<div className="h-screen w-full flex justify-center items-center bg-gray-900" ref={gridContainerRef}>
				<div className="grid grid-cols-10 gap-1">
					{Array.from({ length: 100 }).map((_, i) => (
						<div
							ref={(el) => {
								if (el) {
									gridRefs.current[i] = el
								}
							}}
							className="size-10 border border-white/30"
							key={i}
						></div>
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
					className="h-screen border-y-2 border-gray-800 relative w-full flex items-center justify-center"
				>
					<div className={`${card.color} absolute size-20 rounded-full top-20 left-20`}></div>
					<h2 className="text-white text-4xl font-bold">Section {i + 1}</h2>
				</div>
			))}
		</div>
	)
}
