"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import Carousel from "@/components/Carousel";
import Title from "@/components/Title";
import PopularProducts from "@/components/PopularProducts";

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
    <div className="w-full mb-10 min-h-[150vh]">
      <div className="container mx-auto">
        {/* SEARCHBAR  */}
        <div className="flex w-full my-2 mb-12 items-center justify-center gap-5">
          <Input
            type="text"
            placeholder="Enter your search query eg: Mens"
            className="w-1/2 py-6 text-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="text-md text-white py-6" onClick={pushQuery}>
            <Search className="w-8 h-8 " />
            Search
          </Button>
        </div>

        <Carousel />

        {/* PRODUCTS  */}

        <Title title={"Top Products"} icon={"📈"} />
        <PopularProducts />

        
        
        <Title title={"All Products"} icon={"😍"} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
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
