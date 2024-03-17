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
  roles?: Record<string, { name: string }>,
  channels?: Record<string, { name: string }>
): string {
  const userIdPattern = /<@(\d+)>/g;
  const channelIdPattern = /<#(\d+)>/g;
  const roleIdPattern = /<@&(\d+)>/g;
  return text
    .replace(userIdPattern, (match, userId) => {
      const user = users[userId];
      return `<span style="color: #fdf0d5; font-weight: bold; cursor:pointer;">@${
        user?.name ?? userId
      }</span>`;
    })
    .replace(channelIdPattern, (match, channelId) => {
      const channel = channels?.[channelId];
      return `<span style="color: #f07167; font-weight: bold; cursor:pointer;">#${
        channel?.name ?? channelId
      }</span>`;
    })
    .replace(roleIdPattern, (match, roleId) => {
      const role = roles?.[roleId];
      return `<span style="color: #00afb9; font-weight: bold; cursor:pointer;">@${
        role?.name ?? roleId
      }</span>`;
    });
}
