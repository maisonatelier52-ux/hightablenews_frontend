import PageBlockRenderer from "./PageBlockRenderer";

const WIDTH = { "full-width": "max-w-none", "boxed": "max-w-4xl", "sidebar-left": "max-w-6xl", "sidebar-right": "max-w-6xl" };

export default function CmsPageView({ page }) {
  const layout = page.layout || "boxed";
  const blocks = page.blocks || [];
  const sidebarBlocks = page.sidebarBlocks || [];
  const hasSidebar = layout === "sidebar-left" || layout === "sidebar-right";
  const design = page.design || {};

  const wrapperStyle = {
    fontFamily: design.bodyFontFamily || undefined,
    backgroundColor: design.backgroundColor || undefined,
  };

  const mainCol = (
    <div className="flex-1 min-w-0 space-y-6">
      {blocks.map((block) => (
        <PageBlockRenderer key={block.id} block={block} pageDesign={design} />
      ))}
      {blocks.length === 0 && (
        <div className="text-center py-16 text-ink-400 text-[13.5px]">This page doesn't have any content yet.</div>
      )}
    </div>
  );

  const sidebarCol = hasSidebar && (
    <aside className="w-full md:w-[300px] shrink-0 space-y-5">
      {sidebarBlocks.map((block) => (
        <div key={block.id} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
          <PageBlockRenderer block={block} pageDesign={design} />
        </div>
      ))}
      {sidebarBlocks.length === 0 && <div className="text-[12.5px] text-ink-400">No sidebar widgets added.</div>}
    </aside>
  );

  return (
    <div className={`mx-auto px-4 py-8 ${WIDTH[layout]}`} style={wrapperStyle}>
      {!hasSidebar && mainCol}
      {hasSidebar && (
        <div className="flex flex-col md:flex-row gap-8">
          {layout === "sidebar-left" && sidebarCol}
          {mainCol}
          {layout === "sidebar-right" && sidebarCol}
        </div>
      )}
    </div>
  );
}
