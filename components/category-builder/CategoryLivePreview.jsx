"use client";

import StickyEditorialTemplate from "./templates/StickyEditorialTemplate";
import Grid2ColTemplate from "./templates/Grid2ColTemplate";
import Grid3ColTemplate from "./templates/Grid3ColTemplate";
import CarouselMagazineTemplate from "./templates/CarouselMagazineTemplate";

const RENDERERS = {
  "sticky-editorial": StickyEditorialTemplate,
  "grid-2col": Grid2ColTemplate,
  "grid-3col": Grid3ColTemplate,
  "carousel-magazine": CarouselMagazineTemplate,
};

/** Renders whichever of the 4 category-page templates is currently active,
 *  for the given category's content, at the given preview device width.
 *  This same component (and the templates it wires up) is what the public
 *  category page route should render, so what the admin sees in the
 *  builder preview is exactly what visitors see. */
export default function CategoryLivePreview({ templateId, data, category, device = "desktop" }) {
  const Renderer = RENDERERS[templateId] || StickyEditorialTemplate;
  return <Renderer data={data} category={category} device={device} />;
}
