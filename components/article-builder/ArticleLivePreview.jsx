"use client";

import StickySidebarTemplate from "./templates/StickySidebarTemplate";
import FullHeroTemplate from "./templates/FullHeroTemplate";
import SplitColumnTemplate from "./templates/SplitColumnTemplate";

const RENDERERS = {
  "sticky-sidebar": StickySidebarTemplate,
  "full-hero": FullHeroTemplate,
  "split-column": SplitColumnTemplate,
};

/** Renders whichever of the 3 article-detail templates is currently active,
 *  for the selected article's real content, at the given preview device
 *  width. This same component is what the public /articles/[slug] route
 *  should render, so the builder preview always matches what visitors see. */
export default function ArticleLivePreview({ templateId, data, article, device = "desktop" }) {
  const Renderer = RENDERERS[templateId] || StickySidebarTemplate;
  return <Renderer data={data} article={article} device={device} />;
}
