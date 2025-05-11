import prisma from "@/lib/ConnectDb";
import { currentUser } from "@clerk/nextjs/server";
import { Decimal } from "@prisma/client/runtime/library";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { PaymentStatusType } from "../products-payment-history/route";
import { PaymentMethodType } from "@/actions/post-buy-history";
import { DATA } from "@/app/page";

export type CartDataType = {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  orderPlacedAt: Date;
  totalPrice: number | Decimal;
  paymentStatus: PaymentStatusType;
  paymentMethod: PaymentMethodType;
};

export type CartDataTypeForClient = {
  id: string;
  userId: string;
  productId: string;
  image: string;
  quantity: number;
  orderPlacedAt: Date;
  totalPrice: number | Decimal;
  gst: number;
  shipping: number;
  paymentStatus: PaymentStatusType;
  paymentMethod: PaymentMethodType;
};

export type CartSumAggregates = {
  sumTotalPrice: number;
  sumGst: number;
  sumQuantity: number;
  sumShipping: number;
};

  
  export type FinalCartResultSentToClientType = {
    data: CartDataTypeForClient[];
    sumObj: CartSumAggregates;
  };

export async function GET(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  const CartData: CartDataType[] = await prisma.cart.findMany({
    where: {
      userId: user.id,
    },
  });

  const sumAggregates = await prisma.cart.aggregate({
    _sum: {
      quantity: true,
      totalPrice: true,
    },
    where: {
      userId: user.id,
    },
  });

  const orgData : DATA[] = await fetch("https://fakestoreapi.com/products").then(res => res.json());

  const ModCartData = CartData.map((item) => {
    const matchingProduct = orgData.find(
      (product) => product.id === Number(item.productId)
    );

    return {
      ...item,
      image: matchingProduct?.image || "",
      title: matchingProduct?.title || "",
    };
  });

  const exObj: CartDataTypeForClient[] = ModCartData.map((item) => {
    const totalPrice = Number(item.totalPrice);
    return {
      ...item,
      totalPrice: totalPrice,
      gst: item.quantity * totalPrice * 0.18,
      shipping: totalPrice * 0.02,
    };
  });

  const sumObj: CartSumAggregates = {
    sumGst: exObj.reduce((acc, item) => acc + item.gst, 0),
    sumShipping: Number(sumAggregates._sum.totalPrice || 0) * 0.02,
    sumTotalPrice: Number(exObj.reduce((acc, item) => (item.quantity * Number(item.totalPrice) + item.gst + item.shipping) + acc, 0)) || 0,
    sumQuantity: sumAggregates._sum.quantity || 0,
  };

  const sendingObj: FinalCartResultSentToClientType = {data: exObj, sumObj: sumObj}

  return NextResponse.json(sendingObj, { status: 200 });
}
