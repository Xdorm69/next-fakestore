"use server";
import { CartDataType } from "@/app/api/get-cart-data/route";
import prisma from "@/lib/ConnectDb";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PostBuyForm } from "./post-buy-history";
import { revalidatePath } from "next/cache";

export async function BuyWholeCart(data: PostBuyForm) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  const CartData: CartDataType[] = await prisma.cart.findMany({
    where: {
      userId: user.id,
    },
  });

  if (CartData.length === 0) {
    throw new Error("No items in cart");
  }

  await prisma.$transaction(async (tx) => {
    const buyHistoryEntries = CartData.map((item) => ({
      userId: user.id,
      productId: item.productId,
      quantity: item.quantity,
      address: data.FormData.address,
      name: data.FormData.name,
      email: data.FormData.email,
      price: item.totalPrice,
      paymentStatus: "PAID" as const,
      paymentMethod: data.paymentMethod as "CARD" | "UPI" | "CASH",
    }));

    await tx.buyHistory.createMany({
      data: buyHistoryEntries,
    });

    // Clear the cart after purchase
    await tx.cart.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return { status: 200 };
  });
  revalidatePath("/cart", "page");
  return {status: 200};
}
