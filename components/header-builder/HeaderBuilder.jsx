"use client";

import { useEffect, useState, useCallback } from "react";
import { RotateCcw, Save, Check, Loader2, LayoutGrid, ListTree, PanelTop, SlidersHorizontal, Radio, Smartphone, Sparkles } from "lucide-react";

import { getHeaderAdmin as getHeader, saveHeader, DEFAULT_HEADER } from "@/lib/api";
import { useAutoSave } from "@/lib/useAutoSave";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Tabs from "@/components/ui/Tabs";
import { Card, Field, Input } from "@/components/ui/Field";
import DeviceToggle from "@/components/ui/DeviceToggle";

import LayoutSelector from "./LayoutSelector";
import LogoEditor from "./LogoEditor";
import MenuEditor from "./MenuEditor";
import TopBarEditor from "./TopBarEditor";
import RightSideEditor from "./RightSideEditor";
import BreakingNewsEditor from "./BreakingNewsEditor";
import MobileEditor from "./MobileEditor";
import StyleEditor from "./StyleEditor";
import HeaderPreview from "./HeaderPreview";
import { TopBarQuickCard, RightControlsQuickCard, BreakingNewsQuickCard } from "./SidePanels";

const TABS = [
  { value: "layout", label: "Layout", icon: LayoutGrid },
  { value: "menu", label: "Menu", icon: ListTree },
  { value: "topbar", label: "Top Bar", icon: PanelTop },
  { value: "rightside", label: "Right Side", icon: SlidersHorizontal },
  { value: "breaking", label: "Breaking News", icon: Radio },
  { value: "mobile", label: "Mobile", icon: Smartphone },
  { value: "style", label: "Advanced", icon: Sparkles },
];

