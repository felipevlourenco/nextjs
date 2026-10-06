import type { UIMessage } from "ai";

export { cn } from "cn";

export const textOf = (msg: UIMessage) =>
  msg.parts.flatMap((p) => (p.type === "text" ? [p.text] : [])).join("");
