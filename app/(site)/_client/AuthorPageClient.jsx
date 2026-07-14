"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthorLivePreview from "@/components/author-builder/AuthorLivePreview";
import Skeleton from "@/components/ui/Skeleton";
import { getAuthorBySlug, preloadAuthors } from "@/lib/authorsApi";
import { getAuthorPageConfig } from "@/lib/authorPageApi";
import { useResponsiveDevice } from "@/lib/useResponsiveDevice";

// The parent Server Component (app/(site)/author/[slug]/page.jsx) has
// already confirmed the author exists and generated metadata, breadcrumbs,
// and Person JSON-LD — this only renders the interactive builder layout.
export default function AuthorPageClient() {
  const params = useParams();
  const device = useResponsiveDevice();
  const slug = params?.slug;

  const [state, setState] = useState({ loading: true, author: null, config: null });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [, config] = await Promise.all([preloadAuthors(), getAuthorPageConfig()]);
      const author = getAuthorBySlug(slug) || null;
      if (cancelled) return;
      setState({ loading: false, author, config });
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.loading || !state.author) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-40 w-40 rounded-full" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    );
  }

  const { templateId, blocksByTemplate } = state.config;
  const data = blocksByTemplate[templateId];

  return <AuthorLivePreview key={device} templateId={templateId} data={data} author={state.author} device={device} />;
}
