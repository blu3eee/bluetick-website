import { Icons } from "@/components/icons";
import React from "react";
import FullScreenPopover from "@/components/custom-ui/full-popover";

interface Props {
  className?: string;
  children: React.ReactNode;
}

const PopoverMobileNav: React.FC<Props> = ({ className, children }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      {/* trigger */}
      <div
        className="cursor-pointer"
        onClick={() => {
          setOpen(true);
        }}
      >
        {children}
      </div>
      {/* Full-screen popover content */}
      {open && (
        <FullScreenPopover isOpen={open} className="overflow-y-auto">
          <div className="container h-[calc(100dvh)] flex-1 px-0 md:px-8">
            <div className="flex-1 md:grid md:grid-cols-[180px_1fr] md:gap-6 lg:grid-cols-[200px_1fr] lg:gap-10">
              {/* content */}
              <div>
                <div className="relative min-w-0 gap-4 md:grid md:grid-cols-[1fr_40px] lg:gap-10 lg:py-10">
                  <div className="md:px-auto w-full min-w-0 px-4">
                    <div className="sticky top-0 z-40 mb-4 flex items-center justify-end gap-2 bg-secondary py-4 md:hidden">
                      <div
                        onClick={() => {
                          setOpen(false);
                        }}
                        className="h-fit w-fit cursor-pointer rounded-full border-2 border-white/50 bg-transparent p-1 text-white/50 hover:border-white/80 hover:text-white/80"
                      >
                        <Icons.close size={20} />
                      </div>
                    </div>
                    content here
                  </div>
                  <div className="hidden text-sm md:block">
                    <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
                      <div
                        onClick={() => {
                          setOpen(false);
                        }}
                        className="h-fit w-fit cursor-pointer rounded-full border-2 border-white/50 bg-transparent p-1 text-white/50 hover:border-white/80 hover:text-white/80"
                      >
                        <Icons.close size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FullScreenPopover>
      )}
    </div>
  );
};

export default PopoverMobileNav;
