"use client";

import { useMemo, useState } from "react";
import { prompts, type PromptItem } from "@/data/prompts";

type Filters = {
  search: string;
  tool: string;
  category: string;
};

const allTools = ["All", ...new Set(prompts.map((prompt) => prompt.tool))];
const allCategories = [
  "All",
  ...new Set(prompts.map((prompt) => prompt.category)),
];

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    tool: "All",
    category: "All",
  });
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  const [copiedId, setCopiedId] = useState<string>("");
  const [modalCopied, setModalCopied] = useState(false);

  const filteredPrompts = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return prompts.filter((prompt) => {
      const toolMatch = filters.tool === "All" || prompt.tool === filters.tool;
      const categoryMatch =
        filters.category === "All" || prompt.category === filters.category;

      const searchMatch =
        search.length === 0 ||
        [
          prompt.title,
          prompt.description,
          prompt.tool,
          prompt.category,
          prompt.promptText,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);

      return toolMatch && categoryMatch && searchMatch;
    });
  }, [filters]);

  const copyText = async (
    text: string,
    id: string,
    inModal = false,
  ): Promise<void> => {
    await navigator.clipboard.writeText(text);

    if (inModal) {
      setModalCopied(true);
      window.setTimeout(() => setModalCopied(false), 1600);
      return;
    }

    setCopiedId(id);
    window.setTimeout(() => setCopiedId(""), 1600);
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-[#f4f7ff]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <header className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#121a33] to-[#0f1830] p-6 shadow-[0_20px_60px_rgba(6,10,30,0.45)] sm:p-8">
          <p className="mb-3 inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-200">
            Vibe Coding Prompt Library
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Ship faster with battle-tested prompts
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-[#c5d0ea] sm:text-base">
            Explore curated prompts for Cursor, v0, Claude Code, and Bolt.
            Search in real time, combine filters, and copy instantly.
          </p>
        </header>

        <section className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-[#121a33]/90 p-4 shadow-xl sm:p-6 lg:grid-cols-[2fr_1fr_1fr]">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#9fb0d8]">
              Search
            </span>
            <input
              value={filters.search}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, search: event.target.value }))
              }
              placeholder="Search by title, keyword, tool, or category"
              className="w-full rounded-xl border border-white/15 bg-[#0e1530] px-3 py-2.5 text-sm text-white placeholder:text-[#8191b7] outline-none transition focus:border-cyan-300"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#9fb0d8]">
              Tool
            </span>
            <select
              value={filters.tool}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, tool: event.target.value }))
              }
              className="w-full rounded-xl border border-white/15 bg-[#0e1530] px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300"
            >
              {allTools.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#9fb0d8]">
              Category
            </span>
            <select
              value={filters.category}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, category: event.target.value }))
              }
              className="w-full rounded-xl border border-white/15 bg-[#0e1530] px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-300"
            >
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="mb-4 flex items-center justify-between text-sm text-[#9fb0d8]">
          <p>
            Showing <span className="font-semibold text-white">{filteredPrompts.length}</span>{" "}
            of {prompts.length} prompts
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPrompts.map((prompt) => {
            const promptKey = `${prompt.title}-${prompt.tool}`;

            return (
              <article
                key={promptKey}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#121a33]/85 p-5 shadow-[0_8px_30px_rgba(3,7,23,0.35)] transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:bg-[#162144]"
              >
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-1 text-xs font-medium text-cyan-200">
                    {prompt.tool}
                  </span>
                  <span className="rounded-full border border-violet-300/30 bg-violet-300/10 px-2.5 py-1 text-xs font-medium text-violet-200">
                    {prompt.category}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-white">{prompt.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#c3cdeb]">
                  {prompt.description}
                </p>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyText(prompt.promptText, promptKey)}
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-[#082026] transition hover:bg-cyan-300"
                  >
                    {copiedId === promptKey ? "Copied!" : "Copy Prompt"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPrompt(prompt)}
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-[#e8edff] transition hover:border-cyan-300/45 hover:text-cyan-200"
                  >
                    View
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {filteredPrompts.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#121a33] p-8 text-center text-sm text-[#b3c0e4]">
            No prompts match your current search and filters.
          </div>
        ) : null}
      </div>

      {selectedPrompt ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#02050f]/70 p-3 backdrop-blur-sm sm:items-center sm:p-8"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0f1732] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedPrompt.title}</h3>
                <p className="mt-1 text-sm text-[#aab8de]">
                  {selectedPrompt.tool} • {selectedPrompt.category}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPrompt(null)}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-[#d8e1ff] transition hover:border-cyan-300/45 hover:text-cyan-200"
              >
                Close
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto p-5">
              <p className="whitespace-pre-wrap text-sm leading-7 text-[#dce4ff]">
                {selectedPrompt.promptText}
              </p>
            </div>

            <div className="border-t border-white/10 p-5">
              <button
                type="button"
                onClick={() => copyText(selectedPrompt.promptText, "modal", true)}
                className="inline-flex w-full items-center justify-center rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-[#082026] transition hover:bg-cyan-300 sm:w-auto"
              >
                {modalCopied ? "Copied!" : "Copy Full Prompt"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
