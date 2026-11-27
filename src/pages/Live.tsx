import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Search, Tv } from 'lucide-react';
import { parseM3U, LiveChannel } from '@/lib/m3uParser';
import HLSPlayer from '@/components/HLSPlayer';
import m3uContent from '@/constants/livetv.m3u?raw';
import PageHeader from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';
import { easeOutExpo } from '@/lib/motion';

const Live = () => {
  const [channels, setChannels] = useState<LiveChannel[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<LiveChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<LiveChannel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  useEffect(() => {
    const parsedChannels = parseM3U(m3uContent);
    setChannels(parsedChannels);
    setFilteredChannels(parsedChannels);
    if (parsedChannels.length > 0) {
      setSelectedChannel(parsedChannels[0]);
    }
  }, []);

  useEffect(() => {
    let filtered = channels;

    if (searchQuery) {
      filtered = filtered.filter(
        (channel) =>
          channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          channel.group.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGroup !== 'All') {
      filtered = filtered.filter((channel) => channel.group === selectedGroup);
    }

    setFilteredChannels(filtered);
  }, [searchQuery, selectedGroup, channels]);

  const groups = ['All', ...new Set(channels.map((c) => c.group))];

  return (
    <main className="px-4 pb-24 pt-28 md:px-12 md:pt-32">
      <PageHeader
        eyebrow="Live"
        title="Live TV"
        description="Tune into publicly indexed channels from around the world."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Player */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="space-y-4"
        >
          {selectedChannel ? (
            <>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_40px_120px_-50px_hsl(var(--brand-glow)/0.4)]">
                <HLSPlayer
                  key={selectedChannel.url}
                  url={selectedChannel.url}
                  className="w-full"
                />
              </div>

              <div className="glass flex items-center gap-4 rounded-2xl p-4">
                {selectedChannel.logo ? (
                  <img
                    src={selectedChannel.logo}
                    alt={selectedChannel.name}
                    className="h-14 w-14 rounded-xl border border-white/10 bg-white/5 object-contain p-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/400x400/18181b/ffffff?text=TV';
                    }}
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <Tv size={22} className="text-white/40" />
                  </div>
                )}
                <div>
                  <h1 className="font-display text-xl font-bold text-white">
                    {selectedChannel.name}
                  </h1>
                  <p className="flex items-center gap-1.5 text-xs text-white/45">
                    <Radio size={12} className="text-primary" />
                    {selectedChannel.group}
                  </p>
                </div>
                <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Live
                </span>
              </div>
            </>
          ) : (
            <div className="glass flex aspect-video items-center justify-center rounded-3xl">
              <div className="text-center">
                <Tv size={44} className="mx-auto mb-4 text-white/25" />
                <p className="text-sm text-white/45">Select a channel to start watching</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Channel list */}
        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.08 }}
          className="glass flex h-[calc(100vh-13rem)] flex-col rounded-3xl p-4"
        >
          <div className="relative mb-4">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
              size={16}
            />
            <input
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search channels"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-primary/40 focus:outline-none"
            />
          </div>

          <div className="scrollbar-hide mb-4 flex gap-2 overflow-x-auto pb-1">
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={cn(
                  'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  selectedGroup === group
                    ? 'brand-gradient border-transparent text-white'
                    : 'border-white/10 bg-white/[0.03] text-white/50 hover:bg-white/[0.07] hover:text-white'
                )}
              >
                {group}
              </button>
            ))}
          </div>

          <div className="scrollbar-hide -mx-1 flex-1 space-y-2 overflow-y-auto px-1">
            {filteredChannels.map((channel) => {
              const isActive = selectedChannel?.url === channel.url;

              return (
                <button
                  key={channel.id + channel.url}
                  onClick={() => setSelectedChannel(channel)}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors',
                    isActive
                      ? 'border-primary/40 bg-primary/10'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.06]'
                  )}
                >
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-1">
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        loading="lazy"
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://placehold.co/100x100/18181b/ffffff?text=TV';
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Tv size={17} className="text-white/35" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 overflow-hidden">
                    <p
                      className={cn(
                        'truncate text-sm font-medium transition-colors',
                        isActive ? 'text-white' : 'text-white/75 group-hover:text-white'
                      )}
                    >
                      {channel.name}
                    </p>
                    <p className="truncate text-[10px] uppercase tracking-wider text-white/35">
                      {channel.group}
                    </p>
                  </div>

                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}

            {filteredChannels.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-white/40">No channels found</p>
              </div>
            )}
          </div>
        </motion.aside>
      </div>
    </main>
  );
};

export default Live;
