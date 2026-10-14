import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Cpu, Smartphone, ShieldCheck, Wifi, ExternalLink } from 'lucide-react';

export const HardwareIntegrationModal: React.FC = () => {
  const { isHardwareModalOpen, closeHardwareModal, hardwareModalTitle } = useApp();

  if (!isHardwareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold leading-none">{hardwareModalTitle}</h3>
              <p className="text-xs text-slate-400 mt-1">CoreNode Device & Biometric Bridge</p>
            </div>
          </div>
          <button
            onClick={closeHardwareModal}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-slate-600">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Simulated Demo Environment:</strong>
              <p className="mt-0.5 text-amber-800">
                This presentation environment operates using browser-simulated timestamps and local records. Real biometric devices (ZKTeco, eSSL, Realtime) connect via our on-premise CoreNode Agent service in production.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Supported Hardware & Telemetry Ecosystem:
            </h4>

            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
              <div className="p-3 flex items-center gap-3">
                <Wifi className="w-5 h-5 text-indigo-600 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 text-xs">Biometric Fingerprint & RFID Readers</div>
                  <div className="text-[11px] text-slate-500">eSSL, ZKTeco, BioMax sync via TCP/IP or Cloud Webhook API.</div>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Ready in Prod
                </span>
              </div>

              <div className="p-3 flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-teal-600 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 text-xs">Tablet Kiosk with Face AI</div>
                  <div className="text-[11px] text-slate-500">Front-of-house Android/iPad kiosk with anti-spoofing face scan.</div>
                </div>
                <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  Add-on
                </span>
              </div>

              <div className="p-3 flex items-center gap-3">
                <Cpu className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 text-xs">Geofenced GPS Mobile Punch</div>
                  <div className="text-[11px] text-slate-500">Field staff & delivery partners check in strictly within 50m radius.</div>
                </div>
                <span className="text-[10px] font-semibold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                  Included
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">CoreNode IoT Bridge v2.4</span>
          <button
            onClick={closeHardwareModal}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Got it, Return to Demo
          </button>
        </div>
      </div>
    </div>
  );
};
