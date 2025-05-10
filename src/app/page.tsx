"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export type DATA = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

const Page = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<DATA[]>([]);
  const [filteredData, setFilteredData] = useState<DATA[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const pushQuery = () => {
    if (searchQuery) {
      const filtered = data.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await fetch("https://fakestoreapi.com/products");
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      setData(data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full my-10 min-h-[150vh]">
      <div className="container mx-auto">
        {/* SEARCHBAR  */}
        <div className="flex w-full my-5 items-center justify-center gap-5">
          <Input
            type="text"
            placeholder="Search"
            className="w-1/2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={pushQuery}>
            <Search className="w-4 h-4" />
            Search
          </Button>
        </div>

        {/* PRODUCTS  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            : filteredData.length > 0
            ? filteredData.map((item: DATA) => (
                <ProductCard key={item.id} data={item} />
              ))
            : data?.map((item: DATA) => (
                <ProductCard key={item.id} data={item} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Page;

export type FormDataType = {
  name: string;
  email: string;
  address: string;
};

const ProductCard = ({ data }: { data: DATA }) => {
  const [open, setOpen] = useState<boolean>(false);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

    // If all validations pass
    console.log("Order Details:", formData);
    toast.success("Product bought successfully!");

    // Optional: Reset form or close dialog
    setFormData({
      name: "",
      email: "",
      address: "",
    });

    setOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-2 p-4 border rounded-lg shadow-sm shadow-foreground justify-between">
      <Image
        src={data.image}
        alt={data.title}
        width={200}
        height={200}
        className="object-contain h-48 w-48"
      />
      <h2 className="text-lg font-semibold text-center">{data.title}</h2>
      <div className="flex items-center justify-between w-full">
        <p className="text-primary font-bold">${data.price.toFixed(2)}</p>
        <div className="flex gap-3">
          <Button variant={"outline"} className="text-muted-foreground">
            Add to Cart
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Buy Now</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buy Now</DialogTitle>
                <DialogDescription>
                  click but now to buy the product now.
                </DialogDescription>
              </DialogHeader>
              <div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <Button type="submit">Buy now</Button>
                </form>
              </div>
              <DialogFooter>
                you can view more products on our page
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
      <Skeleton className="h-48 w-48 mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-5 w-1/2" />
    </div>
  );
};
