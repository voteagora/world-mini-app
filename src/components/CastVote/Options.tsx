"use client";

import { useState } from "react";
import {
  Checkbox,
  RadioGroup,
  RadioGroupItem,
} from "@worldcoin/mini-apps-ui-kit-react";

export const Options = ({
  options,
  maxNumber,
  onSelect,
}: {
  options: string[];
  maxNumber: number;
  onSelect: (option: string) => void;
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  if (maxNumber === 1) {
    return (
      <RadioGroup>
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4 w-full cursor-pointer text-left"
              onClick={() => {
                const radio = document.getElementById(
                  option
                ) as HTMLInputElement;
                if (radio) radio.click();
                onSelect(option);
              }}
            >
              <RadioGroupItem id={option} value={option} />
              <label htmlFor={option}>{option}</label>
            </button>
          ))}
        </div>
      </RadioGroup>
    );
  }

  const handleCheckboxSelect = (option: string) => {
    const isSelected = selectedOptions.includes(option);

    if (isSelected) {
      const newSelected = selectedOptions.filter((opt) => opt !== option);
      setSelectedOptions(newSelected);
      onSelect(option);
    } else if (selectedOptions.length < maxNumber) {
      const newSelected = [...selectedOptions, option];
      setSelectedOptions(newSelected);
      onSelect(option);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => {
        const isSelected = selectedOptions.includes(option);
        const isDisabled = !isSelected && selectedOptions.length >= maxNumber;

        return (
          <button
            key={option}
            type="button"
            className={`flex items-center space-x-2 rounded-lg p-4 w-full cursor-pointer text-left ${
              isDisabled
                ? "bg-gray-200 opacity-50 cursor-not-allowed"
                : "bg-gray-50"
            }`}
            onClick={() => !isDisabled && handleCheckboxSelect(option)}
            disabled={isDisabled}
          >
            <Checkbox id={option} value={option} checked={isSelected} />
            <label htmlFor={option}>{option}</label>
          </button>
        );
      })}
    </div>
  );
};
