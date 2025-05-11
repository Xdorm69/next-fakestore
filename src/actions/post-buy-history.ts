"use server";
import { FormDataType } from "@/app/page";
import prisma from "@/lib/ConnectDb";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type PaymentMethodType = "UPI" | "CASH" | "CARD";

export type PostBuyForm = {
  FormData: FormDataType;
  productId: string;
  price: number;
  paymentMethod: PaymentMethodType;
};

export async function PostBuyHistory(data: PostBuyForm) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  await prisma.buyHistory.create({
    data: {
      userId: user.id,
      quantity: 1,
      name: data.FormData.name,
      address: data.FormData.address,
      email: data.FormData.email,
      productId: data.productId,
      price: data.price,
      paymentStatus: "PAID",
      paymentMethod: data.paymentMethod,
    },
  });

  return { status: 200 };
}
