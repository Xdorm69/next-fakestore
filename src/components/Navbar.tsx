import Link from "next/link";
import React from "react";
import{
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ModeToggle } from "./ui/ThemeChange";

const links = [
  { href: "/", label: "Home" },
  { href: "/cart", label: "Cart" },
  { href: "/account", label: "Account" },
];

const Navbar = () => {
  return (
    <nav className="py-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link href={"/"} className="font-semibold text-2xl">
            FakeStore
          </Link>
          <ul className="flex gap-5">
            {links.map((i, index) => (
              <li key={index}>
                <Link
                  href={i.href}
                  className="opacity-60 hover:opacity-100 transition"
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-5 items-center">
            <div>
              <SignedOut>
                <div className="px-3 py-1 rounded-lg shadow border-1 border-foreground/20 hover:border-foreground/40 transition">
                  <SignInButton />
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>

            <div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
