import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Home, Info, Briefcase, Mail, ArrowRight } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ size?: number }>;
}


const menuItems: NavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/#about", icon: Info },
  { name: "Services", href: "/#services", icon: Briefcase },
  { name: "Contact", href: "/#contact", icon: Mail },
]

const HeaderLayout = () => {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-bold text-xl text-foreground hover:text-primary transition-colors">
          LOGO
        </Link>
        {/* Desktop Navigation Menu Items */}
        <nav className="hidden sm:block" aria-label="Main navigation">
          <ul className="flex space-x-16">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2 sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 flex flex-col gap-0">
              <SheetHeader className="border-b border-border pb-4">
                <SheetTitle className="text-foreground text-lg font-bold">Menu</SheetTitle>
              </SheetHeader>

              {/* Mobile Navigation Menu Items */}
              <nav className="flex-1 overflow-y-auto py-4" aria-label="Mobile navigation">
                <ul className="space-y-2 px-2">
                  {/* Main Navigation */}
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 group"
                      >
                        {item.icon && <div className="group-hover:scale-110 transition-transform"><item.icon size={18}/></div>}
                        <span className="flex-1 font-medium">{item.name}</span>
                        <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              {/* Bottom CTA Section */}
              <div className="border-t border-border pt-4 px-2">
                <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity rounded-lg py-6 font-semibold flex items-center gap-2 justify-center">
                  Get Started
                  <ArrowRight size={16} />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Button className="hidden sm:inline-flex" variant="default">
          Get Started
        </Button>
      </div>
    </header>
  );
};

export default HeaderLayout;
