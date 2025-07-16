import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/useUser";
import { useUploadImage } from "@/hooks/useImage";
import { useOrder } from "@/hooks/useOrder";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email(),
  bio: z.string().max(300, "Bio must be under 300 characters").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AccountPage() {
  const { user, setUser } = useAuth();
  const { patchSelfMutation } = useUser();
  const uploadImageMutation = useUploadImage();
  const { userOrdersQuery, cancelOrder: cancelOrderMutation } = useOrder();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.image || "");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  });

  if (!user) return <div>Loading user data...</div>;

  const onSubmit = async (data: FormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const updatedUser = await patchSelfMutation.mutateAsync(data);
      setUser(updatedUser.user);
      localStorage.setItem("user", JSON.stringify(updatedUser.user));
      setSuccessMessage("Profile updated successfully.");
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.error || err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = /^image\/(png|jpe?g|webp)$/i.test(file.type);
    const under5MB = file.size <= 5 * 1024 * 1024;

    if (!isImg || !under5MB) {
      setErrorMessage("Only PNG/JPEG/WEBP up to 5 MB are allowed.");
      return;
    }

    try {
      const imageUrl = await uploadImageMutation.mutateAsync(file);
      setImagePreview(imageUrl);

      const patchData = {
        username: getValues("username"),
        email: getValues("email"),
        bio: getValues("bio"),
        image: imageUrl,
      };

      const updatedUser = await patchSelfMutation.mutateAsync(patchData);
      setUser(updatedUser.user);
      localStorage.setItem("user", JSON.stringify(updatedUser.user));
      setSuccessMessage("Profile picture updated.");
    } catch (err: any) {
      setErrorMessage(err.message || "Image upload failed.");
    }
  };

  const handleToggleMfa = async () => {
    try {
      const updatedUser = await patchSelfMutation.mutateAsync({
        mfaEnabled: !user.mfaEnabled,
      });
      setUser(updatedUser.user);
      localStorage.setItem("user", JSON.stringify(updatedUser.user));
      setSuccessMessage(updatedUser.user.mfaEnabled ? "MFA enabled." : "MFA disabled.");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to toggle MFA.");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrderMutation.mutateAsync(orderId);
      setSuccessMessage("Order cancelled successfully.");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to cancel order.");
    }
  };

  const userOrders = userOrdersQuery?.data?.orders || [];

  const flatOrderRows = userOrders.flatMap((order: any, i: number) => {
    if (!Array.isArray(order.items)) return [];

    return order.items.map((entry: any, j: number) => {
      const product = entry.item || {};
      const imagePath = product.imagePath || "https://via.placeholder.com/48x48?text=No+Image";

      return {
        key: `${order._id}_${j}`,
        orderId: order._id,
        index: i + j + 1,
        name: product.name || "-",
        image: imagePath,
        quantity: entry.quantity || 0,
        total: typeof order.total === "object" ? order.total?.$numberDecimal : order.total,
        status: order.status || "-",
        rowClass: (i + j) % 2 === 0 ? "bg-white" : "bg-gray-50",
      };
    });
  });

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="w-full lg:w-1/4 flex flex-col items-center text-center space-y-2">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
            <div className="cursor-pointer group" onClick={handleAvatarClick}>
              <img
                src={imagePreview}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border group-hover:opacity-80 transition"
              />
              <span className="text-xs text-gray-500 mt-1">Change</span>
            </div>
            <div className="text-base font-semibold">{user.username}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
            <div className="pt-4">
              <Button size="sm" variant="outline" onClick={handleToggleMfa}>
                {user.mfaEnabled ? "Disable MFA" : "Enable MFA"}
              </Button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full lg:w-3/4 space-y-4 text-sm"
            noValidate
          >
            <div>
              <label className="block mb-1 font-medium">Username</label>
              <Input {...register("username")} autoComplete="username" />
              {errors.username && <p className="text-red-600">{errors.username.message}</p>}
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input type="email" {...register("email")} autoComplete="email" />
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block mb-1 font-medium">Bio</label>
              <Textarea {...register("bio")} rows={3} autoComplete="off" />
              {errors.bio && <p className="text-red-600">{errors.bio.message}</p>}
            </div>
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            <div className="text-right pt-2">
              <Button size="sm" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Orders Table */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">My Orders</h2>
        <ScrollArea className="rounded-2xl border bg-white shadow-md overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[60px_1.5fr_1.5fr_1fr_1fr_1fr] text-sm font-semibold bg-black text-white px-5 py-3 rounded-t-2xl">
              <div>#</div>
              <div>Name</div>
              <div>Image</div>
              <div>Qty</div>
              <div>Total</div>
              <div>Status</div>
            </div>

            {flatOrderRows.length > 0 ? (
              flatOrderRows.map((row:any) => (
                <div
                  key={row.key}
                  className={`grid grid-cols-[60px_1.5fr_1.5fr_1fr_1fr_1fr] items-center px-5 py-3 border-b border-gray-200 ${row.rowClass}`}
                >
                  <div>{row.index}</div>
                  <div>{row.name}</div>
                  <div>
                    <img
                      src={row.image}
                      alt="Product"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/48x48?text=No+Image";
                      }}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </div>
                  <div>{row.quantity}</div>
                  <div>₨ {row.total}</div>
                  <div className="flex items-center gap-2">
                    <span>{row.status}</span>
                    {row.status === "pending" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelOrder(row.orderId)}
                        disabled={cancelOrderMutation.isPending}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">No orders found.</div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
