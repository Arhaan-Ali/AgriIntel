import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { Leaf } from "lucide-react";
import Link from "next/link";
import CustomAvatar from "@/components/custom-avatar";
import {
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

const HeaderLayout = () => {
  return (
    <header className="sticky top-0 z-100 w-full border-b border-border bg-background/80 backdrop-blur-sm shadow-inset transition-colors duration-300">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between py-4 px-4 sm:px-0">
        <Link
          href="/"
          className="font-bold text-2xl text-foreground hover:text-primary transition-colors"
        >
          <Leaf size={28} className="inline-block mr-4 text-primary" />
          LOGO
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <SignedOut>
            <Link href="/sign-in" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up" className="">
              <Button size="sm">Sign up</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <CustomAvatar />
          </SignedIn>

        </div>
      </div>
    </header>
  );
};

export default HeaderLayout;
