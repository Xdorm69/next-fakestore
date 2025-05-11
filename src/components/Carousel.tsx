import Image from "next/image";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const CarouselImgs = [
  "/carouselImgs/Batman-clog-2.webp",
  "/carouselImgs/App_banner_copy_1_eItFlOw.webp",
  "/carouselImgs/app-banner_M3zRal7.webp",
  "/carouselImgs/Final_polos_app_banner.webp",
  "/carouselImgs/Home_Page_Banner_kCXpaRx.webp",
  "/carouselImgs/Joggers-app-banner-1_Tm43Nyo.webp",
];

const Carousel = () => {
  const [imgIndex, setImgIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const len = CarouselImgs.length;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (dir: "i" | "d") => {
      if (dir === "i") {
        setDirection(1);
        setImgIndex((prev) => (prev + 1) % len);
      } else if (dir === "d") {
        setDirection(-1);
        setImgIndex((prev) => (prev === 0 ? len - 1 : prev - 1));
      }
    },
    [len]
  );

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      handleChange("i");
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [handleChange]);

  const slideVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      transition: {
        x: { type: "tween", duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="w-full h-[57vh] shadow-xl rounded-xl bg-background relative overflow-hidden">
      {/* Left button */}
      <div className="absolute left-7 top-1/2 -translate-y-1/2 z-10">
        <Button variant="outline" onClick={() => handleChange("d")}>
          <ChevronLeft className="text-primary-foreground" />
        </Button>
      </div>

      {/* Image */}
      <div className="h-full w-full relative">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={imgIndex}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute w-full h-full"
          >
            <Image
              src={CarouselImgs[imgIndex]}
              alt={`Carousel image ${imgIndex + 1}`}
              fill
              className="object-cover object-center"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <Dots imgIndex={imgIndex} len={len} />
      </div>

      {/* Right button */}
      <div className="absolute right-7 top-1/2 -translate-y-1/2 z-10">
        <Button variant="outline" onClick={() => handleChange("i")}>
          <ChevronRight className="text-primary-foreground" />
        </Button>
      </div>
    </div>
  );
};

export default Carousel;

const Dots = ({ imgIndex, len }: { imgIndex: number; len: number }) => {
  const animationVariant = {
    initial: { scale: 0.5, opacity: 0.5 },
    active: {
      scale: 1.1,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="flex gap-2 items-center">
      {Array.from({ length: len }).map((_, id) => (
        <motion.div
          key={`dot-${id}`}
          variants={animationVariant}
          initial="initial"
          animate={imgIndex === id ? "active" : "initial"}
          className={cn(
            "w-3 h-3 rounded-full transition-all duration-300 ease-in-out cursor-pointer",
            imgIndex === id
              ? "bg-primary opacity-100"
              : "bg-muted-foreground opacity-50 hover:opacity-75"
          )}
        />
      ))}
    </div>
  );
};
