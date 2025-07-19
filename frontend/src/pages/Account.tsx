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
      {/* Order History */}
      {/* Order History */}
      {/* Order History */}
      <div className="mt-12 flex flex-col items-center">
        <h2 className="text-2xl font-bold font-sans tracking-tight mb-6 text-gray-900 text-center">
          Order History
        </h2>
        <ScrollArea className="rounded-2xl border bg-white shadow-sm overflow-x-auto w-full max-w-5xl">
          <div className="min-w-[900px]">
            {/* Table Header */}
            <div className="grid grid-cols-[60px_72px_2.2fr_1fr_1fr_1.3fr] text-base font-bold font-sans tracking-wide bg-gray-900 text-white px-6 py-4 rounded-t-2xl">
              <div className="text-center">#</div>
              <div className="text-center">Image</div>
              <div className="text-left">Product</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Total (₨)</div>
              <div className="text-center">Status</div>
            </div>

            {flatOrderRows.length > 0 ? (
              flatOrderRows.map((row: any) => (
                <div
                  key={row.key}
                  className={`grid grid-cols-[60px_72px_2.2fr_1fr_1fr_1.3fr] items-center px-6 py-4 border-b border-gray-100 ${row.rowClass
                    }`}
                  style={{
                    fontFamily: "Inter, Montserrat, Helvetica Neue, Arial, sans-serif"
                  }}
                >
                  {/* # */}
                  <div className="font-semibold text-gray-700 text-center">
                    {row.index}
                  </div>
                  {/* Image */}
                  <div className="flex justify-center">
                    <img
                      src={row.image}
                      alt="Product"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/48x48?text=No+Image";
                      }}
                      className="w-12 h-12 object-cover rounded shadow"
                      style={{
                        border: "1.5px solid #e5e7eb",
                        background: "#f9fafb"
                      }}
                    />
                  </div>
                  {/* Name (left aligned, bold) */}
                  <div className="font-bold text-gray-800 text-left">{row.name}</div>
                  {/* Quantity */}
                  <div className="font-bold text-gray-800 text-center">
                    {row.quantity}
                  </div>
                  {/* Total */}
                  <div className="font-bold text-gray-900 text-center">
                    ₨ {row.total}
                  </div>
                  {/* Status and Cancel button */}
                  <div className="flex items-center gap-2 justify-center">
                    <span
                      className={`font-bold px-2 py-1 rounded text-center ${row.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : row.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : row.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      style={{ fontFamily: "inherit" }}
                    >
                      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                    {row.status === "pending" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelOrder(row.orderId)}
                        disabled={cancelOrderMutation.isPending}
                        className="font-semibold tracking-wide"
                        style={{
                          fontFamily: "inherit",
                          letterSpacing: ".02em"
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10 text-lg font-medium font-sans">
                No orders found.
              </div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
