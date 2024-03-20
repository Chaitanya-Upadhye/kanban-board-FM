import * as React from "react";

import { cn } from "../utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    const [isInvalid, setIsInvalid] = React.useState(false);
    return (
      <>
        <label className="block text-mediumGrey text-body-m mb-2">
          {props?.label}
        </label>

        <div className=" relative">
          <input
            type={type}
            className={cn(
              `rounded px-4 min-h-[40px] py-2 w-full block outline-none border border-mediumGrey/25 focus:${
                isInvalid ? "border-red" : "border-mainPurple"
              }   invalid:${isInvalid ? "border-red" : ""}`,
              className
            )}
            onChange={(e) => {
              setIsInvalid(!e.target.checkValidity());
            }}
            onBlur={(e) => {
              setIsInvalid(!e.target.checkValidity());
            }}
            ref={ref}
            {...props}
          />
          {isInvalid ? (
            <span className="text-body-m text-red absolute right-4 top-3">
              Can't be empty
            </span>
          ) : null}
        </div>
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };

// className="rounded px-4 min-h-[40px] py-2 w-full block outline-none border border-mediumGrey/25 focus:border-mainPurple   invalid:border-red"
