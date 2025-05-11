"use server";
import prisma from "@/lib/ConnectDb";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function ClearCart() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const countItems = await prisma.cart.count({ where: { userId: user.id } });
  if (!countItems) {
    throw new Error("No items in cart");
  }
  await prisma.cart.deleteMany({ where: { userId: user.id } });
  return { res: "All delete success", status: 200 };
}
