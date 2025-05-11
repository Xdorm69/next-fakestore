"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FinalCartResultSentToClientType } from "../api/get-cart-data/route";
import { Skeleton } from "@/components/ui/skeleton";
import { PostQuantityChange } from "@/actions/qunatity-change";
import { toast } from "sonner";
import { ClearCart } from "@/actions/clear-cart";
import Link from "next/link";
import Image from "next/image";
import BuyNow from "@/components/BuyNow";
import { DATA } from "../page";
import { randomUUID } from "crypto";

const CartPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const CartDataFetch = useQuery({
    queryKey: ["cart", "cart-data"],
    queryFn: async () => {
      const res = await fetch(`/api/get-cart-data`);
      const data: FinalCartResultSentToClientType = await res.json();
      console.log(data);
      return data;
    },
  });

  const queryClient = useQueryClient();

  const ClearCartQuery = useMutation({
    mutationKey: ["cart", "cart-data", "clear-cart"],
    mutationFn: async () => {
      toast.loading("Clearing cart", { id: "clear" });
      return ClearCart();
    },
    onSuccess: async () => {
      toast.success("Cart cleared", { id: "clear" });
      queryClient.invalidateQueries({
        queryKey: ["cart", "cart-data"],
      });
    },
    onError: (error) => {
      toast.error(`Failure in clearing cart ${error}`, { id: "clear" });
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const handleClearCart = () => {
    ClearCartQuery.mutate();
  };
  const BuyNowCartData: DATA = {
    id: 100,
    category: "All items of cart",
    description: "Form to proceed to buy all items in cart",
    image: "none",
    price: 0.001,
    title: "Buy form"
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Shipping</TableCell>
              <TableCell>GST</TableCell>
              <TableCell>Delivery</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Date</TableCell>
              <TableCell className="text-right">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CartDataFetch.isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              </TableRow>
            ) : CartDataFetch.isSuccess &&
              CartDataFetch.data.data.length > 0 ? (
              <FullTableComp fullData={CartDataFetch.data} />
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center font-semibold text-lg py-5"
                >
                  No items in cart, try adding items to your cart, visit{" "}
                  <Link className="text-blue-200 " href={"/"}>
                    home
                  </Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex gap-4 mt-5">
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button className="font-semibold" variant={"destructive"}>
                Clear Cart
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Warning</AlertDialogTitle>
                <AlertDialogDescription>
                  Once deleted this cart cannot be recovered
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={ClearCartQuery.isPending}
                  onClick={() => handleClearCart()}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <BuyNow data={BuyNowCartData}/>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

export type TableRowDataType = {
  image: string;
  cartId: string;
  productName: string;
  price: number;
  placedAt: string;
  quantity: number;
  gst: number;
  shipping: number;
};

const TableRowComp = ({
  data,
  isLoading = false,
}: {
  data: TableRowDataType;
  isLoading?: boolean;
}) => {
  const queryClient = useQueryClient();

  const QuantityChange = useMutation({
    mutationKey: ["cart", "quantity"],
    mutationFn: ({
      cartId,
      query,
    }: {
      cartId: string;
      query: "i" | "d" | "rem";
    }) => {
      toast.loading("Updating quantity", { id: "quantity" });
      return PostQuantityChange({ cartId, query });
    },
    onSuccess: () => {
      // Invalidate and refetch cart data
      toast.success("Value updated successfully", { id: "quantity" });
      queryClient.invalidateQueries({ queryKey: ["cart", "cart-data"] });
    },
    onError: (error) => {
      // Handle error (optional)
      toast.error(`Failed to update quantity, ${error}`, { id: "quantity" });
    },
  });

  const handleQuantityChange = (q: "i" | "d" | "rem") => {
    const obj = {
      cartId: data.cartId,
      query: q,
    };
    QuantityChange.mutate(obj);
  };

  if (isLoading) {
    return (
      <TableRow>
        <TableCell>
          <Skeleton className="h-10 w-full" />
        </TableCell>
        <TableCell>
          <div className="flex gap-2 items-center">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-10 w-10" />
          </div>
        </TableCell>
        <TableCell>
          <Skeleton className="h-10 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-10 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-10 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-10 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-10 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-10 w-full" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-10 w-10" />
        </TableCell>
      </TableRow>
    );
  }

  const price = data.price;
  const gst = price * 0.18 * data.quantity;
  const shipping = price * 0.02;

  return (
    <TableRow>
      <TableCell >
        <Image src={data.image} alt={data.productName} width={100} height={100} className="w-16 object-contain h-16 rounded-xl shadow" />
      </TableCell>
      <TableCell>
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => handleQuantityChange("d")}
            variant={"secondary"}
            disabled={data.quantity === 1 || QuantityChange.isPending}
          >
            <ChevronLeft />
          </Button>
          <h1 className="text-xl selection:none">{data.quantity}</h1>
          <Button
            onClick={() => handleQuantityChange("i")}
            variant={"secondary"}
            disabled={QuantityChange.isPending}
          >
            <ChevronRight />
          </Button>
        </div>
      </TableCell>
      <TableCell>${price}</TableCell>
      <TableCell>${Number(shipping.toFixed(2))}</TableCell>
      <TableCell>${Number(gst.toFixed(2))}</TableCell>
      <TableCell>1 d</TableCell>
      <TableCell>
        ${(price * data.quantity + gst + shipping).toFixed(2)}
      </TableCell>
      <TableCell>{data.placedAt}</TableCell>
      <TableCell className="text-right">
        <Button
          disabled={QuantityChange.isPending}
          onClick={() => handleQuantityChange("rem")}
          variant={"outline"}
        >
          <Trash className="text-red-500" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

const FullTableComp = ({
  fullData,
}: {
  fullData: FinalCartResultSentToClientType;
}) => {
  const rowData = fullData.data;
  const endRowData = fullData.sumObj;

  return (
    <>
      {rowData.map((item) => {
        const demoData: TableRowDataType = {
          image: item.image,
          cartId: item.id,
          price: Number(item.totalPrice.toFixed(2)),
          placedAt: new Date(item.orderPlacedAt).toLocaleDateString(),
          productName: item.productId,
          quantity: item.quantity,
          gst: item.gst,
          shipping: item.shipping,
        };
        return <TableRowComp key={item.id} data={demoData} />;
      })}
      {endRowData && (
        <TableRow className="bg-accent py-2 text-lg font-semibold">
          <TableCell colSpan={1}>Total</TableCell>
          <TableCell>{endRowData.sumQuantity}</TableCell>
          <TableCell></TableCell>
          <TableCell>${Number(endRowData.sumShipping).toFixed(2)}</TableCell>
          <TableCell>${Number(endRowData.sumGst).toFixed(2)}</TableCell>
          <TableCell></TableCell>
          <TableCell>${Number(endRowData.sumTotalPrice).toFixed(2)}</TableCell>
          <TableCell colSpan={2}></TableCell>
        </TableRow>
      )}
    </>
  );
};
