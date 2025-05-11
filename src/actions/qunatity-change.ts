"use server";

import prisma from "@/lib/ConnectDb";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function PostQuantityChange({
  cartId,
  query,
}: {
  cartId: string;
  query: "i" | "d" | "rem";
}) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  try {
    // First, verify the cart belongs to the current user
    const existingCart = await prisma.cart.findFirst({
      where: {
        id: cartId,
        userId: user.id,
      },
    });

    if (!existingCart) {
      throw new Error("Cart not found or unauthorized");
    }

    // Prevent quantity from going below 1
    if (query === "d" && existingCart.quantity <= 1) {
      return { error: "Quantity cannot be less than 1" };
    }

    else if (query === "rem"){
      await prisma.cart.delete({where:{
        id: cartId,
        userId: user.id,
      }})
      return {res: "Obj deleted", status: 200};
    }

    const updatedCart = await prisma.cart.update({
      where: {
        id: cartId,
        userId: user.id,
      },
      data: {
        quantity: query === "i" ? { increment: 1 } : { decrement: 1 },
      },
    });

    return {
      success: true,
      data: updatedCart,
    };

  } catch (error) {
    console.error("Quantity change error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
