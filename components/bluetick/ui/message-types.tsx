import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";

interface MessageTypesRadioGroupProps {
  onValueChange: (newValue: string) => void;
  initType: string;
}

const MessageTypesRadioGroup: React.FC<MessageTypesRadioGroupProps> = ({
  onValueChange,
  initType,
}) => {
  return (
    <RadioGroup
      onValueChange={(value) => {
        onValueChange(value);
      }}
      defaultValue={initType}
      className="flex flex-wrap gap-4 mt-4 justify-between"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="Message"
          id="Message"
          className="text-green-500"
        />
        <Label htmlFor="Message">Message</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="Embed" id="Embed" />
        <Label htmlFor="Embed">Embed</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="Embed and Text" id="Embed and Text" />
        <Label htmlFor="Embed and Text">Embed and Text</Label>
      </div>
    </RadioGroup>
  );
};

export default MessageTypesRadioGroup;
