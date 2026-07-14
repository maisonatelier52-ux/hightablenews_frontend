"use client";

import { useEffect, useState, useCallback } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { RotateCcw, Save, Check, Loader2, Plus, LayoutGrid, Columns3, PanelBottom, Share2, Paintbrush, Settings2 } from "lucide-react";

import { getFooterAdmin as getFooter, saveFooter, makeId, DEFAULT_FOOTER } from "@/lib/api";
import { useAutoSave } from "@/lib/useAutoSave";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Tabs from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Field";
import DeviceToggle from "@/components/ui/DeviceToggle";

import FooterLayoutSelector from "./FooterLayoutSelector";
import ColumnEditor from "./ColumnEditor";
import BrandingEditor from "./BrandingEditor";
import NewsletterEditor from "./NewsletterEditor";
import SocialEditor from "./SocialEditor";
import BottomBarEditor from "./BottomBarEditor";
import StylingEditor from "./StylingEditor";
import FooterMobileEditor from "./FooterMobileEditor";
import FooterPreview from "./FooterPreview";
import { BottomBarQuickCard, FooterDepthQuickCard } from "./SidePanels";

const TABS = [
  { value: "layout", label: "Layout", icon: LayoutGrid },
  { value: "columns", label: "Columns", icon: Columns3 },
  { value: "bottombar", label: "Bottom Bar", icon: PanelBottom },
  { value: "social", label: "Social Links", icon: Share2 },
  { value: "styling", label: "Styling", icon: Paintbrush },
  { value: "advanced", label: "Advanced", icon: Settings2 },
];

