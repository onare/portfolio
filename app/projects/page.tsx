import { Redis } from "@upstash/redis";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { projects as allProjects } from "@/.velite";
import { Card } from "../components/card";
import { Navigation } from "../components/nav";
import { Article } from "./article";

const hasRedis = !!(
	process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);
const redis = hasRedis ? Redis.fromEnv() : null;

async function safeMget(keys: string[]): Promise<(number | null)[]> {
	if (!redis || keys.length === 0) return keys.map(() => 0);
	try {
		return await redis.mget<number[]>(...keys);
	} catch {
		return keys.map(() => 0);
	}
}

export const revalidate = 60;
export default async function ProjectsPage() {
	const viewsArr = await safeMget(
		allProjects.map((p) => ["pageviews", "projects", p.slug].join(":")),
	);
	const views = viewsArr.reduce(
		(acc, v, i) => {
			acc[allProjects[i].slug] = v ?? 0;
			return acc;
		},
		{} as Record<string, number>,
	);

	const featured = allProjects.find((project) => project.slug === "multicube")!;
	const top2 = allProjects.find((project) => project.slug === "vital")!;
	const top3 = allProjects.find((project) => project.slug === "waotools")!;
	const top4 = allProjects.find((project) => project.slug === "waotoolsv1")!;

	return (
		<div className="relative pb-16">
			<Navigation />
			<div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
				<div className="max-w-2xl mx-auto lg:mx-0">
					<h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
						Projects
					</h2>
					<p className="mt-4 text-zinc-400">
						Some of the projects are from work and some are on my own time.
					</p>
				</div>
				<div className="w-full h-px bg-zinc-800" />

				<div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
					<Card>
						<Link
							href={`/projects/${featured.slug}`}
							className="flex flex-col h-full"
						>
							{featured.cover && (
								<div className="relative w-full aspect-video overflow-hidden bg-zinc-900">
									<Image
										src={featured.cover}
										alt=""
										fill
										priority
										sizes="(max-width: 1024px) 100vw, 50vw"
										className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
								</div>
							)}
							<article className="relative w-full flex-1 p-4 md:p-8">
								<div className="flex items-center justify-between gap-2">
									<div className="text-xs text-zinc-100 ">
										{featured.date ? (
											<time dateTime={new Date(featured.date).toISOString()}>
												{Intl.DateTimeFormat(undefined, {
													dateStyle: "medium",
												}).format(new Date(featured.date))}
											</time>
										) : (
											<span>SOON</span>
										)}
									</div>
									<span className="flex items-center gap-1 text-xs text-zinc-500">
										<Eye className="w-4 h-4" />{" "}
										{Intl.NumberFormat("en-US", { notation: "compact" }).format(
											views[featured.slug] ?? 0,
										)}
									</span>
								</div>

								<h2
									id="featured-post"
									className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
								>
									{featured.title}
								</h2>
								<p className="my-2 mb-6 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300 ">
									{featured.description}
								</p>
								<p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
									Read more <span aria-hidden="true">&rarr;</span>
								</p>
							</article>
						</Link>
					</Card>

					<div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 ">
						{[top2, top3, top4].map((project) => (
							<Card key={project.slug}>
								<Article project={project} views={views[project.slug] ?? 0} />
							</Card>
						))}
					</div>
				</div>
				<div className="hidden w-full h-px md:block bg-zinc-800" />
			</div>
		</div>
	);
}
