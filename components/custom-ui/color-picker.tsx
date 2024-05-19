import React, { useCallback } from "react";
import { ColorPicker, type IColor, useColor } from "react-color-palette";
import "react-color-palette/css";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";

interface HexColorPickerProps {
  initColor: string;
  onColorChange: (newValue: string) => void;
}

export const HexColorPicker: React.FC<HexColorPickerProps> = ({
  initColor,
  onColorChange,
}) => {
  const [color, setColor] = useColor(initColor);

  const handleColorChange = useCallback(
    (newColor: IColor) => {
      setColor(newColor);
      onColorChange(newColor.hex);
    },
    [onColorChange, setColor],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex w-fit items-center gap-2">
          <div
            className="h-8 w-8 rounded-lg border border-2 p-[2px]"
            style={{
              borderColor: color.hex,
            }}
          >
            <div
              className={`h-full w-full rounded-md p-[2px]`}
              style={{
                backgroundColor: color.hex,
              }}
            ></div>
          </div>
          <Input
            placeholder="#ffffff"
            value={color.hex}
            className="w-fit"
            disabled
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ColorPicker
          hideInput={["rgb", "hsv"]}
          color={color}
          onChange={handleColorChange}
          hideAlpha={true}
        />
      </PopoverContent>
    </Popover>
  );
};
