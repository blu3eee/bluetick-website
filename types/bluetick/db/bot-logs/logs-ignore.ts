export interface CreateGuildLogIgnoreChannelDto {
  logSettingID: number;
  channelID: string;
}

export interface GuildLogIgnoreChannelDetails {
  id: number;
  channelID: string;
}

export interface CreateGuildLogIgnoreRoleDto {
  logSettingID: number;
  roleID: string;
}

export interface GuildLogIgnoreRoleDetails {
  id: number;
  roleID: string;
}

export interface GuildLogIgnores {
  channels: GuildLogIgnoreChannelDetails[];
  roles: GuildLogIgnoreRoleDetails[];
}
