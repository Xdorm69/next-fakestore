import prisma from "@/lib/ConnectDb";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export type UserCredType = {
  userId: string;
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  address: string;
} | null;

export async function GET(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  let loggedUserCred = await prisma.user.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!loggedUserCred) {
    loggedUserCred = await prisma.user.create({
      data: {
        userId: user.id,
        name: {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
        },
        email: user.emailAddresses[0].emailAddress,
        address: "",
      },
    });

    loggedUserCred = await prisma.user.findFirst({
      where: {
        userId: user.id,
      },
    });

  }
  return NextResponse.json(loggedUserCred, { status: 200 });
}