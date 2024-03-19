/**
 * Replaces user, role, and channel IDs with formatted names within a text.
 * @param text - The input text containing IDs to be replaced.
 * @param users - A record of user IDs to their names.
 * @param roles - Optional. A record of role IDs to their names.
 * @param channels - Optional. A record of channel IDs to their names.
 * @returns The text with IDs replaced by formatted names.
 */
export function replaceIds(
  text: string,
  users: Record<string, { name: string }>,
  roles?: Record<string, { name: string; color?: string }>,
  channels?: Record<string, { name: string }>
): string {
  const userIdPattern = /<@(\d+)>/g;
  const channelIdPattern = /<#(\d+)>/g;
  const roleIdPattern = /<@&(\d+)>/g;
  const emojiIdPattern = /<(a?):([^:]+):(\d+)>/g;
  const pingStyle =
    'background: rgb(34.5%,39.6%,65%);border-radius:2px;font-weight:500;';
  return text
    .replace(userIdPattern, (match, userId) => {
      const user = users[userId];
      return `<span style="${pingStyle}cursor:pointer;">@${
        user?.name ?? userId
      }</span>`;
    })
    .replace(channelIdPattern, (match, channelId) => {
      const channel = channels?.[channelId];
      return `<span style="${pingStyle}cursor:pointer;">#${
        channel?.name ?? channelId
      }</span>`;
    })
    .replace(roleIdPattern, (match, roleId) => {
      const role = roles?.[roleId];
      return `<span style="${pingStyle}cursor:pointer;${
        role?.color && role.color !== '#000000'
          ? `background: ${role.color}22; color: ${role.color}`
          : ``
      }">@${role?.name ?? (roles ? `deleted-role` : roleId)}</span>`;
    })
    .replace(emojiIdPattern, (match, animated, name, id) => {
      const emojiURL = `https://cdn.discordapp.com/emojis/${id}.${
        animated ? 'gif' : 'png'
      }`;
      return `<img src="${emojiURL}" alt="${name}" style="width: 20px; height: 20px; vertical-align: middle; display: inline-block;" />`;
    });
}
