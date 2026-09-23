import type { Types } from "mongoose";

export interface Service {
  _id: Types.ObjectId;
  siteId: Types.ObjectId;
  ownerId: Types.ObjectId;
  name: string;
  description: string;
  active: boolean;
  sortOrder: number;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceDTO {
  _id: string;
  siteId: string;
  name: string;
  description: string;
  active: boolean;
  sortOrder: number;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}
