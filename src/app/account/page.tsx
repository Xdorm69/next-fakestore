"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BuyHistoryModelType } from "../api/products-payment-history/route";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCredType } from "../api/get-user-info/route";
import React from "react";
import { ClearAccountHistory } from "@/actions/clear-account-history";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";

export default function AccountPage() {
  const [page, setPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  const PaymentHistoryQuery = useQuery({
    queryKey: ["product-history", page],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/products-payment-history?page=${page}&limit=${ITEMS_PER_PAGE}`
        );

        if (!res.ok) {
          throw new Error(`HTTP Error! status: ${res.status}`);
        }

        const data: {
          paymentData: BuyHistoryModelType[];
          pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
          };
        } = await res.json();
        console.log(data);
        return data;
      } catch (error: any) {
        console.log(error.message);
        throw error;
      }
    },
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  const currentPage = PaymentHistoryQuery.data?.pagination.currentPage;
  const totalPages = PaymentHistoryQuery.data?.pagination.totalPages;

  const handlePageChange = (query: string) => {
    if (query === "i") {
      setPage((prev) => prev + 1);
    } else if (query === "d") {
      setPage((prev) => Math.max(1, prev - 1));
    }
  };

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const UserQuery = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/get-user-info");
      const data: UserCredType = await res.json();
      return data;
    },
    staleTime: 50000,
  });

  const queryClient = useQueryClient();

  const ClearQuery = useMutation({
    mutationKey: ["account", "account-info"],
    mutationFn: () => {
      toast.loading("Clearing account info", { id: "info" });
      const res = ClearAccountHistory();
      return res;
    },
    onSuccess: () => {
      toast.success("History cleared", { id: "info" });
    },
    onError: () => {
      toast.error("Error while clearing history", { id: "info" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["product-history"] });
    },
  });

  const handleClear = () => {
    ClearQuery.mutate();
  };

  return (
    <div className="container mx-auto p-4 min-h-screen my-10">
      <SignedIn>
        <div className="flex justify-between items-center my-5">
          <h1 className="text-3xl font-semibold">Your Purchase History</h1>

          <div className="flex gap-2 items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="text-lg font-semibold"
                  variant={"destructive"}
                >
                  Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete your purchase history.
                    This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClear}
                    className="bg-destructive text-destructive-foreground"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="text-lg font-semibold">Account Info</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Your Account Info</DialogTitle>
                  <DialogDescription>
                    Your account information
                  </DialogDescription>
                </DialogHeader>
                {UserQuery.isLoading ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 p-4">
                      {["Name", "Email", "Address", "Phone"].map((label) => (
                        <React.Fragment key={label}>
                          <Skeleton className="h-4 w-1/2 bg-gray-200" />
                          <Skeleton className="h-4 w-3/4 bg-gray-200" />
                        </React.Fragment>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-semibold">Name</div>
                      <div>
                        {UserQuery.data?.name.firstName}{" "}
                        {UserQuery.data?.name.lastName}
                      </div>
                      <div className="font-semibold">Email</div>
                      <div>{UserQuery.data?.email}</div>
                      <div className="font-semibold">Address</div>
                      <div>{UserQuery.data?.address || "Not set"}</div>
                    </div>
                  </>
                )}
                <DialogFooter>
                  <div className="flex flex-col items-end mt-5 gap-4">
                    <Button className="w-[80px] bg-emerald-500 hover:bg-emerald-400 text-white">
                      Update
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Do not worry you can later change these values if you want
                    </p>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">OrderId</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px]">Quantity</TableHead>
              <TableHead className="w-[100px]">Method</TableHead>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="w-[100px] text-center">
                View Details
              </TableHead>
              <TableHead className="text-right w-[100px]">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PaymentHistoryQuery.isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mx-auto"></div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4 ml-auto"></div>
                  </TableCell>
                </TableRow>
              ))}

            {PaymentHistoryQuery.isSuccess && (
              <>
                {PaymentHistoryQuery.data?.paymentData?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-gray-500 py-4"
                    >
                      No payment history found.
                    </TableCell>
                  </TableRow>
                ) : (
                  PaymentHistoryQuery.data?.paymentData?.map((order) => {
                    const safePrice = Number(order.price).toFixed(2);

                    return (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>
                          <span
                            className={`
                      px-2 py-1 rounded-full text-xs 
                      ${
                        order.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-800"
                          : order.paymentStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }
                    `}
                          >
                            {order.paymentStatus}
                          </span>
                        </TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.paymentMethod}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              {/* Dialog content remains the same */}
                              <DialogHeader>
                                <DialogTitle>Order Details:</DialogTitle>
                                <DialogDescription>
                                  Below are the details of your order
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4 p-4">
                                <div className="font-semibold">Order ID:</div>
                                <div>{order.id}</div>
                                <div className="font-semibold">Status:</div>
                                <div>
                                  <span
                                    className={`
                                      px-2 py-1 rounded-full text-xs 
                                      ${
                                        order.paymentStatus === "PAID"
                                          ? "bg-green-100 text-green-800"
                                          : order.paymentStatus === "PENDING"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                      }
                                    `}
                                  >
                                    {order.paymentStatus}
                                  </span>
                                </div>
                                <div className="font-semibold">Date:</div>
                                <div>
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleDateString()}
                                </div>
                                <div className="font-semibold">Price:</div>
                                <div>${Number(order.price).toFixed(2)}</div>
                                <div>Name:</div>
                                <div>{order.name}</div>
                                <div>Email:</div>
                                <div>{order.email}</div>
                                <div>Address:</div>
                                <div>{order.address}</div>
                              </div>
                              <DialogFooter>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Close
                                  </Button>
                                </DialogTrigger>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell className="text-right">
                          ${safePrice}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </>
            )}
          </TableBody>
        </Table>
        {PaymentHistoryQuery.isLoading ? (
          <div className="flex justify-center items-center mt-4 space-x-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        ) : (
          <div className="flex justify-center items-center mt-4 space-x-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => {
                handlePageChange("d");
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-semibold py-2 bg-background text-foreground px-2 rounded shadow">
              Page: {currentPage} / {totalPages}
            </div>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange("i")}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
          <p className="text-xl text-center">
            Please sign in to view your purchase history
          </p>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
}
