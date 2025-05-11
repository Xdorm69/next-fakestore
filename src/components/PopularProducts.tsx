import React from "react";
import Image from "next/image";
import { motion } from "motion/react";

export type PopularCardData = {
  id: number;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  discount?: number;
  image: string;
};

const data: PopularCardData[] = [
  {
    id: 1,
    name: "TSS Originals: Cinnamon",
    category: "Polo",
    price: 1199,
    image: "image1.jpg",
  },
  {
    id: 2,
    name: "Denim: Granite Grey (Straight Fit)",
    category: "Jeans",
    price: 2099,
    original_price: 2499,
    discount: 400,
    image: "image2.jpg",
  },
  {
    id: 3,
    name: "Deadpool: Iconic",
    category: "Backpacks",
    price: 2999,
    image: "image3.jpg",
  },
  {
    id: 4,
    name: "Jungle Book: Into The Wild",
    category: "Shirts",
    price: 1699,
    image: "image4.jpg",
  },
];

const PopularProducts = () => {
  const variants = {
    showUp: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
      },
    }),
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
      {data.map((item, id) => (
        <motion.div
          key={item.id}
          whileInView={"showUp"}
          variants={variants}
          viewport={{ once: true }}
          custom={id}
          initial={{ opacity: 0, y: 200 }}
        >
          <PopularCard data={item} />
        </motion.div>
      ))}
    </div>
  );
};

export default PopularProducts;

const PopularCard = ({ data }: { data: PopularCardData }) => {
  return (
    <div className="rounded-lg h-fit shadow overflow-hidden relative bg-white py-2 px-2">
      <Image
        src={`/top/${data.id}.webp`}
        alt={"img" + data.id}
        width={200}
        height={600}
        className="w-full h-full object-cover"
      />
      <h1 className="text-lg text-secondary-foreground/70 font-semibold">
        {data.name}
      </h1>
      <div className="border-1 border-t w-full border-black/10" />
      <p className="text-sm">{data.category}</p>
      <h3 className="text-secondary-foreground font-semibold">
        $ {data.price}
        {data.original_price && (
          <span className="line-through text-gray-400 ml-2">
            ${data.original_price}
          </span>
        )}
        {data.discount && (
          <span className="text-green-600 ml-2">({data.discount} off)</span>
        )}
      </h3>
    </div>
  );
};
