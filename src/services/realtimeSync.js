import mqtt from 'mqtt';

// Unique device ID for current browser session
export const DEVICE_ID = 'dev_' + Math.random().toString(36).substring(2, 9);

// Default public MQTT broker over Secure WebSockets (WSS)
// EMQX public broker supports free TLS WebSockets out of the box
const BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';
const FALLBACK_BROKER_URL = 'wss://test.mosquitto.org:8081';

// Room topic for TRIG GIATMARA Kangar Café
const DEFAULT_TOPIC = 'trig_gm_kangar/cafe/sync_v1';

class RealtimeSyncService {
  constructor() {
    this.client = null;
    this.broadcastChannel = null;
    this.listeners = new Set();
    this.status = 'disconnected'; // 'connecting', 'connected', 'disconnected', 'error'
    this.statusListeners = new Set();
    this.topic = DEFAULT_TOPIC;
    this.clientId = 'trig_' + DEVICE_ID;

    this.initBroadcastChannel();
    this.initMQTT();
  }

  // Layer 1: Local Cross-Tab / Cross-Window Sync (0ms latency on same device)
  initBroadcastChannel() {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel('trig_kangar_pos_sync');
        this.broadcastChannel.onmessage = (event) => {
          if (event && event.data && event.data.sender !== DEVICE_ID) {
            this.notifyListeners(event.data);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported or error:', e);
    }
  }

  // Layer 2: Cloud Sync over Secure WebSockets (Real-time cross-device Android Phone <-> Android Tab)
  initMQTT(useFallback = false) {
    if (typeof window === 'undefined') return;

    const url = useFallback ? FALLBACK_BROKER_URL : BROKER_URL;
    this.updateStatus('connecting');

    try {
      this.client = mqtt.connect(url, {
        clientId: this.clientId,
        clean: true,
        connectTimeout: 8000,
        reconnectPeriod: 5000,
        keepalive: 60
      });

      this.client.on('connect', () => {
        this.updateStatus('connected');
        this.client.subscribe(this.topic, { qos: 1 }, (err) => {
          if (err) {
            console.error('MQTT subscribe error:', err);
          }
        });
      });

      this.client.on('message', (topic, message) => {
        try {
          const payload = JSON.parse(message.toString());
          if (payload && payload.sender !== DEVICE_ID) {
            this.notifyListeners(payload);
          }
        } catch (e) {
          console.warn('Invalid incoming MQTT message:', e);
        }
      });

      this.client.on('error', (err) => {
        console.warn('MQTT connection error:', err);
        this.updateStatus('error');
        if (!useFallback) {
          setTimeout(() => this.initMQTT(true), 3000);
        }
      });

      this.client.on('close', () => {
        this.updateStatus('disconnected');
      });

      this.client.on('offline', () => {
        this.updateStatus('disconnected');
      });
    } catch (e) {
      console.warn('Failed to initialize MQTT client:', e);
      this.updateStatus('error');
    }
  }

  updateStatus(newStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.statusListeners.forEach(fn => fn(newStatus));
    }
  }

  onStatusChange(callback) {
    this.statusListeners.add(callback);
    callback(this.status);
    return () => this.statusListeners.delete(callback);
  }

  // Subscribe to real-time events
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach(fn => {
      try {
        fn(data);
      } catch (e) {
        console.error('Listener callback error:', e);
      }
    });
  }

  // Broadcast an event to all connected devices (Android Phones, Android Tabs, PCs)
  broadcast(eventType, payload) {
    const message = {
      type: eventType,
      payload,
      sender: DEVICE_ID,
      timestamp: Date.now()
    };

    // 1. Broadcast locally to other tabs/windows
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(message);
      } catch (e) {
        console.warn('BroadcastChannel post error:', e);
      }
    }

    // 2. Broadcast globally via Cloud MQTT WebSockets to all Android devices
    if (this.client && this.client.connected) {
      try {
        this.client.publish(this.topic, JSON.stringify(message), { qos: 1 });
      } catch (e) {
        console.warn('MQTT publish error:', e);
      }
    }
  }

  // Play crisp notification chime using Web Audio API (Zero external assets needed)
  playChime(type = 'new_order') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'new_order') {
        // Double ding-dong chime
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now); // D5
        osc1.frequency.setValueAtTime(880.00, now + 0.15); // A5
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.6);
      } else if (type === 'ready') {
        // High celebratory chime
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.24); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.36); // C6
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      }
    } catch (e) {
      // Audio autoplay policy might block if no user interaction yet, ignore safely
    }
  }
}

export const realtimeSync = new RealtimeSyncService();
export default realtimeSync;
