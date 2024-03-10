// ./lib/user-flags.ts

/**
 * Defines user flags as a record, mapping bitwise flag values to descriptive string names.
 */
const USER_FLAGS: Record<string, string> = {
  [1 << 0]: 'Discord Employee',
  [1 << 1]: 'Partnered Server Owner',
  [1 << 2]: 'HypeSquad Events Member',
  [1 << 3]: 'Bug Hunter Level 1',
  [1 << 6]: 'HypeSquad Bravery',
  [1 << 7]: 'HypeSquad Brilliant',
  [1 << 8]: 'HypeSquad Balance',
  [1 << 9]: 'Early Supporter',
  [1 << 10]: 'Team',
  [1 << 14]: 'Bug Hunter Level 2',
  [1 << 16]: 'Verified Bot',
  [1 << 17]: 'Early Verified Bot Developer',
  [1 << 18]: 'Moderator Programs Alumni',
  [1 << 19]: 'BOT_HTTP_INTERACTIONS',
  [1 << 22]: 'Active Developer',
};

/**
 * Decodes bitwise user flags into an array of descriptive string names.
 * @param {number} flags - The bitwise flags to decode.
 * @returns {string[]} An array of flag names corresponding to the bitwise flags.
 */
function decodeUserFlags(flags: number): string[] {
  return Object.entries(USER_FLAGS)
    .filter(([flagValue]) => flags & Number(flagValue))
    .map(([, flagName]) => flagName);
}

/**
 * Custom hook to convert user flags from bitwise representation to descriptive strings.
 * @returns An object containing the convertUserFlags function.
 */
const useUserFlags = (): { convertUserFlags: (flags: number) => string[] } => {
  /**
   * Converts a numeric flag value into an array of descriptive flag names.
   * @param {number} flags - The numeric flag value to convert.
   * @returns {string[]} An array of descriptive flag names.
   */
  const convertUserFlags = (flags: number): string[] => {
    return decodeUserFlags(flags);
  };
  return { convertUserFlags };
};

export default useUserFlags;
