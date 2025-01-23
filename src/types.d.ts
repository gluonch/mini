declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        MainButton: {
          setText: (text: string) => void;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        sendData: (data: string) => void;
        initDataUnsafe: {
          user?: {
            username?: string;
            first_name?: string;
            last_name?: string;
          };
        };
      };
    };
  }
}

export {};