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
          <div className="container px-0 md:px-8 h-[calc(100dvh)] flex-1">
            <div className="flex-1 md:grid md:grid-cols-[180px_1fr] md:gap-6 lg:grid-cols-[200px_1fr] lg:gap-10">
              {/* content */}
              <div>
                <div className="relative lg:gap-10 lg:py-10 md:grid md:grid-cols-[1fr_40px] gap-4 min-w-0">
                  <div className="px-4 md:px-auto w-full min-w-0">
                    <div className="sticky z-40 top-0 py-4 mb-4 flex justify-end items-center bg-secondary gap-2 md:hidden">
                      <div
                        onClick={() => {
                          setOpen(false);
                        }}
                        className="p-1 h-fit w-fit border-2 border-white/50 text-white/50 hover:border-white/80 hover:text-white/80 bg-transparent rounded-full cursor-pointer"
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
                        className="p-1 h-fit w-fit border-2 border-white/50 text-white/50 hover:border-white/80 hover:text-white/80 bg-transparent rounded-full cursor-pointer"
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
