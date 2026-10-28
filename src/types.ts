export type OntBrand = 'zte' | 'huawei' | 'fiberhome' | 'nokia' | 'tplink';
export type ViewMode = 'auto' | 'split' | 'phone-simulator' | 'chat-only' | 'ont-only';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  action?: {
    type: 'countdown-ont' | 'auto-login' | 'show-credentials' | 'guide-wlan' | 'reboot-confirm';
    payload?: any;
  };
  suggestions?: string[];
}

export interface OntBrandProfile {
  id: OntBrand;
  name: string;
  fullName: string;
  models: string[];
  defaultIp: string;
  defaultUser: string;
  defaultPass: string;
  adminUser: string;
  adminPass: string;
  themeColor: string;
  headerBg: string;
  accentColor: string;
  badgeBg: string;
  logo: string;
  ispUsage: string;
}

export interface OntState {
  brand: OntBrand;
  ipAddress: string;
  isLoggedIn: boolean;
  username: string;
  password: string;
  model: string;
  firmware: string;
  uptime: string;
  // 2.4G Settings
  wlan24: {
    enabled: boolean;
    ssid: string;
    hidden: boolean;
    security: string;
    passphrase: string;
    maxClients: number;
    channel: string;
  };
  // 5G Settings
  wlan5g: {
    enabled: boolean;
    ssid: string;
    hidden: boolean;
    security: string;
    passphrase: string;
    maxClients: number;
    channel: string;
  };
  // Optical Info
  optical: {
    ponState: 'O5 (Normal)' | 'O3' | 'LOS (Kabel Putus)';
    rxPower: number; // dBm e.g. -19.45
    txPower: number; // dBm e.g. 2.12
    temperature: number; // 42C
    voltage: number; // 3.3V
  };
  // Connected Devices
  clients: Array<{
    id: string;
    name: string;
    ip: string;
    mac: string;
    band: '2.4G' | '5G' | 'LAN';
    rssi: number;
    blocked: boolean;
  }>;
}

export interface PresetCredential {
  label: string;
  user: string;
  pass: string;
  desc: string;
}
