import { PaymentMethodType } from "@/actions/post-buy-history";
import prisma from "@/lib/ConnectDb";
import { currentUser } from "@clerk/nextjs/server";
import { Decimal } from "@prisma/client/runtime/library";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export type PaymentStatusType = "PAID" | "UNPAID" | "PENDING";

export type PaymentHistoryDataType = {
  orderId: string;
  createdAt: Date;
  productId: string;
  paymentStatus: PaymentStatusType;
  paymentMethod: PaymentMethodType;
  price: number;
};

export type BuyHistoryModelType = {
  id: string;
  quantity: number;
  userId: string;
  productId: string;
  address: string;
  name: string;
  email: string;
  price: Decimal;
  paymentStatus: PaymentStatusType;
  paymentMethod: PaymentMethodType;
  createdAt: Date;
};

export async function GET(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  const offset = (page - 1) * limit;

  const paymentHistory: BuyHistoryModelType[] =
    await prisma.buyHistory.findMany({
      skip: offset,
      take: limit,
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const totalCount = await prisma.buyHistory.count({
    where: { userId: user.id },
  });

  //   const exportObj: PaymentHistoryDataType[] = paymentHistory.map((history) => ({
  //     orderId: history.id,
  //     createdAt: history.createdAt,
  //     productId: history.productId,
  //     paymentStatus: history.paymentStatus,
  //     paymentMethod: history.paymentMethod,
  //     price: Number(history.price), // Convert Decimal to number
  //   }));

  return NextResponse.json(
    {
      paymentData: paymentHistory,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    },
    { status: 200 }
  );
}
