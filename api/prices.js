// Vercel Serverless Function: Lightning-Fast Realtime Nadimi Menu API
import { put } from '@vercel/blob';
import { waitUntil } from '@vercel/functions';

const DEFAULT_STATE = {
  theme: 'classic_grey',
  mode: 'light', // 'dark' | 'light' | 'schedule'
  schedule: {
    lightStart: '08:00',
    darkStart: '18:00'
  },
  fontFamily: 'Vazirmatn',
  fontSizeScale: 100, // 75 to 140 percent
  itemNameScale: 100, // 70 to 160 percent (Item Titles & Descriptions)
  priceNumScale: 100, // 70 to 180 percent (Price Numbers)
  headerLinks: [
    { id: 'instagram', title: 'اینستاگرام', handle: '@nadimi.coffee', url: 'https://instagram.com/nadimi.coffee', iconType: 'instagram', active: true },
    { id: 'telegram', title: 'تلگرام', handle: '@nadimicoffee', url: 'https://t.me/nadimicoffee', iconType: 'telegram', active: true }
  ],
  fullscreenToggleId: 0,
  customCategories: [],
  customItems: [],
  version: 1,
  lastUpdated: new Date().toISOString(),
  prices: {
    // Espresso Bar
    esp_robusta100_s: 80, esp_robusta100_d: 120,
    esp_robusta7030_s: 90, esp_robusta7030_d: 130,
    esp_mark_s: 160, esp_mark_d: 230,
    esp_arabica100_s: 180, esp_arabica100_d: 250,

    ame_robusta100_s: 80, ame_robusta100_d: 120,
    ame_robusta7030_s: 90, ame_robusta7030_d: 130,
    ame_mark_s: 160, ame_mark_d: 230,
    ame_arabica100_s: 180, ame_arabica100_d: 250,

    // Hot Drinks
    latte_robusta100_s: 160, latte_robusta100_d: 200,
    latte_robusta7030_s: 170, latte_robusta7030_d: 210,
    latte_mark_s: 220, latte_mark_d: 310,
    latte_arabica100_s: 260, latte_arabica100_d: 320,

    cap_robusta100_s: 160, cap_robusta100_d: 200,
    cap_robusta7030_s: 170, cap_robusta7030_d: 210,
    cap_mark_s: 220, cap_mark_d: 310,
    cap_arabica100_s: 260, cap_arabica100_d: 320,

    caramel_robusta100_s: 210, caramel_robusta100_d: 250,
    caramel_robusta7030_s: 220, caramel_robusta7030_d: 260,
    caramel_mark_s: 290, caramel_mark_d: 360,
    caramel_arabica100_s: 310, caramel_arabica100_d: 380,

    hazel_robusta100_s: 210, hazel_robusta100_d: 250,
    hazel_robusta7030_s: 220, hazel_robusta7030_d: 260,
    hazel_mark_s: 290, hazel_mark_d: 360,
    hazel_arabica100_s: 310, hazel_arabica100_d: 380,

    coco_robusta100_s: 210, coco_robusta100_d: 250,
    coco_robusta7030_s: 220, coco_robusta7030_d: 260,
    coco_mark_s: 290, coco_mark_d: 360,
    coco_arabica100_s: 310, coco_arabica100_d: 380,

    toffee_robusta100_s: 210, toffee_robusta100_d: 250,
    toffee_robusta7030_s: 220, toffee_robusta7030_d: 260,
    toffee_mark_s: 290, toffee_mark_d: 360,
    toffee_arabica100_s: 310, toffee_arabica100_d: 380,

    mocha_robusta100_s: 210, mocha_robusta100_d: 250,
    mocha_robusta7030_s: 220, mocha_robusta7030_d: 260,
    mocha_mark_s: 290, mocha_mark_d: 360,
    mocha_arabica100_s: 310, mocha_arabica100_d: 380,

    spanish_robusta100_s: 210, spanish_robusta100_d: 250,
    spanish_robusta7030_s: 220, spanish_robusta7030_d: 260,
    spanish_mark_s: 290, spanish_mark_d: 360,
    spanish_arabica100_s: 310, spanish_arabica100_d: 380,

    taro_latte: 240,
    hot_chocolate: 195,

    // Cold Drinks
    ice_ame_robusta100_s: 95, ice_ame_robusta100_d: 125,
    ice_ame_robusta7030_s: 105, ice_ame_robusta7030_d: 135,
    ice_ame_mark_s: 175, ice_ame_mark_d: 235,
    ice_ame_arabica100_s: 195, ice_ame_arabica100_d: 265,

    ice_latte_robusta100_s: 175, ice_latte_robusta100_d: 215,
    ice_latte_robusta7030_s: 185, ice_latte_robusta7030_d: 225,
    ice_latte_mark_s: 225, ice_latte_mark_d: 325,
    ice_latte_arabica100_s: 275, ice_latte_arabica100_d: 335,

    ice_mocha_robusta100_s: 225, ice_mocha_robusta100_d: 265,
    ice_mocha_robusta7030_s: 225, ice_mocha_robusta7030_d: 275,
    ice_mocha_mark_s: 235, ice_mocha_mark_d: 275,
    ice_mocha_arabica100_s: 225, ice_mocha_arabica100_d: 295,

    ice_caramel_robusta100_s: 225, ice_caramel_robusta100_d: 265,
    ice_caramel_robusta7030_s: 225, ice_caramel_robusta7030_d: 275,
    ice_caramel_mark_s: 205, ice_caramel_mark_d: 275,
    ice_caramel_arabica100_s: 225, ice_caramel_arabica100_d: 295,

    ice_hazel_robusta100_s: 225, ice_hazel_robusta100_d: 265,
    ice_hazel_robusta7030_s: 225, ice_hazel_robusta7030_d: 275,
    ice_hazel_mark_s: 205, ice_hazel_mark_d: 275,
    ice_hazel_arabica100_s: 225, ice_hazel_arabica100_d: 295,

    // Matcha & Specialty
    matcha_mango: 300,
    matcha_strawberry: 280,
    matcha_coconut: 315,
    ginger_ice: 80,

    // Teas & Herbal
    tea_masala: 200,
    tea_karak: 200,
    damnoosh_energy: 60,
    damnoosh_aramsh: 60,
    damnoosh_laghari: 60,
    damnoosh_avishan: 60,
    damnoosh_gavzaban: 60,
    damnoosh_behlimo: 60
  }
};

