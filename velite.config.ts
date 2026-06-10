import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineCollection, defineConfig, s } from "velite";

const projects = defineCollection({
	name: "Project",
	pattern: "projects/**/*.mdx",
	schema: s
		.object({
			title: s.string(),
			description: s.string(),
			date: s.isodate().optional(),
			url: s.string().optional(),
			repository: s.string().optional(),
			cover: s.string().optional(),
			published: s.boolean().default(false),
			slug: s.path(),
			code: s.mdx(),
		})
		.transform((data) => ({
			...data,
			slug: data.slug.replace(/^projects\//, ""),
			path: `/${data.slug}`,
		})),
});

const pages = defineCollection({
	name: "Page",
	pattern: "pages/**/*.mdx",
	schema: s.object({
		title: s.string(),
		description: s.string().optional(),
		slug: s.path(),
		code: s.mdx(),
	}),
});

export default defineConfig({
	root: "content",
	output: {
		data: ".velite",
		assets: "public/static",
		base: "/static/",
		name: "[name]-[hash:6].[ext]",
		clean: true,
	},
	collections: { projects, pages },
	mdx: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [
			rehypeSlug,
			[
				rehypePrettyCode,
				{
					theme: "github-dark",
				},
			],
			[
				rehypeAutolinkHeadings,
				{
					properties: {
						className: ["subheading-anchor"],
						ariaLabel: "Link to section",
					},
				},
			],
		],
	},
});
