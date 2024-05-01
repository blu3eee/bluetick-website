import Link from "next/link";

import React from "react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  return (
    <Link
      href={href}
      passHref
      className={`group inline-flex h-9 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary-dark focus:outline-none`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