export default function FooterBuilder() {
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("layout");
  const [device, setDevice] = useState("desktop");
  const { status, trigger, saveNow } = useAutoSave(saveFooter, { toastMessage: "Footer saved successfully" });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  useEffect(() => {
    getFooter().then((data) => {
      setFooter(data);
      setLoading(false);
    });
  }, []);

  const update = useCallback(
    (next) => {
      setFooter(next);
      trigger(next);
    },
    [trigger]
  );

  function resetToDefault() {
    update(DEFAULT_FOOTER);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = footer.columns.map((c) => c.id);
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    update({ ...footer, columns: arrayMove(footer.columns, oldIndex, newIndex) });
  }

  function updateColumn(id, next) {
    update({ ...footer, columns: footer.columns.map((c) => (c.id === id ? next : c)) });
  }

  function deleteColumn(id) {
    update({ ...footer, columns: footer.columns.filter((c) => c.id !== id) });
  }

  function addColumn() {
    update({
      ...footer,
      columns: [...footer.columns, { id: makeId("col"), title: "New Column", type: "links", width: 25, links: [] }],
    });
  }

  if (loading || !footer) {
    return (
      <div className="p-6 grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-[1500px] mx-auto">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-ink-900">Footer Builder</h2>
          <p className="text-[13px] text-ink-500 mt-0.5">Design and manage your website footer. Changes saved here will reflect live.</p>
        </div>
        <div className="flex items-center gap-3">
          <SaveStatus status={status} />
          <Button variant="secondary" icon={RotateCcw} onClick={resetToDefault}>
            Reset to Default
          </Button>
          <Button icon={Save} onClick={() => saveNow(footer)}>
            Save Footer
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* TOP-LEFT: Tabbed editor */}
        <div className="space-y-5 min-w-0">
          <Card noPad>
            <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
            <div className="p-4">
              {activeTab === "layout" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[13px] font-semibold text-ink-900 mb-1">Footer Layout</h4>
                    <p className="text-[12px] text-ink-500 mb-3">Choose a footer layout structure.</p>
                    <FooterLayoutSelector value={footer.layout} onChange={(layout) => update({ ...footer, layout })} />
                  </div>
                  <div className="border-t border-border pt-5">
                    <h4 className="text-[13px] font-semibold text-ink-900 mb-1">Footer Branding</h4>
                    <p className="text-[12px] text-ink-500 mb-3">Logo, tagline and typography for the footer.</p>
                    <BrandingEditor branding={footer.branding} onChange={(branding) => update({ ...footer, branding })} />
                  </div>
                  <div className="border-t border-border pt-5">
                    <h4 className="text-[13px] font-semibold text-ink-900 mb-1">Newsletter Block</h4>
                    <p className="text-[12px] text-ink-500 mb-3">Optional module shown above the bottom bar.</p>
                    <NewsletterEditor newsletter={footer.newsletter} onChange={(newsletter) => update({ ...footer, newsletter })} />
                  </div>
                </div>
              )}

              {activeTab === "columns" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-[13px] font-semibold text-ink-900">Footer Columns</h4>
                    <button onClick={addColumn} className="flex items-center gap-1 text-[12.5px] font-semibold text-primary hover:text-primary-600">
                      <Plus size={14} /> Add Column
                    </button>
                  </div>
                  <p className="text-[12px] text-ink-500 mb-3">Add, edit and reorder footer columns. Drag to reorder.</p>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={footer.columns.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {footer.columns.map((col, idx) => (
                          <ColumnEditor
                            key={col.id}
                            column={col}
                            defaultOpen={idx === 0}
                            onChange={(next) => updateColumn(col.id, next)}
                            onDelete={deleteColumn}
                          />
                        ))}
                        {footer.columns.length === 0 && (
                          <p className="text-[13px] text-ink-400 py-6 text-center">No columns yet. Add one above.</p>
                        )}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              {activeTab === "bottombar" && (
                <div>
                  <h4 className="text-[13px] font-semibold text-ink-900 mb-3">Bottom Bar Settings</h4>
                  <BottomBarEditor bottomBar={footer.bottomBar} onChange={(bottomBar) => update({ ...footer, bottomBar })} />
                </div>
              )}

              {activeTab === "social" && (
                <div>
                  <h4 className="text-[13px] font-semibold text-ink-900 mb-3">Social Icon Manager</h4>
                  <SocialEditor social={footer.social} onChange={(social) => update({ ...footer, social })} />
                </div>
              )}

              {activeTab === "styling" && (
                <div>
                  <h4 className="text-[13px] font-semibold text-ink-900 mb-3">Design Controls</h4>
                  <StylingEditor footer={footer} onChange={update} />
                </div>
              )}

              {activeTab === "advanced" && (
                <div>
                  <h4 className="text-[13px] font-semibold text-ink-900 mb-3">Mobile Footer Settings</h4>
                  <FooterMobileEditor mobile={footer.mobile} onChange={(mobile) => update({ ...footer, mobile })} />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* TOP-RIGHT: Quick settings */}
        <div className="space-y-5">
          <BottomBarQuickCard bottomBar={footer.bottomBar} onChange={(bottomBar) => update({ ...footer, bottomBar })} />
          <FooterDepthQuickCard depth={footer.depth} onChange={(depth) => update({ ...footer, depth })} />
        </div>
      </div>

      {/* BOTTOM: Full-width live preview */}
      <Card title="Live Preview" action={<DeviceToggle device={device} onChange={setDevice} />} noPad className="mt-6">
        <div className="bg-surface-soft p-4 lg:p-8 flex justify-center">
          <div
            className="rounded-lg border border-border overflow-hidden shadow-soft transition-all w-full"
            style={{ maxWidth: device === "desktop" ? "100%" : device === "tablet" ? "420px" : "300px" }}
          >
            <FooterPreview footer={footer} device={device} />
          </div>
        </div>
      </Card>
    </div>
  );
}

function SaveStatus({ status }) {
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-[12.5px] text-ink-400">
        <Loader2 size={13} className="animate-spin" /> Saving…
      </span>
    );
  }
  if (status === "saved") {
    return (
      <span className="flex items-center gap-1.5 text-[12.5px] text-emerald-600">
        <Check size={13} /> All changes saved
      </span>
    );
  }
  return null;
}
