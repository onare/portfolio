import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/.velite";

type Props = {
	project: Project;
	views: number;
};

export const Article: React.FC<Props> = ({ project, views }) => {
	const hasCover = Boolean(project.cover);

	return (
		<Link
			href={`/projects/${project.slug}`}
			className={
				hasCover
					? "grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-0 min-h-[140px]"
					: "block"
			}
		>
			{hasCover && (
				<div className="relative overflow-hidden bg-zinc-900 border-r border-zinc-800/80 aspect-[4/3]">
					<Image
						src={project.cover as string}
						alt=""
						fill
						sizes="(max-width: 640px) 140px, 180px"
						className="object-cover transition-transform duration-700 group-hover:scale-105"
					/>
				</div>
			)}
			<article
				className={hasCover ? "p-5 flex flex-col justify-center" : "p-4 md:p-8"}
			>
				<div className="flex justify-between gap-2 items-center">
					<span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
						{project.date ? (
							<time dateTime={new Date(project.date).toISOString()}>
								{Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
									new Date(project.date),
								)}
							</time>
						) : (
							<span>SOON</span>
						)}
					</span>
					<span className="text-zinc-500 text-xs flex items-center gap-1">
						<Eye className="w-4 h-4" />{" "}
						{Intl.NumberFormat("en-US", { notation: "compact" }).format(views)}
					</span>
				</div>
				<h2
					className={`z-20 font-medium duration-1000 text-zinc-200 group-hover:text-white font-display ${
						hasCover
							? "mt-2 text-lg lg:text-xl"
							: "text-xl lg:text-3xl"
					}`}
				>
					{project.title}
				</h2>
				<p
					className={`z-20 text-sm duration-1000 text-zinc-400 group-hover:text-zinc-200 ${
						hasCover ? "mt-1 line-clamp-2" : "mt-4"
					}`}
				>
					{project.description}
				</p>
			</article>
		</Link>
	);
};
