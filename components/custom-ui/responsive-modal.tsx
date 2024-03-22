// responsive-modal.tsx
import React, { createContext, useContext, useMemo } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

interface BaseProps {
  children: React.ReactNode;
}

interface RootModalProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ModalProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const ResponsiveModalContext = createContext({ isDesktop: true });

const ResponsiveModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const value = useMemo(() => ({ isDesktop }), [isDesktop]);
  return (
    <ResponsiveModalContext.Provider value={value}>
      {children}
    </ResponsiveModalContext.Provider>
  );
};

const ResponsiveModal: React.FC<RootModalProps> = ({ children, ...props }) => {
  return (
    <ResponsiveModalProvider>
      <ResponsiveModalComponent {...props}>{children}</ResponsiveModalComponent>
    </ResponsiveModalProvider>
  );
};

const ResponsiveModalComponent: React.FC<RootModalProps> = ({
  children,
  open,
  onOpenChange,
  ...props
}) => {
  const { isDesktop } = useContext(ResponsiveModalContext);
  const ModalComponent = isDesktop ? Dialog : Drawer;
  return (
    <ModalComponent {...props} open={open} onOpenChange={onOpenChange}>
      {children}
    </ModalComponent>
  );
};

const ResponsiveModalTrigger: React.FC<ModalProps> = ({
  children,
  className,
  ...props
}) => {
  const { isDesktop } = useContext(ResponsiveModalContext);
  const ModalTrigger = isDesktop ? DialogTrigger : DrawerTrigger;
  return (
    <ModalTrigger className={className} {...props}>
      {children}
    </ModalTrigger>
  );
};

const ResponsiveModalContent: React.FC<ModalProps> = ({
  children,
  className,
  ...props
}) => {
  const { isDesktop } = useContext(ResponsiveModalContext);
  const ModalContent = isDesktop ? DialogContent : DrawerContent;
  return (
    <ModalContent className={cn(className)} {...props}>
      {children}
    </ModalContent>
  );
};

const ResponsiveModalHeader: React.FC<ModalProps> = ({
  children,
  className,
  ...props
}) => {
  const { isDesktop } = useContext(ResponsiveModalContext);
  const ModalHeader = isDesktop ? DialogHeader : DrawerHeader;
  return (
    <ModalHeader className={className} {...props}>
      {children}
    </ModalHeader>
  );
};

const ResponsiveModalTitle: React.FC<ModalProps> = ({
  children,
  className,
  ...props
}) => {
  const { isDesktop } = useContext(ResponsiveModalContext);
  const ModalTitle = isDesktop ? DialogTitle : DrawerTitle;
  return (
    <ModalTitle className={className} {...props}>
      {children}
    </ModalTitle>
  );
};

const ResponsiveModalDescription: React.FC<ModalProps> = ({
  children,
  className,
  ...props
}) => {
  const { isDesktop } = useContext(ResponsiveModalContext);
  const ModalDescription = isDesktop ? DialogDescription : DrawerDescription;
  return (
    <ModalDescription className={className} {...props}>
      {children}
    </ModalDescription>
  );
};

const ResponsiveModalFooter: React.FC<ModalProps> = ({
  children,
  className,
  ...props
}) => {
  const { isDesktop } = useContext(ResponsiveModalContext);
  const ModalFooter = isDesktop ? DialogFooter : DrawerFooter;
  return (
    <ModalFooter className={className} {...props}>
      {children}
    </ModalFooter>
  );
};

const ResponsiveModalClose: React.FC<ModalProps> = ({
  children,
  className,
  ...props
}) => {
  const { isDesktop } = useContext(ResponsiveModalContext);
  const ModalClose = isDesktop ? DialogClose : DrawerClose;
  return (
    <ModalClose className={className} {...props}>
      {children}
    </ModalClose>
  );
};

export {
  ResponsiveModal,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
  ResponsiveModalTrigger,
  ResponsiveModalContent,
  ResponsiveModalFooter,
  ResponsiveModalClose,
};
