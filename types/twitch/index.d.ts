export interface TwitchUser {
  id: string;
  name: string;
  displayName: string;
  profilePictureUrl: string;
  offlinePlaceholderUrl: string;
  creationDate: string;
  type: TwitchUserType;
  broadcasterType: TwitchBroadcasterType;
}

// Aliased type: "staff" | "admin" | "global_mod" | ""
export enum TwitchUserType {
  STAFF = "staff",
  ADMIN = "admin",
  GLOBAL_MOD = "global_mod",
  REGULAR = "",
}

// "partner" | "affiliate" | ""
export enum TwitchBroadcasterType {
  PARTNER = "partner",
  AFFILIATE = "affiliate",
  REGULAR = "",
}