export default function HeaderBuilder() {
  const [header, setHeader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("layout");
  const [device, setDevice] = useState("desktop");
  const { status, trigger, saveNow } = useAutoSave(saveHeader, { toastMessage: "Header saved successfully" });

  useEffect(() => {
    getHeader().then((data) => {
      setHeader(data);
      setLoading(false);
    });
  }, []);

  const update = useCallback(
    (next) => {
      setHeader(next);
      trigger(next);
    },
    [trigger]
  );

  function resetToDefault() {
    update(DEFAULT_HEADER);
  }

  if (loading || !header) {
    return (
      <div className="p-6 grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-[1500px] mx-auto">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-ink-900">Header Builder</h2>
          <p className="text-[13px] text-ink-500 mt-0.5">Design and customize your website header. Changes saved here will reflect live.</p>
        </div>
        <div className="flex items-center gap-3">
          <SaveStatus status={status} />
          <Button variant="secondary" icon={RotateCcw} onClick={resetToDefault}>
            Reset to Default
          </Button>
          <Button icon={Save} onClick={() => saveNow(header)}>
            Save Header
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* CENTER: Tabbed editor */}
        <div className="space-y-5 min-w-0">
          <Card noPad>
            <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
            <div className="p-4">
              {activeTab === "layout" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[13px] font-semibold text-ink-900 mb-1">Header Layout</h4>
                    <p className="text-[12px] text-ink-500 mb-3">Choose a header layout structure.</p>
                    <LayoutSelector value={header.template} onChange={(template) => update({ ...header, template })} />
                  </div>

                  {header.template === "masthead" && (
                    <div className="border-t border-border pt-5">
                      <h4 className="text-[13px] font-semibold text-ink-900 mb-1">Masthead Text</h4>
                      <p className="text-[12px] text-ink-500 mb-3">
                        Edit the quote, established line and tagline shown around your logo on this layout.
                      </p>
                      <div className="space-y-3">
                        <Field label="Quote (left side)">
                          <Input
                            value={header.masthead?.quote || ""}
                            onChange={(e) => update({ ...header, masthead: { ...header.masthead, quote: e.target.value } })}
                            placeholder='"Clarity, depth, and the courage to ask harder questions."'
                          />
                        </Field>
                        <Field label="Established Line (right side)">
                          <Input
                            value={header.masthead?.establishedText || ""}
                            onChange={(e) => update({ ...header, masthead: { ...header.masthead, establishedText: e.target.value } })}
                            placeholder="Est. 1998 • London • New York • Singapore"
                          />
                        </Field>
                        <Field label="Tagline (below logo)">
                          <Input
                            value={header.masthead?.tagline || ""}
                            onChange={(e) => update({ ...header, masthead: { ...header.masthead, tagline: e.target.value } })}
                            placeholder="Power • Technology • Profiles • Wealth • Finance • Lifestyle • Culture"
                          />
                        </Field>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-border pt-5">
                    <h4 className="text-[13px] font-semibold text-ink-900 mb-1">Logo &amp; Branding</h4>
                    <p className="text-[12px] text-ink-500 mb-3">Choose logo type and customize appearance.</p>
                    <LogoEditor logo={header.logo} onChange={(logo) => update({ ...header, logo })} />
                  </div>
                </div>
              )}

              {activeTab === "menu" && (
                <div>
                  <h4 className="text-[13px] font-semibold text-ink-900 mb-1">Menu Items</h4>
                  <p className="text-[12px] text-ink-500 mb-3">Add, edit or reorder your navigation links.</p>
                  <MenuEditor
                    menu={header.menu}
                    menuStyle={header.menuStyle}
                    onChange={(menu) => update({ ...header, menu })}
                    onStyleChange={(menuStyle) => update({ ...header, menuStyle })}
                  />
                </div>
              )}

              {activeTab === "topbar" && (
                <div>
                  <h4 className="text-[13px] font-semibold text-ink-900 mb-3">Top Bar Settings</h4>
                  <TopBarEditor topBar={header.topBar} onChange={(topBar) => update({ ...header, topBar })} />
                </div>
              )}

              {activeTab === "rightside" && (
                <div>
                  <h4 className="text-[13px] font-semibold text-ink-900 mb-3">Right Side Controls</h4>
                  <RightSideEditor rightSide={header.rightSide} onChange={(rightSide) => update({ ...header, rightSide })} />
                </div>
              )}

              {activeTab === "breaking" && (
                <div>
                  <h4 className="text-[13px] font-semibold text-ink-900 mb-3">Breaking News Ticker</h4>
                  <BreakingNewsEditor breakingNews={header.breakingNews} onChange={(breakingNews) => update({ ...header, breakingNews })} />
                </div>
              )}

              {activeTab === "mobile" && (
                <div>
                  <h4 className="text-[13px] font-semibold text-ink-900 mb-3">Mobile Settings</h4>
                  <MobileEditor mobile={header.mobile} onChange={(mobile) => update({ ...header, mobile })} />
                </div>
              )}

              {activeTab === "style" && (
                <div>
                  <h4 className="text-[13px] font-semibold text-ink-900 mb-3">Header Behavior</h4>
                  <p className="text-[12px] text-ink-500 mb-3">Configure how the header behaves on scroll and different devices.</p>
                  <StyleEditor behavior={header.behavior} onChange={(behavior) => update({ ...header, behavior })} />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT: Quick settings */}
        <div className="space-y-5">
          <TopBarQuickCard
            topBar={header.topBar}
            onChange={(topBar) => update({ ...header, topBar })}
            onOpenTab={() => setActiveTab("topbar")}
          />
          <RightControlsQuickCard rightSide={header.rightSide} onChange={(rightSide) => update({ ...header, rightSide })} />
          <BreakingNewsQuickCard
            breakingNews={header.breakingNews}
            onChange={(breakingNews) => update({ ...header, breakingNews })}
            onOpenTab={() => setActiveTab("breaking")}
          />
        </div>
      </div>

      {/* FULL-WIDTH: Live preview, below the editor grid so it isn't squeezed into a narrow column */}
      <div className="mt-6">
        <Card title="Live Preview" action={<DeviceToggle device={device} onChange={setDevice} />} noPad>
          <div className="bg-surface-soft p-6 flex justify-center">
            <div
              className="rounded-lg border border-border overflow-hidden bg-white shadow-soft transition-all"
              style={{ width: device === "desktop" ? "100%" : device === "tablet" ? "420px" : "300px" }}
            >
              <HeaderPreview header={header} device={device} disableLinks />
            </div>
          </div>
        </Card>
      </div>
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
