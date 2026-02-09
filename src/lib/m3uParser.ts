export interface LiveChannel {
  id: string;
  name: string;
  logo: string;
  group: string;
  url: string;
}

export const parseM3U = (content: string): LiveChannel[] => {
  const lines = content.split('\n');
  const channels: LiveChannel[] = [];
  let currentChannel: Partial<LiveChannel> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      const info = line.split('#EXTINF:')[1];
      
      // Parse tvg-id
      const idMatch = info.match(/tvg-id="([^"]+)"/);
      currentChannel.id = idMatch ? idMatch[1] : `channel-${channels.length}`;

      // Parse tvg-logo
      const logoMatch = info.match(/tvg-logo="([^"]+)"/);
      currentChannel.logo = logoMatch ? logoMatch[1] : '';

      // Parse group-title
      const groupMatch = info.match(/group-title="([^"]+)"/);
      currentChannel.group = groupMatch ? groupMatch[1] : 'General';

      // Parse name (everything after the last comma)
      const lastCommaIndex = line.lastIndexOf(',');
      currentChannel.name = lastCommaIndex !== -1 ? line.substring(lastCommaIndex + 1).trim() : 'Unknown Channel';
    } else if (line.startsWith('http')) {
      currentChannel.url = line;
      if (currentChannel.name && currentChannel.url) {
        channels.push(currentChannel as LiveChannel);
      }
      currentChannel = {};
    }
  }

  return channels;
};
