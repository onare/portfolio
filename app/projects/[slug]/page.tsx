import { notFound } from "next/navigation";
import { projects as allProjects } from "@/.velite";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { Redis } from "@upstash/redis";
import { ReportView } from "./view";

export const revalidate = 60;

type Props = {
	params: Promise<{
		slug: string;
	}>;
};

const hasRedis = !!(
	process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);
const redis = hasRedis ? Redis.fromEnv() : null;

async function safeViews(slug: string): Promise<number> {
	if (!redis) return 0;
	try {
		return (
			(await redis.get<number>(["pageviews", "projects", slug].join(":"))) ?? 0
		);
	} catch {
		return 0;
	}
}

export async function generateStaticParams() {
	return allProjects
		.filter((p) => p.published)
		.map((p) => ({
			slug: p.slug,
		}));
}

export default async function PostPage({ params }: Props) {
	const { slug } = await params;
	const project = allProjects.find((project) => project.slug === slug);

	if (!project) {
		notFound();
	}

	const views = await safeViews(slug);

	return (
		<div className="bg-zinc-50 min-h-screen">
			<Header project={project} views={views} />
			<ReportView slug={project.slug} />

			<article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
				<Mdx code={project.code} />
			</article>
		</div>
	);
}
