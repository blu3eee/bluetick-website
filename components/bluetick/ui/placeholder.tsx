import React from 'react';
import { Icons } from '@/components/icons';
import { Label } from '@radix-ui/react-dropdown-menu';

export interface PlaceholderProps {
  name: string;
  description: string;
  example?: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({
  name,
  description,
  example,
}): JSX.Element => {
  const placeholderStyle = {
    color: '#c1234f',
    fontFamily: 'monospace',
  };

  return (
    <div>
      <span style={placeholderStyle}>{name}</span> - {description}{' '}
      {example && (
        <>
          Eg: <span style={placeholderStyle}>{example}</span>
        </>
      )}
    </div>
  );
};

interface PlaceholdersHelpBoxProps {
  placeholders: PlaceholderProps[];
}

export const PlaceholdersHelpBox: React.FC<PlaceholdersHelpBoxProps> = ({
  placeholders,
}): JSX.Element => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-[#c1234f]">
        <Icons.help />
        <Label className="uppercase">Help</Label>
      </div>
      <div className="text-[12px] font-semibold">
        You can use these variables in the message boxes above.
      </div>
      <div className="flex flex-col gap-1">
        {placeholders.map((p, index) => (
          <Placeholder key={index} {...p} />
        ))}
      </div>
    </div>
  );
};
