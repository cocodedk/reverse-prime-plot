// WebMCP registration shared by the pages that hand an AI agent in the
// visitor's browser typed tools. Nothing here makes a request. The API is a
// draft that has moved once: https://webmachinelearning.github.io/webmcp/ —
// re-check it before changing this.

// Fired and forgotten by a page, so it never rejects, and it does nothing
// without document.modelContext. Each tool registers on its own, so one refusal
// does not take the others with it. Resolves to the names the browser holds.
export async function registerTools(wanted, signal) {
  const registry = typeof document === 'undefined' ? null : document.modelContext;
  if (!registry || typeof registry.registerTool !== 'function') return [];
  await Promise.all(wanted.map((tool) => Promise.resolve()
    .then(() => registry.registerTool(tool, { signal }))
    .catch(() => { /* one refused tool must not take the others with it */ })));
  const held = await Promise.resolve().then(() => registry.getTools()).catch(() => []);
  const names = wanted.map((tool) => tool.name);
  return (Array.isArray(held) ? held : []).map((tool) => tool && tool.name).filter((name) => names.includes(name));
}
