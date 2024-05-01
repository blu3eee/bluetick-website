export enum DISCORD_LOGS_CATEGORIES {
  MESSAGE = 0,
  MEMBER = 1,
  ROLE = 2,
  CHANNEL = 3,
  EMOJI = 4,
  VOICE = 5,
}

export enum MESSAGE_EVENTS {
  MESSAGE_DELETE = 0,
  MESSAGE_BULK_DELETE = 1,
  MESSAGE_EDIT = 2,
  GUILD_INVITES = 3,
}

export enum MEMBER_EVENTS {
  MEMBER_JOIN = 0,
  MEMBER_LEAVE = 1,
  MEMBER_ROLE_ADD = 2,
  MEMBER_ROLE_REMOVE = 3,
  MEMBER_TIMEOUT = 4,
  MEMBER_NICKNAME_CHANGE = 5,
  MEMBER_KICK = 6,
  MEMBER_BAN = 7,
  MEMBER_UNBAN = 8,
}

export enum ROLE_EVENTS {
  ROLE_CREATE = 0,
  ROLE_DELETE = 1,
  ROLE_UPDATE = 2,
}

export enum CHANNEL_EVENTS {
  CHANNEL_CREATE = 0,
  CHANNEL_DELETE = 1,
  CHANNEL_UPDATE = 2,
  THREAD_CREATE = 3,
  THREAD_DELETE = 4,
  THREAD_UPDATE = 5,
  // THREAD_MEMBERS_UPDATE = 6,
  // THREAD_MEMBER_UPDATE = 7,
}

export enum EMOJI_EVENTS {
  EMOJI_CREATE = 0,
  EMOJI_DELETE = 1,
  EMOJI_NAME_CHANGE = 2,
  STICKER_CREATE = 3,
  STICKER_DELETE = 4,
  STICKET_UPDATE = 5,
}

export enum VOICE_EVENTS {
  VOICE_JOIN = 0,
  VOICE_LEAVE = 1,
  VOICE_MOVE = 2,
}

/**
 * Extracts the keys from an enum-like object where the keys are string
 * representations of the enum members and the values are the enum values.
 * It filters out the reverse mappings from number to name that TypeScript
 * adds to numeric enums, returning only the string keys.
 * @param {O} obj - The enum-like object from which to extract keys.
 * @returns {K[]} An array of keys representing the enum members.
 * @template O - The type of the enum-like object.
 * @template K - The subset of keys from the enum-like object that are of type string.
 */
function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => !Number.isNaN(k)) as K[];
}

export const logsCollection = [
  {
    category: "Message",
    value: DISCORD_LOGS_CATEGORIES.MESSAGE,
    events: enumKeys(MESSAGE_EVENTS)
      .map((eventKey) => ({
        event: eventKey,
        value: MESSAGE_EVENTS[eventKey],
      }))
      .filter((obj) => typeof obj.value === "number"),
  },
  {
    category: "Member",
    value: DISCORD_LOGS_CATEGORIES.MEMBER,
    events: enumKeys(MEMBER_EVENTS)
      .map((eventKey) => ({
        event: eventKey,
        value: MEMBER_EVENTS[eventKey],
      }))
      .filter((obj) => typeof obj.value === "number"),
  },
  {
    category: "Role",
    value: DISCORD_LOGS_CATEGORIES.ROLE,
    events: enumKeys(ROLE_EVENTS)
      .map((eventKey) => ({
        event: eventKey,
        value: ROLE_EVENTS[eventKey],
      }))
      .filter((obj) => typeof obj.value === "number"),
  },
  {
    category: "Channel",
    value: DISCORD_LOGS_CATEGORIES.CHANNEL,
    events: enumKeys(CHANNEL_EVENTS)
      .map((eventKey) => ({
        event: eventKey,
        value: CHANNEL_EVENTS[eventKey],
      }))
      .filter((obj) => typeof obj.value === "number"),
  },
  {
    category: "Emoji",
    value: DISCORD_LOGS_CATEGORIES.EMOJI,
    events: enumKeys(EMOJI_EVENTS)
      .map((eventKey) => ({
        event: eventKey,
        value: EMOJI_EVENTS[eventKey],
      }))
      .filter((obj) => typeof obj.value === "number"),
  },
  {
    category: "Voice",
    value: DISCORD_LOGS_CATEGORIES.VOICE,
    events: enumKeys(VOICE_EVENTS)
      .map((eventKey) => ({
        event: eventKey,
        value: VOICE_EVENTS[eventKey],
      }))
      .filter((obj) => typeof obj.value === "number"),
  },
];
