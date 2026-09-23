import type { Types } from "mongoose";

export interface Customer {
  _id: Types.ObjectId;
  siteId: Types.ObjectId;
  ownerId: Types.ObjectId;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerDTO {
  _id: string;
  siteId: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerListItemDTO extends CustomerDTO {
  requestCount: number;
}
