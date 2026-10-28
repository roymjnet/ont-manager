import { OntBrand, OntBrandProfile } from '../types';

export const ONT_BRANDS: OntBrandProfile[] = [
  {
    id: 'zte',
    name: 'ZTE',
    fullName: 'ZTE Corporation (中兴通讯)',
    models: ['ZXHN F670L Dual-Band', 'ZXHN F609 GPON', 'ZXHN F660'],
    defaultIp: '192.168.1.1',
    defaultUser: 'user',
    defaultPass: 'User23456',
    adminUser: 'admin',
    adminPass: 'Telkomdso123',
    themeColor: 'from-blue-600 to-indigo-700',
    headerBg: 'bg-slate-950 border-blue-900/50',
    accentColor: 'text-cyan-400',
    badgeBg: 'bg-blue-600 text-white',
    logo: 'ZTE 中兴',
    ispUsage: 'IndiHome Telkom, Exabit, MyRepublic, CBN'
  },
  {
    id: 'tplink',
    name: 'TP-Link',
    fullName: 'TP-Link Technologies Co., Ltd.',
    models: ['XC220-G3v AC1200 GPON', 'Archer XR500v', 'TX-VG1530'],
    defaultIp: '192.168.0.1',
    defaultUser: 'admin',
    defaultPass: 'admin',
    adminUser: 'admin',
    adminPass: 'admin123',
    themeColor: 'from-teal-600 to-emerald-700',
    headerBg: 'bg-slate-950 border-teal-900/40',
    accentColor: 'text-teal-400',
    badgeBg: 'bg-teal-600 text-white',
    logo: 'tp-link',
    ispUsage: 'ISP Lokal, RT/RW Net, Oxygen, Megavision'
  },
  {
    id: 'huawei',
    name: 'Huawei',
    fullName: 'Huawei Technologies Co., Ltd.',
    models: ['EchoLife HG8245H5', 'EchoLife HG8245W5 AC', 'EchoLife HG8546M'],
    defaultIp: '192.168.100.1',
    defaultUser: 'Epuser',
    defaultPass: 'userEp',
    adminUser: 'telecomadmin',
    adminPass: 'admintelecom',
    themeColor: 'from-rose-600 to-red-700',
    headerBg: 'bg-stone-950 border-red-900/40',
    accentColor: 'text-rose-400',
    badgeBg: 'bg-red-600 text-white',
    logo: 'HUAWEI 华为',
    ispUsage: 'IndiHome Telkom, Biznet, Oxygen.id, FirstMedia'
  },
  {
    id: 'fiberhome',
    name: 'FiberHome',
    fullName: 'FiberHome Telecommunication Technologies',
    models: ['AN5506-04-FG Dual-Band', 'AN5506-02-B', 'HG680 GPON'],
    defaultIp: '192.168.1.1',
    defaultUser: 'user',
    defaultPass: 'user1234',
    adminUser: 'admin',
    adminPass: '%0%ZGar credential',
    themeColor: 'from-amber-600 to-orange-700',
    headerBg: 'bg-slate-950 border-orange-900/40',
    accentColor: 'text-amber-400',
    badgeBg: 'bg-orange-600 text-white',
    logo: 'FiberHome 烽火',
    ispUsage: 'IndiHome Telkom, MyRepublic, MNC Play'
  },
  {
    id: 'nokia',
    name: 'Nokia',
    fullName: 'Nokia Networks / Alcatel-Lucent',
    models: ['Nokia G-240W-F Dual-Band', 'Nokia G-2425G-A Wi-Fi 6', 'Alcatel I-240W-A'],
    defaultIp: '192.168.1.254',
    defaultUser: 'user',
    defaultPass: 'user',
    adminUser: 'AdminGPON',
    adminPass: 'ALC#FBN@ZTE',
    themeColor: 'from-blue-700 to-cyan-700',
    headerBg: 'bg-slate-950 border-cyan-900/40',
    accentColor: 'text-cyan-300',
    badgeBg: 'bg-blue-700 text-white',
    logo: 'NOKIA',
    ispUsage: 'Telkomsel Orbit, Biznet, XL SATU'
  }
];

export const GATEWAY_OPTIONS = [
  { ip: '192.168.0.1', brand: 'tplink' as OntBrand, label: '192.168.0.1 (TP-Link / Default 0.1)' },
  { ip: '192.168.1.1', brand: 'zte' as OntBrand, label: '192.168.1.1 (ZTE / FiberHome)' },
  { ip: '192.168.100.1', brand: 'huawei' as OntBrand, label: '192.168.100.1 (Huawei EchoLife)' },
  { ip: '192.168.1.254', brand: 'nokia' as OntBrand, label: '192.168.1.254 (Nokia / Alcatel)' }
];

export const detectBrandFromIp = (ip: string): OntBrand => {
  const clean = ip.trim();
  if (clean === '192.168.0.1' || clean.startsWith('192.168.0.')) return 'tplink';
  if (clean === '192.168.100.1' || clean.startsWith('192.168.100.')) return 'huawei';
  if (clean === '192.168.1.254' || clean.endsWith('.254')) return 'nokia';
  return 'zte';
};
