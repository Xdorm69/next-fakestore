"use client";
import { DATA } from "@/app/page";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "./ui/skeleton";

import { AddToCartPropType, AddtoCart } from "@/actions/post-add-cart";
import BuyNow from "./BuyNow";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

export const ProductCard = ({ data }: { data: DATA }) => {
  const AddToCartMutate = useMutation({
    mutationKey: ["cart"],
    mutationFn: (data: AddToCartPropType) => {
      toast.loading("Adding to cart", { id: "cart" });
      const res = AddtoCart(data);
      return res;
    },
    onSuccess: () => {
      toast.success("Added to cart successfully", { id: "cart" });
    },
    onError: (error) => {
      toast.error(`${error}`, { id: "cart" });
    },
  });

  const handleAddToCart = (data: DATA) => {
    const filData: AddToCartPropType = {
      productId: data.id.toString(),
      quantity: 1,
      totalPrice: data.price,
    };
    AddToCartMutate.mutate(filData);
  };

  const [btnHover, setBtnHover] = useState<boolean>(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <Card className="flex flex-col items-center shadow-xl gap-2 justify-between">
        <CardHeader className="w-full flex flex-col">
          <div className="w-full bg-white flex items-center justify-center rounded-lg shadow p-3">
            <Image
              src={data.image}
              alt={data.title}
              width={200}
              height={200}
              className="object-contain h-48 w-48"
            />
          </div>
          <CardTitle className="text-center w-full mt-3 text-xl">
            {data.title.length > 20
              ? data.title.slice(0, 20) + "..."
              : data.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
            mollitia, quae quidem, quas, porro quibusdam, voluptas, dolore...
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between w-full mt-5">
          <p className="text-primary-foreground font-bold">
            ${data.price.toFixed(2)}
          </p>
          <div className="flex gap-3">
            <Button
              variant={"outline"}
              onClick={() => handleAddToCart(data)}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              className="text-muted-foreground shadow"
            >
              <motion.div
              className="w-full h-full"
              
                animate={btnHover ? { rotate: 360 } : {rotate: 0}}
                transition={{ duration: 0.4 }}
              >
                <ShoppingBag className="w-5 h-5" />
              </motion.div>
            </Button>
            <BuyNow data={data} />
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
      <Skeleton className="h-48 w-48 mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-5 w-1/2" />
    </div>
  );
};
