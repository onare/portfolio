"use client";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Navigation } from "../components/nav";

const fadeInAnimationVariants = {
	initial: { opacity: 0, y: 40 },
	animate: (index: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: 0.04 * index,
			ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
			duration: 0.6,
		},
	}),
};

type Skill = { elem: string; icon: string };
type Group = { title: string; caption: string; items: Skill[] };

const groups: Group[] = [
	{
		title: "AI & Agentic dev",
		caption: "Daily drivers. AI is not a toy here, it's the build pipeline.",
		items: [
			{ elem: "Claude Code", icon: "simple-icons:anthropic" },
			{ elem: "Claude API", icon: "simple-icons:anthropic" },
			{ elem: "Agent SDK", icon: "carbon:bot" },
			{ elem: "MCP Servers", icon: "carbon:plug" },
			{ elem: "Cursor", icon: "simple-icons:cursor" },
			{ elem: "Prompt engineering", icon: "carbon:idea" },
			{ elem: "RAG", icon: "carbon:data-base" },
			{ elem: "OpenAI API", icon: "simple-icons:openai" },
		],
	},
	{
		title: "Frameworks & runtime",
		caption: "Where most of the code lives.",
		items: [
			{ elem: "Next.js 16", icon: "skill-icons:nextjs-dark" },
			{ elem: "React 19", icon: "skill-icons:react-dark" },
			{ elem: "Node.js", icon: "skill-icons:nodejs-dark" },
			{ elem: "TypeScript", icon: "skill-icons:typescript" },
			{ elem: "JavaScript", icon: "skill-icons:javascript" },
			{ elem: "NextAuth.js", icon: "simple-icons:nextdotjs" },
			{ elem: "Moleculer", icon: "devicon:moleculer" },
			{ elem: "GraphQL", icon: "skill-icons:graphql-dark" },
		],
	},
	{
		title: "UI & design system",
		caption: "Look, motion, feel.",
		items: [
			{ elem: "Tailwind CSS", icon: "skill-icons:tailwindcss-dark" },
			{ elem: "Material UI v5", icon: "skill-icons:materialui-dark" },
			{ elem: "Framer Motion", icon: "tabler:brand-framer-motion" },
			{ elem: "shadcn/ui", icon: "simple-icons:shadcnui" },
			{ elem: "TipTap", icon: "carbon:text-creation" },
			{ elem: "Radix", icon: "simple-icons:radixui" },
			{ elem: "HTML5", icon: "logos:html-5" },
			{ elem: "CSS3", icon: "skill-icons:css" },
		],
	},
	{
		title: "Data & infra",
		caption: "Where the bytes actually rest.",
		items: [
			{ elem: "MongoDB", icon: "skill-icons:mongodb" },
			{ elem: "Mongoose", icon: "simple-icons:mongoose" },
			{ elem: "MySQL", icon: "devicon:mysql-wordmark" },
			{ elem: "Redis (Upstash)", icon: "skill-icons:redis-dark" },
			{ elem: "Firebase", icon: "devicon:firebase" },
			{ elem: "Redux", icon: "skill-icons:redux" },
			{ elem: "Docker", icon: "skill-icons:docker" },
			{ elem: "Kubernetes", icon: "skill-icons:kubernetes" },
			{ elem: "Vercel", icon: "skill-icons:vercel-dark" },
			{ elem: "GitLab CI/CD", icon: "skill-icons:gitlab-dark" },
		],
	},
	{
		title: "Tooling & flow",
		caption: "The boring stuff that makes the day work.",
		items: [
			{ elem: "Git", icon: "skill-icons:git" },
			{ elem: "GitKraken", icon: "logos:gitkraken" },
			{ elem: "Linear", icon: "simple-icons:linear" },
			{ elem: "Figma", icon: "skill-icons:figma-dark" },
			{ elem: "Playwright", icon: "devicon:playwright" },
			{ elem: "VS Code", icon: "skill-icons:vscode-dark" },
		],
	},
];

export default function SkillsPage() {
	let runningIndex = 0;

	return (
		<div className="relative pb-16">
			<Navigation />
			<div className="px-6 pt-20 mx-auto space-y-12 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
				<div className="max-w-2xl mx-auto lg:mx-0">
					<h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl font-display">
						Skills
					</h2>
					<p className="mt-4 text-zinc-400 leading-7">
						Tools, frameworks and habits I've built up across projects — from
						guild dashboards to multi-module enterprise platforms.
					</p>
				</div>
				<div className="w-full h-px bg-zinc-800" />

				<div className="space-y-14">
					{groups.map((group) => (
						<section key={group.title}>
							<div className="flex flex-col gap-1 mb-6 md:flex-row md:items-baseline md:justify-between">
								<h3 className="text-xl font-semibold text-zinc-200 font-display">
									{group.title}
								</h3>
								<p className="text-sm text-zinc-500">{group.caption}</p>
							</div>

							<ul className="flex flex-wrap gap-2">
								{group.items.map((skill) => {
									const index = runningIndex++;
									return (
										<motion.li
											key={`${group.title}-${skill.elem}`}
											variants={fadeInAnimationVariants}
											initial="initial"
											whileInView="animate"
											viewport={{ once: true, amount: 0.1 }}
											custom={index}
											className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-zinc-800 bg-zinc-900/40 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800/60 transition-colors duration-300"
										>
											<Icon icon={skill.icon} style={{ fontSize: "20px" }} />
											<span>{skill.elem}</span>
										</motion.li>
									);
								})}
							</ul>
						</section>
					))}
				</div>

				<div className="hidden w-full h-px md:block bg-zinc-800" />
			</div>
		</div>
	);
}
