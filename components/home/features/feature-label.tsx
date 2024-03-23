import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { poppinsFont } from '@/styles/fonts';
import React from 'react';

const FeatureLabel: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Label
      className={cn(
        'text-info text-3xl font-semibold text-center',
        poppinsFont.className
      )}
    >
      {text}
    </Label>
  );
};

export default FeatureLabel;
