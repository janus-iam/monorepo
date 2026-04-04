import { createFileRoute, notFound } from "@tanstack/react-router";
import { MDXContent } from "@content-collections/mdx/react";
import { allGovernances } from "content-collections";
import { LandingArticleDocument } from "@/components/LandingArticleDocument";
import { MdxCallout } from "@/components/MdxCallout";
import { MdxMetrics } from "@/components/MdxMetrics";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/governance/$slug")({
  loader: ({ params }) => {
    const post = Array.from(
      new Map(
        [...allGovernances]
          .sort((a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf())
          .map((entry) => [entry.slug, entry]),
      ).values(),
    ).find((entry) => entry.slug === params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData, params }) => {
    const title = loaderData?.title ?? "Governance";
    const description = loaderData?.description ?? "";
    const image = loaderData?.heroImage ?? "/images/lagoon-1.svg";
    return {
      links: [{ rel: "canonical", href: `${SITE_URL}/governance/${params.slug}` }],
      meta: [
        { title },
        { name: "description", content: description },
        {
          property: "og:image",
          content: image.startsWith("http") ? image : `${SITE_URL}${image}`,
        },
      ],
    };
  },
  component: GovernancePost,
});

function GovernancePost() {
  const post = Route.useLoaderData();

  return (
    <LandingArticleDocument
      kicker="Governance"
      title={post.title}
      pubDate={post.pubDate}
      heroImage={post.heroImage}
    >
      {post.mdx ? (
        <MDXContent code={post.mdx} components={{ MdxCallout, MdxMetrics }} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: post.html ?? "" }} />
      )}
    </LandingArticleDocument>
  );
}
