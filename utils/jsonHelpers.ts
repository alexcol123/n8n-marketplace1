// utils/jsonHelpers.ts

import { JsonValue } from "@prisma/client/runtime/library";

/**
 * UNIVERSAL JSON ARRAY PARSER
 *
 * Safely converts Prisma's JsonValue to properly typed arrays.
 * Handles all the messy edge cases that come with database JSON fields.
 *
 * WHY THIS EXISTS:
 * - Prisma JsonValue can be: string | number | boolean | object | array | null
 * - But our components need specific array types like: { title: string; url: string }[]
 * - Database JSON can get corrupted, stored as strings, or be null
 * - Type assertions (as) are unsafe - they don't validate runtime data
 *
 * USAGE EXAMPLES:
 * parseJsonArray<{ title: string; url: string }>(guide.credentialsLinks)
 * parseJsonArray<string>(guide.tags)
 * parseJsonArray<number>(guide.counts)
 * parseJsonArray<{ issue: string; solution: string }>(guide.troubleshooting)
 *
 * @param jsonValue - The JsonValue from Prisma (could be anything!)
 * @returns Properly typed array or null (for safe fallbacks)
 */
export function parseJsonArray<T>(
  jsonValue: JsonValue | null | undefined
): T[] | null {
  // STEP 1: Handle the "nothing" cases
  // If the database field is null/undefined, return null
  // This triggers our component's fallback logic (like default empty arrays)
  if (!jsonValue) return null;

  try {
    // STEP 2: Handle the "already correct" case
    // If Prisma already parsed it as an array, we're good!
    // This is the most common case for properly stored JSON
    if (Array.isArray(jsonValue)) {
      // Type assertion here is safe because we verified it's an array
      // The generic <T> tells TypeScript what the array contains
      return jsonValue as T[];
    }

    // STEP 3: Handle the "stored as string" case
    // Sometimes JSON gets stored as a string instead of parsed JSON
    // This can happen with manual database inserts or migrations
    if (typeof jsonValue === "string") {
      const parsed = JSON.parse(jsonValue); // Try to parse the JSON string

      // Double-check that parsing gave us an array, not an object
      // JSON.parse('{"not": "array"}') would return an object, not array
      return Array.isArray(parsed) ? parsed : null;
    }

    // STEP 4: Handle unexpected types
    // If it's a number, boolean, or object (not array), return null
    // This triggers our component's safe fallback behavior
    // Better to show empty state than crash the app
    return null;
  } catch (error) {
    // STEP 5: Handle corrupted JSON
    // If JSON.parse() fails (malformed JSON), log it and return null
    // This prevents the entire page from crashing due to bad database data
    console.error("Error parsing JSON array:", error);
    return null;
  }
}

/**
 * SAFE JSON OBJECT PARSER
 *
 * Similar to parseJsonArray but for single JSON objects.
 * Useful for settings, config objects, etc.
 *
 * USAGE EXAMPLES:
 * parseJsonObject<{ theme: string; language: string }>(user.preferences)
 * parseJsonObject<Record<string, unknown>>(workflow.metadata)
 *
 * @param jsonValue - The JsonValue from Prisma
 * @returns Properly typed object or null
 */
export function parseJsonObject<T extends Record<string, unknown>>(
  jsonValue: JsonValue | null | undefined
): T | null {
  if (!jsonValue) return null;

  try {
    // If it's already an object (and not an array), return it
    if (
      typeof jsonValue === "object" &&
      jsonValue !== null &&
      !Array.isArray(jsonValue)
    ) {
      return jsonValue as T;
    }

    // If it's a string, try to parse it
    if (typeof jsonValue === "string") {
      const parsed = JSON.parse(jsonValue);
      // Make sure we got an object, not an array or primitive
      return typeof parsed === "object" &&
        parsed !== null &&
        !Array.isArray(parsed)
        ? (parsed as T)
        : null;
    }

    return null;
  } catch (error) {
    console.error("Error parsing JSON object:", error);
    return null;
  }
}

/**
 * SAFE JSON STRING PARSER
 *
 * For when you expect a simple string value from JSON field.
 * Handles cases where strings might be stored as JSON.
 *
 * @param jsonValue - The JsonValue from Prisma
 * @returns String value or null
 */
export function parseJsonString(
  jsonValue: JsonValue | null | undefined
): string | null {
  if (!jsonValue) return null;

  // If it's already a string, return it
  if (typeof jsonValue === "string") {
    return jsonValue;
  }

  // If it's a JSON-encoded string, parse it
  try {
    if (typeof jsonValue === "object") {
      return JSON.stringify(jsonValue);
    }
  } catch (error) {
    console.error("Error parsing JSON string:", error);
  }

  return null;
}

// COMMON TYPE DEFINITIONS FOR YOUR PROJECT
// Define these once, use everywhere

export type LinkArray = Array<{ title: string; url: string }>;
export type TroubleshootingArray = Array<{ issue: string; solution: string }>;
export type TagArray = Array<string>;

// SHORTHAND FUNCTIONS FOR YOUR SPECIFIC USE CASES
// These make your code even cleaner

export const parseCredentialsLinks = (
  jsonValue: JsonValue | null | undefined
): LinkArray | null =>
  parseJsonArray<{ title: string; url: string }>(jsonValue);

export const parseHelpLinks = (
  jsonValue: JsonValue | null | undefined
): LinkArray | null =>
  parseJsonArray<{ title: string; url: string }>(jsonValue);

export const parseVideoLinks = (
  jsonValue: JsonValue | null | undefined
): LinkArray | null =>
  parseJsonArray<{ title: string; url: string }>(jsonValue);

export const parseTroubleshooting = (
  jsonValue: JsonValue | null | undefined
): TroubleshootingArray | null =>
  parseJsonArray<{ issue: string; solution: string }>(jsonValue);

// HOW TO USE IN YOUR PROJECT:
/*
// Import the helpers:
import { parseJsonArray, parseCredentialsLinks, parseHelpLinks } from '@/utils/jsonHelpers';

// Use in your page components:
const guide = {
  // Option 1: Generic function
  credentialsLinks: parseJsonArray<{ title: string; url: string }>(data.credentialsLinks),
  
  // Option 2: Specific helper (cleaner)
  credentialsLinks: parseCredentialsLinks(data.credentialsLinks),
  helpLinks: parseHelpLinks(data.helpLinks),
  videoLinks: parseVideoLinks(data.videoLinks),
  troubleshooting: parseTroubleshooting(data.troubleshooting),
};
*/
