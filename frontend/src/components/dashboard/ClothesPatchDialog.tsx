import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUploadImage } from "@/hooks/useImage";
import { useUpdateClothes } from "@/hooks/useClothes";
import { toast, Toaster } from "sonner";
import type { Clothes } from "@/utils/types";

const CATEGORY = ["Male", "Female", "Unisex", "Other"] as const;

const ClothesSchema = z.object({
    name: z.string().min(2, "Name is required"),
    category: z.enum([...CATEGORY] as [string, ...string[]], { message: "Category is required" }),
    type: z.string().min(2, "Type is required"),
    size: z.string().min(1, "At least one size (comma separated)").max(100),
    color: z.string().min(1, "At least one color (comma separated)").max(100),
    price: z
        .preprocess((val) => {
            if (typeof val === "string" && val.trim() === "") return undefined;
            if (typeof val === "string" || typeof val === "number") return Number(val);
            return undefined;
        }, z.number())
        .refine((val) => !isNaN(val), { message: "Price is required" })
        .refine((val) => val > 0, { message: "Price must be greater than 0" }),
    inStock: z.boolean(),
    bestseller: z.boolean(),
    newArrival: z.boolean(),
    imagePath: z.string().max(5000).optional(),
    description: z.string().max(10000).optional(),
});

type ClothesSchemaInput = z.input<typeof ClothesSchema>;
type ClothesPatchDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: Clothes | null;
    clothesId: string;
};

