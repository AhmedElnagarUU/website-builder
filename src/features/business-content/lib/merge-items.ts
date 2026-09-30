import type { Locale } from "@/features/sites/types";
import type {
  BusinessItem,
  BusinessItemData,
  BusinessItemKind,
} from "@/features/business-content/types";

/**
 * One merge is always computed for exactly one `kind` + `locale` pair, so an `en` merge
 * can never reach the `ar` row that shares its `baseKey`.
 */
export interface BusinessItemMergeScope {
  kind: BusinessItemKind;
  locale: Locale;
}

/** A newly written item as the caller (AI generation) received it, before any merge. */
export interface GeneratedBusinessItem {
  baseKey: string;
  data: BusinessItemData;
  active?: boolean;
  sortOrder?: number;
}

/**
 * What a caller must actually persist for one incoming item. Shape-compatible with
 * `BusinessItemPatch`, so an `update` action can be handed to `updateBusinessItem` as is.
 */
export interface BusinessItemWrite {
  data: BusinessItemData;
  active: boolean;
  sortOrder: number;
  origin: "ai";
  edited: false;
}

export type BusinessItemMergeAction =
  | { action: "insert"; baseKey: string; write: BusinessItemWrite }
  | { action: "update"; id: string; baseKey: string; write: BusinessItemWrite }
  | { action: "keep"; id: string; baseKey: string };

/**
 * THE PROTECTION RULE (product invariant): an existing item is kept unless the caller passes
 * `force === true`, whenever `item.edited === true` OR `item.origin !== "ai"`. Testing `edited`
 * alone is not enough — an item the owner created carries `origin: "user"` with `edited: false`
 * and would be silently clobbered. Anything the user owns or touched is protected; only
 * genuinely AI-origin rows may be replaced. `force` is the escape hatch the EPIC 5
 * "you have edited content, regenerate anyway?" confirm-gate passes.
 */
export function isProtectedFromAiOverwrite(
  item: Pick<BusinessItem, "edited" | "origin">,
  force = false
): boolean {
  if (force) return false;
  return item.edited || item.origin !== "ai";
}

/** The database form of the same rule, so the owner-scoped count can never drift from it. */
export const PROTECTED_ITEM_QUERY = {
  $or: [{ edited: true }, { origin: { $ne: "ai" } }],
};

function toGeneratedWrite(
  incoming: GeneratedBusinessItem,
  prev: BusinessItem | undefined,
  index: number
): BusinessItemWrite {
  return {
    data: incoming.data,
    active: incoming.active ?? prev?.active ?? true,
    sortOrder: incoming.sortOrder ?? prev?.sortOrder ?? index,
    origin: "ai",
    edited: false,
  };
}

/**
 * Pure merge: decides what to write when newly generated items meet the owner's existing rows
 * of the same `kind` and `locale`. No database, no I/O — the caller applies the returned
 * actions. Existing rows with no incoming counterpart are never touched or deleted.
 *
 * Incoming items are paired with existing rows by `(kind, locale, baseKey)` — never by `_id`
 * and never by array position — because `baseKey` is what links the en/ar rows of one
 * logical item.
 */
export function mergeBusinessItems(
  scope: BusinessItemMergeScope,
  existing: BusinessItem[],
  generated: GeneratedBusinessItem[],
  force = false
): BusinessItemMergeAction[] {
  const existingByBaseKey = new Map<string, BusinessItem>();
  for (const item of existing) {
    if (item.kind !== scope.kind || item.locale !== scope.locale) continue;
    existingByBaseKey.set(item.baseKey, item);
  }

  // One action per baseKey: a repeated baseKey would otherwise plan two writes for the same row.
  const incomingByBaseKey = new Map<string, GeneratedBusinessItem>();
  for (const incoming of generated) {
    incomingByBaseKey.set(incoming.baseKey, incoming);
  }

  const actions: BusinessItemMergeAction[] = [];
  let index = 0;
  for (const incoming of incomingByBaseKey.values()) {
    const position = index++;
    const prev = existingByBaseKey.get(incoming.baseKey);
    if (!prev) {
      actions.push({
        action: "insert",
        baseKey: incoming.baseKey,
        write: toGeneratedWrite(incoming, prev, position),
      });
      continue;
    }
    const id = prev._id.toString();
    if (isProtectedFromAiOverwrite(prev, force)) {
      actions.push({ action: "keep", id, baseKey: prev.baseKey });
      continue;
    }
    actions.push({
      action: "update",
      id,
      baseKey: prev.baseKey,
      write: toGeneratedWrite(incoming, prev, position),
    });
  }
  return actions;
}
