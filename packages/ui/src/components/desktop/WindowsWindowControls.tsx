import React, { useCallback, useState, useEffect } from 'react';
import { invokeDesktop, canUseElectronDesktopIPC } from '@/lib/desktop';
import { cn } from '@/lib/utils';

const WIN_CTRL_BUTTON_CLASS =
  'app-region-no-drag inline-flex h-8 w-11 items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none';

export const WindowsWindowControls: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!canUseElectronDesktopIPC()) return;

    const fetchState = async () => {
      const maximized = await invokeDesktop<boolean>('desktop_is_window_maximized');
      setIsMaximized(!!maximized);
    };
    void fetchState();
  }, []);

  const handleMinimize = useCallback(async () => {
    await invokeDesktop('desktop_minimize_window');
  }, []);

  const handleMaximize = useCallback(async () => {
    await invokeDesktop('desktop_maximize_window');
    setIsMaximized((prev) => !prev);
  }, []);

  const handleClose = useCallback(async () => {
    await invokeDesktop('desktop_close_window');
  }, []);

  return (
    <div className="app-region-no-drag flex items-center h-8" role="group" aria-label="Window controls">
      <button
        type="button"
        className={WIN_CTRL_BUTTON_CLASS}
        onClick={handleMinimize}
        aria-label="Minimize"
        title="Minimize"
      >
        <svg width="10" height="1" viewBox="0 0 10 1" fill="none">
          <rect width="10" height="1" fill="currentColor" />
        </svg>
      </button>
      <button
        type="button"
        className={WIN_CTRL_BUTTON_CLASS}
        onClick={handleMaximize}
        aria-label={isMaximized ? 'Restore' : 'Maximize'}
        title={isMaximized ? 'Restore' : 'Maximize'}
      >
        {isMaximized ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="0" y="2" width="8" height="8" stroke="currentColor" strokeWidth="1" fill="none" />
            <rect x="2" y="0" width="8" height="8" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="0.5" y="0.5" width="9" height="9" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        )}
      </button>
      <button
        type="button"
        className={cn(
          WIN_CTRL_BUTTON_CLASS,
          'hover:bg-red-600 hover:text-white'
        )}
        onClick={handleClose}
        aria-label="Close"
        title="Close"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};
