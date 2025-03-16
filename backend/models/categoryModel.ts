import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
    parentCategory?: mongoose.Types.ObjectId | null;
    name: string;
    status: "active" | "inactive";
}

const CategorySchema: Schema = new Schema(
    {
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    { timestamps: true }
);

CategorySchema.index({ parentCategory: 1 });

const Category = mongoose.model<ICategory>("Category", CategorySchema);
export default Category;