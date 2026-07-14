"use client";

import SidebarRightTemplate from "./templates/SidebarRightTemplate";
import HeroBannerTemplate from "./templates/HeroBannerTemplate";
import SidebarLeftTemplate from "./templates/SidebarLeftTemplate";

const RENDERERS = {
  "sidebar-right": SidebarRightTemplate,
  "hero-banner": HeroBannerTemplate,
  "sidebar-left": SidebarLeftTemplate,
};

/** Renders whichever of the 3 author-page templates is currently active, for
 *  the selected author's real content, at the given preview device width.
 *  This same component is what the public /authors/[slug] route should
 *  render, so the builder preview always matches what visitors see. */
export default function AuthorLivePreview({ templateId, data, author, device = "desktop" }) {
  const Renderer = RENDERERS[templateId] || SidebarRightTemplate;
  return <Renderer data={data} author={author} device={device} />;
}
