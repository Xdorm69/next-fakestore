"use server";
import prisma from "@/lib/ConnectDb";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type AddToCartPropType = {
  productId: string;
  quantity: number;
  totalPrice: number;
};

export async function AddtoCart(data: AddToCartPropType) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  const len = await prisma.cart.count({
    where: {
      userId: user.id,
    },
  });

  if (len === 10) {
    throw new Error(
      "Cannot add any more items to the cart, max limit of 10 has reached"
    );
  }

  if (
    await prisma.cart.findFirst({
      where: { userId: user.id, productId: data.productId },
    })
  ){
    throw new Error("Product is already added to cart")
  }
    await prisma.cart.create({
      data: {
        userId: user.id,
        productId: data.productId,
        quantity: data.quantity,
        totalPrice: data.totalPrice,
      },
    });
  return { status: 200 };
}
