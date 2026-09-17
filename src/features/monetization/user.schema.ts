import { getModel } from "@/shared/db/mongoose";

import mongoose from "mongoose";

const userReadSchema = new mongoose.Schema(
  {},
  { strict: false, collection: "user" }
);

export const UserReadModel = getModel("UserRead", userReadSchema);