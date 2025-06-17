import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: (event?: KeyboardEvent) => void;
  description: string;
}

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'h',
      action: () => navigate('/'),
      description: 'Go to Home'
    },
    {
      key: 'm',
      action: () => navigate('/mempool'),
      description: 'Go to Mempool'
    },
    {
      key: 'f',
      action: () => navigate('/fees'),
      description: 'Go to Fee Estimator'
    },
    {
      key: 'n',
      action: () => navigate('/news'),
      description: 'Go to News'
    },
    {
      key: 'r',
      action: () => window.location.reload(),
      description: 'Refresh Page'
    },
    {
      key: 's',
      ctrlKey: true,
      action: (e) => {
        e?.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      description: 'Focus Search (Ctrl+S)'
    },
    {
      key: '/',
      action: () => {
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      description: 'Focus Search (/)'
    },
    {
      key: 'Escape',
      action: () => {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
        // Close any open modals
        const closeButtons = document.querySelectorAll('[aria-label="Close"]');
        if (closeButtons.length > 0) {
          (closeButtons[0] as HTMLElement).click();
        }
      },
      description: 'Close/Escape'
    }
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when user is typing in an input
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement).contentEditable === 'true') {
      // Allow Escape and Ctrl+S even in inputs
      if (event.key !== 'Escape' && !(event.ctrlKey && event.key === 's')) {
        return;
      }
    }

    // Handle ? key specifically (shift + /)
    if (event.key === '?' && event.shiftKey) {
      event.preventDefault();
      showKeyboardShortcuts();
      return;
    }

    const shortcut = shortcuts.find(s => 
      s.key.toLowerCase() === event.key.toLowerCase() &&
      !!s.ctrlKey === event.ctrlKey &&
      !!s.altKey === event.altKey &&
      !!s.shiftKey === event.shiftKey &&
      !!s.metaKey === event.metaKey
    );

    if (shortcut) {
      event.preventDefault();
      shortcut.action(event);
    }
  }, [shortcuts, navigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts };
};

// Function to show keyboard shortcuts modal
const showKeyboardShortcuts = () => {
  const existingModal = document.getElementById('keyboard-shortcuts-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'keyboard-shortcuts-modal';
  modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  };

  modal.innerHTML = `
    <div class="bg-gradient-to-br from-purple-900/90 to-purple-800/80 border border-purple-500/30 rounded-2xl p-8 max-w-md w-full backdrop-blur-md">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
        <button onclick="this.closest('#keyboard-shortcuts-modal').remove()" class="p-2 hover:bg-purple-800/50 rounded-lg transition-colors" aria-label="Close">
          <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-gray-300">Home</span>
          <kbd class="px-2 py-1 bg-purple-900/50 rounded text-purple-300 text-sm font-mono">H</kbd>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-300">Mempool</span>
          <kbd class="px-2 py-1 bg-purple-900/50 rounded text-purple-300 text-sm font-mono">M</kbd>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-300">Fees</span>
          <kbd class="px-2 py-1 bg-purple-900/50 rounded text-purple-300 text-sm font-mono">F</kbd>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-300">News</span>
          <kbd class="px-2 py-1 bg-purple-900/50 rounded text-purple-300 text-sm font-mono">N</kbd>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-300">Search</span>
          <kbd class="px-2 py-1 bg-purple-900/50 rounded text-purple-300 text-sm font-mono">/</kbd>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-300">Refresh</span>
          <kbd class="px-2 py-1 bg-purple-900/50 rounded text-purple-300 text-sm font-mono">R</kbd>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-300">Close/Escape</span>
          <kbd class="px-2 py-1 bg-purple-900/50 rounded text-purple-300 text-sm font-mono">ESC</kbd>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-300">Show Shortcuts</span>
          <kbd class="px-2 py-1 bg-purple-900/50 rounded text-purple-300 text-sm font-mono">?</kbd>
        </div>
      </div>
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-400">Press any key to navigate quickly</p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (document.getElementById('keyboard-shortcuts-modal')) {
      modal.remove();
    }
  }, 10000);
};

export { showKeyboardShortcuts };