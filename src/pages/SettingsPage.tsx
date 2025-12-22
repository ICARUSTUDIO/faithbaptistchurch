import { Moon, Sun, Type, Info, User, LogOut, LogIn, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SettingsPage = () => {
  const { isDarkMode, toggleDarkMode, fontSize, setFontSize } = useApp();
  const { user, profile, signOut, isPastor } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <AppLayout>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>
      
      <div className="p-4 space-y-6">
        {/* Account Section */}
        <section className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <User className="w-5 h-5" />
            Account
          </h2>
          
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{profile?.full_name || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                {isPastor && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {profile?.role === 'admin' ? 'Admin' : 'Pastor'}
                  </Badge>
                )}
              </div>
              <Button variant="outline" className="w-full" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Sign in to save your bookmarks and notes across devices.
              </p>
              <Button className="w-full" onClick={() => navigate('/auth')}>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          )}
        </section>
        
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
          <p className="text-xs text-muted-foreground mt-1">
            Your daily companion for scripture and spiritual growth.
          </p>
        </section>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
