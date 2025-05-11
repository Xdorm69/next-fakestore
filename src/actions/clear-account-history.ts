"use server";

import prisma from "@/lib/ConnectDb";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function ClearAccountHistory() {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  await prisma.buyHistory.deleteMany({ where: { userId: user.id } });
  return {status: 200};
}
