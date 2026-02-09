import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { parseM3U, LiveChannel } from '@/lib/m3uParser';
import HLSPlayer from '@/components/HLSPlayer';
import m3uContent from '@/constants/livetv.m3u?raw';
import { Input } from '@/components/ui/input';
import { Search, Tv } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

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
      filtered = filtered.filter(channel => 
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.group.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGroup !== 'All') {
      filtered = filtered.filter(channel => channel.group === selectedGroup);
    }

    setFilteredChannels(filtered);
  }, [searchQuery, selectedGroup, channels]);

  const groups = ['All', ...new Set(channels.map(c => c.group))];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Player Section */}
          <div className="lg:col-span-3 space-y-6">
            {selectedChannel ? (
              <div className="space-y-4">
                <HLSPlayer 
                  key={selectedChannel.url} 
                  url={selectedChannel.url} 
                  className="shadow-2xl border border-white/10"
                />
                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-white/5">
                  {selectedChannel.logo && (
                    <img 
                      src={selectedChannel.logo} 
                      alt={selectedChannel.name} 
                      className="w-16 h-16 object-contain bg-white/10 rounded-lg p-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/18181b/ffffff?text=TV';
                      }}
                    />
                  )}
                  <div>
                    <h1 className="text-2xl font-bold">{selectedChannel.name}</h1>
                    <p className="text-muted-foreground">{selectedChannel.group}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-secondary/20 rounded-xl flex items-center justify-center border border-dashed border-white/10">
                <div className="text-center">
                  <Tv size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Select a channel to start watching</p>
                </div>
              </div>
            )}
          </div>

          {/* Channel List Section */}
          <div className="lg:col-span-1 space-y-4 h-[calc(100vh-12rem)] flex flex-col">
            <div className="space-y-4 sticky top-0 bg-background pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search channels..."
                  className="pl-10 bg-secondary/50 border-white/10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <ScrollArea className="w-full whitespace-nowrap pb-2">
                <div className="flex gap-2">
                  {groups.map(group => (
                    <button
                      key={group}
                      onClick={() => setSelectedGroup(group)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-medium transition-all border",
                        selectedGroup === group 
                          ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "bg-secondary/50 border-white/10 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <ScrollArea className="flex-1 -mx-2 px-2">
              <div className="space-y-2">
                {filteredChannels.map(channel => (
                  <button
                    key={channel.id + channel.url}
                    onClick={() => setSelectedChannel(channel)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all border group",
                      selectedChannel?.url === channel.url
                        ? "bg-primary/10 border-primary/50 ring-1 ring-primary/50"
                        : "bg-secondary/20 border-white/5 hover:bg-secondary/40 hover:border-white/20"
                    )}
                  >
                    <div className="relative w-12 h-12 flex-shrink-0 bg-white/5 rounded-lg overflow-hidden border border-white/10 p-1">
                      {channel.logo ? (
                        <img 
                          src={channel.logo} 
                          alt={channel.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/18181b/ffffff?text=TV';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Tv size={20} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className={cn(
                        "font-medium truncate transition-colors",
                        selectedChannel?.url === channel.url ? "text-primary" : "text-foreground group-hover:text-primary"
                      )}>
                        {channel.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{channel.group}</p>
                    </div>
                  </button>
                ))}
                {filteredChannels.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">No channels found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Live;
