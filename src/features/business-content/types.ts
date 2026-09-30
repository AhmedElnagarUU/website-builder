import type { Types } from "mongoose";
import type { ContentOrigin, Locale } from "@/features/sites/types";

export type BusinessItemKind =
  | "service"
  | "menu_item"
  | "gallery_item"
  | "hours"
  | "contact";

export type BusinessItemOrigin = ContentOrigin;

export type BusinessContactType =
  | "phone"
  | "whatsapp"
  | "email"
  | "address"
  | "instagram"
  | "facebook"
  | "maps";

export interface ServiceItemData {
  name: string;
  description: string;
  price?: string;
  imageS3Key?: string;
}

export interface MenuItemData {
  name: string;
  description: string;
  price?: string;
  imageS3Key?: string;
}

export interface GalleryItemData {
  title?: string;
  imageS3Key: string;
}

export interface HoursData {
  dayIndex: number;
  open?: string;
  close?: string;
  closed: boolean;
}

export interface ContactData {
  type: BusinessContactType;
  value: string;
  label?: string;
}

export type BusinessItemDataFor<K extends BusinessItemKind> = K extends "service"
  ? ServiceItemData
  : K extends "menu_item"
    ? MenuItemData
    : K extends "gallery_item"
      ? GalleryItemData
      : K extends "hours"
        ? HoursData
        : ContactData;

export type BusinessItemData = BusinessItemDataFor<BusinessItemKind>;

export interface BusinessItem<K extends BusinessItemKind = BusinessItemKind> {
  _id: Types.ObjectId;
  siteId: Types.ObjectId;
  ownerId: Types.ObjectId;
  kind: K;
  locale: Locale;
  baseKey: string;
  data: BusinessItemDataFor<K>;
  origin: BusinessItemOrigin;
  edited: boolean;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessItemDTO<
  K extends BusinessItemKind = BusinessItemKind,
> {
  _id: string;
  siteId: string;
  kind: K;
  locale: Locale;
  baseKey: string;
  data: BusinessItemDataFor<K>;
  origin: BusinessItemOrigin;
  edited: boolean;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessItemInput {
  siteId: string;
  ownerId: string;
  kind: BusinessItemKind;
  locale: Locale;
  baseKey?: string;
  data: BusinessItemData;
  active?: boolean;
  sortOrder?: number;
  origin?: BusinessItemOrigin;
  edited?: boolean;
}

export type BusinessItemPatch = Partial<
  Pick<BusinessItem, "data" | "active" | "sortOrder" | "origin" | "edited">
>;

export interface ListBusinessItemsFilter {
  siteId: string;
  ownerId: string;
  kind?: BusinessItemKind;
  locale?: Locale;
  includeInactive?: boolean;
}
