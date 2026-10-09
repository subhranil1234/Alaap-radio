export interface Station {
  id: string;
  name: string;
  subtitle: string;
  frequency: string;
  streamUrl: string;
  fallbackUrl: string;
  type: string;
  status: 'tested' | 'untested' | 'blocked';
}

export const STATIONS: Station[] = [
  {
    id: 'akashvani-mahalaya',
    name: 'MAHALAYA SPECIAL',
    subtitle: 'AKASHVANI BANGLA',
    frequency: 'LIVE',
    streamUrl: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio245/hlspbaudio24564kbps.m3u8',
    fallbackUrl: 'https://akashvani.gov.in/radio/live.php?channel=265',
    type: 'live',
    status: 'tested'
  },
  {
    id: 'kolkata-geetanjali',
    name: 'Kolkata Geetanjali',
    subtitle: 'Akashvani',
    frequency: '100.2 MHz',
    streamUrl: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio055/hlspbaudio05564kbps.m3u8',
    fallbackUrl: 'https://akashvani.gov.in/radio/live.php?channel=263',
    type: 'live',
    status: 'tested'
  },
  {
    id: 'fm-rainbow-kolkata',
    name: 'FM Rainbow',
    subtitle: 'Kolkata',
    frequency: '107.0 MHz',
    streamUrl: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio058/hlspbaudio05864kbps.m3u8',
    fallbackUrl: 'https://akashvani.gov.in/radio/live.php?channel=266',
    type: 'live',
    status: 'tested'
  },
  {
    id: 'red-fm-kolkata',
    name: 'Red FM 93.5',
    subtitle: 'Kolkata',
    frequency: '93.5 MHz',
    streamUrl: 'https://funasia.streamguys1.com/live9',
    fallbackUrl: 'https://www.redfmindia.in/kolkata',
    type: 'live',
    status: 'tested'
  },
  {
    id: 'mirchi-kolkata',
    name: 'Radio Mirchi',
    subtitle: 'Kolkata',
    frequency: '98.3 MHz',
    streamUrl: 'https://drive.uber.radio/uber/bollywoodnow/icecast.audio',
    fallbackUrl: 'https://mirchi.in/',
    type: 'live',
    status: 'tested'
  },
  {
    id: 'air-fm-gold-kolkata',
    name: 'AIR FM Gold Kolkata',
    subtitle: 'Akashvani',
    frequency: '100.2 MHz',
    streamUrl: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio057/hlspbaudio05764kbps.m3u8',
    fallbackUrl: 'https://akashvani.gov.in/',
    type: 'live',
    status: 'tested'
  },
  {
    id: 'air-maitree-kolkata',
    name: 'AIR Akashvani Maitree',
    subtitle: 'Akashvani',
    frequency: 'Live',
    streamUrl: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio245/hlspbaudio24564kbps.m3u8',
    fallbackUrl: 'https://akashvani.gov.in/',
    type: 'live',
    status: 'tested'
  },
  {
    id: 'fm-94-8',
    name: '94.8 FM',
    subtitle: 'Radio Channel',
    frequency: '94.8 MHz',
    streamUrl: 'http://strm112.1.fm/bombaybeats_mobile_mp3',
    fallbackUrl: 'https://zeno.fm/',
    type: 'live',
    status: 'tested'
  },
  {
    id: 'test-stream',
    name: 'Radio Testing',
    subtitle: 'Sample Stream',
    frequency: 'TEST',
    streamUrl: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
    fallbackUrl: 'https://www.bbc.co.uk/sounds/play/live:bbc_world_service',
    type: 'live',
    status: 'tested'
  }
];
