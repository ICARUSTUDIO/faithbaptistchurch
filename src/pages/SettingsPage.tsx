import { Moon, Sun, Type, Info } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const { isDarkMode, toggleDarkMode, fontSize, setFontSize } = useApp();
  
  return (
    <AppLayout>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>
      
      <div className="p-4 space-y-6">
        {/* Appearance */}
        <section className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Appearance
          </h2>
          
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </section>
        
        {/* Font Size */}
        <section className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Type className="w-5 h-5" />
            Font Size
          </h2>
          
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map(size => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={cn(
                  "flex-1 py-2 rounded-lg capitalize transition-colors",
                  fontSize === size ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </section>
        
        {/* About */}
        <section className="bg-card border border-border rounded-xl p-4">
          <h2 className="font-semibold flex items-center gap-2 mb-2">
            <Info className="w-5 h-5" />
            About
          </h2>
          <p className="text-sm text-muted-foreground">Church Bible App v1.0.0</p>
        </section>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
