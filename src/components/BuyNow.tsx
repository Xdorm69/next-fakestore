"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
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
} from "./ui/alert-dialog";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
const paymentMethods = [
  {
    value: "UPI",
    label: "UPI",
  },
  {
    value: "CASH",
    label: "Cash",
  },
  {
    value: "CARD",
    label: "Card",
  },
];
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { DATA, FormDataType } from "@/app/page";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  PaymentMethodType,
  PostBuyForm,
  PostBuyHistory,
} from "@/actions/post-buy-history";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { BuyWholeCart } from "@/actions/buy-full-cart";

const BuyNow = ({ data }: { data: DATA }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<PaymentMethodType | undefined>(undefined);
  const [openCombo, setOpenCombo] = useState<boolean>(false);
  const handleSubmit = (
    e: React.FormEvent,
    { pId, price }: { pId: string; price: number }
  ) => {
    e.preventDefault();

    // Validate name
    if (!formData.name || formData.name.trim().length < 2) {
      return toast.error("Please enter a valid name");
    }

    // Validate email using a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      return toast.error("Please enter a valid email address");
    }

    // Validate address
    if (!formData.address || formData.address.trim().length < 5) {
      return toast.error("Please enter a valid address");
    }

    if (!value) {
      return toast.error("Please enter a valid payment method");
    }

    const MutateBuyFormSendingData: PostBuyForm = {
      FormData: formData,
      price: price,
      productId: pId,
      paymentMethod: value,
    };

    mutate(MutateBuyFormSendingData);
  };
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["product-post"],
    mutationFn: (data: PostBuyForm) => {
      toast.loading("Sending data to database please wait paitiently", {
        id: "post",
      });

      if (data.price !== 0.001) {
        return PostBuyHistory(data);
      }
      return BuyWholeCart(data);
    },
    onSuccess: () => {
      toast.success("Data sent successfully", { id: "post" });
    },
    onError: () => {
      toast.error("An error occurred while sending data");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
        exact: false, // This will match partial query keys
      });

      // Reset form data
      setFormData({
        name: "",
        email: "",
        address: "",
      });

      setOpen(false);

      // Optional: Trigger a refetch of cart data
      queryClient.refetchQueries({
        queryKey: ["cart"],
        exact: false,
      });
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
          <Button className="text-white shadow font-semibold">Buy Now</Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-emerald-400 font-semibold text-2xl">
            Confirm Purchase
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to purchase {data.title} for $
            {data.price.toFixed(2)}?
          </DialogDescription>
        </DialogHeader>
        <div>
          <form
            id="purchase-form"
            onSubmit={(e) =>
              handleSubmit(e, {
                price: data.price,
                pId: data.id.toString(),
              })
            }
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="johndoe@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street, Anytown USA"
              />
            </div>

            {/* PAYMENT METHOD SWITER  */}
            <div className="flex flex-col gap-2 text-sm font-semibold ">
              <p>Select a payement method</p>
              <Popover open={openCombo} onOpenChange={setOpenCombo}>
                <PopoverTrigger
                  asChild
                  className="w-[200px] flex justify-between items-center"
                >
                  <Button variant="outline">
                    {value
                      ? paymentMethods.find((m) => m.value === value)?.label
                      : "Select payment method"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {paymentMethods.map((method) => (
                          <CommandItem
                            key={method.value}
                            value={method.value}
                            onSelect={(currentValue: string) => {
                              // Type assertion to ensure only valid payment methods are selected
                              const paymentValue =
                                currentValue as PaymentMethodType;
                              if (
                                paymentMethods.some(
                                  (m) => m.value === paymentValue
                                )
                              ) {
                                setValue(paymentValue);
                                setOpenCombo(false);
                              }
                            }}
                          >
                            {method.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                value === method.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </form>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isPending}
                className="bg-emerald-600 hover:bg-emerald-400 text-primary-foreground my-2 text-lg mt-6 w-full"
              >
                {isPending ? "Loading..." : "Buy Now"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will finalise your purchase. You will receive an
                  email with your receipt shortly.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit" form="purchase-form">
                  Submit
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <DialogFooter className="text-center text-xs text-muted-foreground">
          You can view more products on our page. Additionally, upon completing
          the purchase, you will receive an email with a receipt.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyNow;
