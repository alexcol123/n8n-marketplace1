"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Type, AlertCircle, Check, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { checkUsernameAvailability } from "@/utils/actions";
import { useDebouncedCallback } from "use-debounce";

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  helperText?: string;
  isUnique?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  checkAvailability?: boolean;
};

const FormInput = ({
  label,
  name,
  type,
  defaultValue,
  placeholder,
  required = true,
  className = "",
  helperText,
  isUnique = false,
  pattern,
  minLength,
  maxLength,
  checkAvailability = false,
}: FormInputProps) => {
  // State for input value and validation
  const [value, setValue] = useState(defaultValue || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  // Is this a username field?
  const isUsername = name === "username";

  // Set up debounce for username availability check
  const debouncedCheckAvailability = useDebouncedCallback(
    async (username: string) => {
      if (!username || username.length < 3) return;

      try {
        setIsChecking(true);
        const result = await checkUsernameAvailability(username);
        setIsAvailable(result.available);
        setAvailabilityMessage(result.message);
      } catch (error) {
        console.error("Error checking username availability:", error);
        setIsAvailable(null);
        setAvailabilityMessage("Error checking availability");
      } finally {
        setIsChecking(false);
      }
    },
    600 // 600ms delay before checking
  );

  // Basic client-side validation
  const validateUsername = useCallback((value: string) => {
    if (value.length < 3) {
      setErrorMessage("Username must be at least 3 characters");
      return false;
    } else if (value.length > 20) {
      setErrorMessage("Username must be at most 20 characters");
      return false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setErrorMessage(
        "Username can only contain letters, numbers, and underscores"
      );
      return false;
    } else {
      setErrorMessage("");
      return true;
    }
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Only for username field
    if (isUsername) {
      const isValid = validateUsername(newValue);

      // Check availability if the input is valid and we want to check
      if (isValid && checkAvailability) {
        debouncedCheckAvailability(newValue);
      } else {
        // Reset availability state
        setIsAvailable(null);
        setAvailabilityMessage("");
      }
    }
  };

  // Check availability when component mounts if we have a default value
  useEffect(() => {
    if (
      isUsername &&
      checkAvailability &&
      defaultValue &&
      defaultValue.length >= 3
    ) {
      validateUsername(defaultValue);
      debouncedCheckAvailability(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center justify-between">
        <Label
          htmlFor={name}
          className="text-sm font-medium mb-4 flex items-center gap-2"
        >
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-primary" />
            <span className="capitalize">{label || name}</span>
            {required && <span className="text-destructive ml-1">*</span>}
          </div>
        </Label>

        {/* Show character count for username */}
        {isUsername && (
          <div className="text-xs text-muted-foreground">
            {value.length > 0 ? `${value.length}/20` : ""}
          </div>
        )}
      </div>

      <div className="relative rounded-md overflow-hidden border transition-all duration-200 border-input hover:border-primary/50 focus-within:border-primary">
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder || label || name}
          required={required}
          pattern={pattern}
          minLength={minLength}
          maxLength={maxLength}
          className={cn(
            "border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0",
            isUsername && errorMessage ? "border-destructive" : "",
            isUsername && isAvailable === false ? "border-destructive" : "",
            isUsername && isAvailable === true ? "border-green-500" : "",
            className
          )}
        />

        {/* Show validation/availability status for username */}
        {isUsername && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : errorMessage ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : isAvailable === true ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : isAvailable === false ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : value.length >= 3 ? (
              <Check className="h-4 w-4 text-muted-foreground" />
            ) : null}
          </div>
        )}
      </div>

      {/* Error or availability messages for username */}
      {isUsername && (errorMessage || availabilityMessage) && (
        <div
          className={cn(
            "text-xs flex items-center gap-1 mt-1",
            errorMessage
              ? "text-destructive"
              : isAvailable === true
              ? "text-green-600 dark:text-green-400"
              : isAvailable === false
              ? "text-destructive"
              : "text-muted-foreground"
          )}
        >
          {errorMessage ? (
            <>
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              {errorMessage}
            </>
          ) : availabilityMessage ? (
            <>
              {isAvailable ? (
                <Check className="h-3 w-3 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
              )}
              {availabilityMessage}
            </>
          ) : null}
        </div>
      )}

      {/* Helper text */}
      {helperText && !errorMessage && !availabilityMessage && (
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <div>{helperText}</div>
        </div>
      )}

      {/* Username-specific help text when no other messages */}
      {isUsername && !errorMessage && !availabilityMessage && !helperText && (
        <div className="text-xs text-muted-foreground mt-1">
          {isUnique
            ? "Username must be unique. Choose something that identifies you."
            : "Usernames can contain letters, numbers, and underscores."}
        </div>
      )}
    </div>
  );
};

export default FormInput;