export default function ClothesPatchDialog({
    open,
    onOpenChange,
    initialData,
    clothesId,
}: ClothesPatchDialogProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadImageMutation = useUploadImage();
    const updateClothesMutation = useUpdateClothes();

    // Pre-fill the form if editing
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ClothesSchemaInput>({
        resolver: zodResolver(ClothesSchema),
        defaultValues: initialData
            ? {
                  name: initialData.name ?? "",
                  category: initialData.category ?? undefined,
                  type: initialData.type ?? "",
                  size: Array.isArray(initialData.size) ? initialData.size.join(", ") : "",
                  color: Array.isArray(initialData.color) ? initialData.color.join(", ") : "",
                  price:
                      typeof initialData.price === "object" && "$numberDecimal" in initialData.price
                          ? initialData.price.$numberDecimal
                          : initialData.price?.toString() ?? "",
                  inStock: initialData.inStock ?? true,
                  bestseller: initialData.bestseller ?? false,
                  newArrival: initialData.newArrival ?? false,
                  imagePath: initialData.imagePath ?? "",
                  description: initialData.description ?? "",
              }
            : {},
    });

    // If initialData changes (e.g. switching product), reset form and preview
    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name ?? "",
                category: initialData.category ?? undefined,
                type: initialData.type ?? "",
                size: Array.isArray(initialData.size) ? initialData.size.join(", ") : "",
                color: Array.isArray(initialData.color) ? initialData.color.join(", ") : "",
                price:
                    typeof initialData.price === "object" && "$numberDecimal" in initialData.price
                        ? initialData.price.$numberDecimal
                        : initialData.price?.toString() ?? "",
                inStock: initialData.inStock ?? true,
                bestseller: initialData.bestseller ?? false,
                newArrival: initialData.newArrival ?? false,
                imagePath: initialData.imagePath ?? "",
                description: initialData.description ?? "",
            });
            setImagePreview(initialData.imagePath || null);
        }
    }, [initialData, reset]);

    // File change/upload handler
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            try {
                const url = await uploadImageMutation.mutateAsync(file);
                setValue("imagePath", url, { shouldValidate: true });
                setImagePreview(url);
            } catch (err) {
                setImagePreview(null);
                setValue("imagePath", "", { shouldValidate: true });
                toast.error("Failed to upload image.");
            }
        } else {
            setImagePreview(null);
            setValue("imagePath", "", { shouldValidate: true });
        }
    };

    const handlePreviewClick = () => {
        fileInputRef.current?.click();
    };

    const onSubmit = (data: ClothesSchemaInput) => {
        const parsed = ClothesSchema.parse(data);
        const sizeArray =
            parsed.size && parsed.size.trim() !== ""
                ? parsed.size.split(",").map((s) => s.trim())
                : [];
        const colorArray =
            parsed.color && parsed.color.trim() !== ""
                ? parsed.color.split(",").map((c) => c.trim())
                : [];

        updateClothesMutation.mutate(
            {
                id: clothesId,
                updates: {
                    ...parsed,
                    size: sizeArray,
                    color: colorArray,
                },
            },
            {
                onSuccess: () => {
                    toast.success("Clothing item updated successfully.");
                    reset();
                    setImagePreview(null);
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error("Failed to update clothing item.");
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg w-full p-6">
                <DialogHeader>
                    <DialogTitle>Edit Clothing Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name")} placeholder="E.g. Classic Tee" />
                        {typeof errors.name?.message === "string" && (
                            <span className="text-xs text-red-500">{errors.name.message}</span>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            {...register("category")}
                            className="block w-full border rounded p-2"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select category
                            </option>
                            {CATEGORY.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {typeof errors.category?.message === "string" && (
                            <span className="text-xs text-red-500">{errors.category.message}</span>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Input id="type" {...register("type")} placeholder="E.g. Shirt, Hoodie" />
                        {typeof errors.type?.message === "string" && (
                            <span className="text-xs text-red-500">{errors.type.message}</span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="size">Sizes (comma separated)</Label>
                            <Input id="size" {...register("size")} placeholder="S, M, L, XL" />
                            {typeof errors.size?.message === "string" && (
                                <span className="text-xs text-red-500">{errors.size.message}</span>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="color">Colors (comma separated)</Label>
                            <Input id="color" {...register("color")} placeholder="Black, White, Red" />
                            {typeof errors.color?.message === "string" && (
                                <span className="text-xs text-red-500">{errors.color.message}</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <Label>Product Image</Label>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleImageChange}
                            tabIndex={-1}
                        />
                        <div
                            className={`
                                mt-2 flex items-center justify-center
                                border-2 border-dashed rounded cursor-pointer transition
                                ${imagePreview ? 'p-0 border-gray-200' : 'p-6 border-gray-300 hover:border-black'}
                            `}
                            style={{ minHeight: 128, background: imagePreview ? '#fafafa' : undefined }}
                            onClick={handlePreviewClick}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-h-32 object-contain rounded"
                                    style={{ maxWidth: '100%' }}
                                />
                            ) : (
                                <span className="text-gray-400 text-sm text-center w-full select-none">
                                    Click to upload image
                                </span>
                            )}
                        </div>
                        {uploadImageMutation.status === "error" && (
                            <span className="text-xs text-red-500">Image upload failed</span>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="price">Price (NPR)</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0.01"
                            {...register("price")}
                            placeholder="e.g. 999.99"
                        />
                        {typeof errors.price?.message === "string" && (
                            <span className="text-xs text-red-500">{errors.price.message}</span>
                        )}
                    </div>
                    <div className="flex items-center space-x-6">
                        <div>
                            <Label htmlFor="inStock" className="inline-flex items-center space-x-2">
                                <input
                                    id="inStock"
                                    type="checkbox"
                                    {...register("inStock")}
                                    defaultChecked
                                    className="mr-2"
                                />
                                <span>In Stock</span>
                            </Label>
                        </div>
                        <div>
                            <Label htmlFor="bestseller" className="inline-flex items-center space-x-2">
                                <input
                                    id="bestseller"
                                    type="checkbox"
                                    {...register("bestseller")}
                                    className="mr-2"
                                />
                                <span>Bestseller</span>
                            </Label>
                        </div>
                        <div>
                            <Label htmlFor="newArrival" className="inline-flex items-center space-x-2">
                                <input
                                    id="newArrival"
                                    type="checkbox"
                                    {...register("newArrival")}
                                    className="mr-2"
                                />
                                <span>New Arrival</span>
                            </Label>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="description">
                            Description <span className="text-xs text-gray-400">(optional)</span>
                        </Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Description of the product"
                            rows={3}
                        />
                        {typeof errors.description?.message === "string" && (
                            <span className="text-xs text-red-500">{errors.description.message}</span>
                        )}
                    </div>
                    <DialogFooter className="mt-4">
                        <Button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                uploadImageMutation.status === "pending" ||
                                updateClothesMutation.status === "pending"
                            }
                        >
                            {uploadImageMutation.status === "pending" ||
                            updateClothesMutation.status === "pending"
                                ? "Processing..."
                                : "Save Changes"}
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">
                                Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
            <Toaster position="top-center" />
        </Dialog>
    );
}
