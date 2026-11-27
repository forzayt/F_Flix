import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pb-24 pt-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.06] text-[hsl(258,80%,60%)]">
        <SettingsIcon size={30} strokeWidth={1.6} />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-white/95">
        Settings
      </h1>
      <p className="mt-2 text-sm text-white/50">
        Coming soon — preferences, playback controls, and theme options will live here.
      </p>
      <span className="mt-5 rounded-full bg-white/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[hsl(258,80%,60%)]">
        Coming Soon
      </span>
    </div>
  );
};

export default Settings;