const PERMANENT_BLOB_URL = 'https://fy19ibzbxkaeufs2.public.blob.vercel-storage.com/nadimi-menu-prices.json';
let memoryStore = { ...DEFAULT_STATE };
let lastSyncCheckTime = 0;

// High-speed sync: Reads latest state from Blob if not checked recently
async function syncLatestStore() {
  const now = Date.now();
  // Check Blob at most once every 800ms per container to ensure rapid global sync
  if (now - lastSyncCheckTime < 800 && memoryStore.lastUpdated) {
    return;
  }
  
  try {
    const fetchResp = await fetch(PERMANENT_BLOB_URL + '?t=' + now, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    if (fetchResp.ok) {
      const blobData = await fetchResp.json();
      if (blobData && blobData.prices) {
        // Blob is the true shared persistent source across all serverless instances
        const blobVer = blobData.version || 0;
        const memVer = memoryStore.version || 0;
        if (blobVer >= memVer || !memoryStore.lastUpdated) {
          memoryStore = { ...DEFAULT_STATE, ...blobData };
        }
        lastSyncCheckTime = now;
      }
    }
  } catch (e) {
    console.warn('Sync fetch warning:', e.message);
  }
  lastSyncCheckTime = now;
}

export default async function handler(req, res) {
  // Ultra-strict No-Cache headers so browsers and CDNs never deliver stale data
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Pragma');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Ensure up-to-date and return instantly
  if (req.method === 'GET') {
    await syncLatestStore();
    return res.status(200).json({
      success: true,
      data: memoryStore
    });
  }

  // POST: Partial or Full update with atomic persistence
  if (req.method === 'POST') {
    try {
      const incoming = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      // Update ONLY fields that are explicitly provided
      if (incoming.prices && typeof incoming.prices === 'object') {
        memoryStore.prices = { ...memoryStore.prices, ...incoming.prices };
      }
      if (incoming.theme !== undefined && incoming.theme !== null) {
        memoryStore.theme = String(incoming.theme);
      }
      if (incoming.mode !== undefined && incoming.mode !== null) {
        memoryStore.mode = String(incoming.mode);
      }
      if (incoming.schedule !== undefined && incoming.schedule !== null) {
        memoryStore.schedule = { ...memoryStore.schedule, ...incoming.schedule };
      }
      if (incoming.fontFamily !== undefined && incoming.fontFamily !== null) {
        memoryStore.fontFamily = String(incoming.fontFamily);
      }
      if (incoming.fontSizeScale !== undefined && incoming.fontSizeScale !== null) {
        memoryStore.fontSizeScale = parseInt(incoming.fontSizeScale, 10) || 100;
      }
      if (incoming.itemNameScale !== undefined && incoming.itemNameScale !== null) {
        memoryStore.itemNameScale = parseInt(incoming.itemNameScale, 10) || 100;
      }
      if (incoming.priceNumScale !== undefined && incoming.priceNumScale !== null) {
        memoryStore.priceNumScale = parseInt(incoming.priceNumScale, 10) || 100;
      }
      if (incoming.fullscreenToggleId !== undefined) {
        memoryStore.fullscreenToggleId = incoming.fullscreenToggleId;
      }
      if (incoming.headerLinks !== undefined) {
        memoryStore.headerLinks = incoming.headerLinks;
      }
      if (incoming.customCategories !== undefined) {
        memoryStore.customCategories = incoming.customCategories;
      }
      if (incoming.customItems !== undefined) {
        memoryStore.customItems = incoming.customItems;
      }
      
      memoryStore.version = (memoryStore.version || 0) + 1;
      memoryStore.lastUpdated = new Date().toISOString();
      lastSyncCheckTime = Date.now();

      // Background non-blocking persistence with waitUntil (Instant response in ~20ms!)
      waitUntil(
        put('nadimi-menu-prices.json', JSON.stringify(memoryStore), {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true
        }).catch(err => console.warn('Background put error:', err.message))
      );

      return res.status(200).json({
        success: true,
        message: 'همگام‌سازی انجام شد',
        data: memoryStore
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
