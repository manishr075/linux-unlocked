import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TermLink } from "@/components/translator/TermLink";
import { Cpu, Layers, Terminal, Shield, ArrowDown, ArrowUp } from "lucide-react";

interface LayerInfo {
  id: string;
  name: string;
  ring: string;
  role: string;
  examples: string[];
  syscalls?: string[];
  color: string;
  analogy: string;
}

const LAYERS: LayerInfo[] = [
  {
    id: "userland",
    name: "User Space (Applications & Tools)",
    ring: "Ring 3 (Unprivileged)",
    role: "Where your everyday programs execute with restricted privileges. Applications cannot directly touch hardware or physical RAM addresses without asking the kernel.",
    examples: ["Firefox", "VS Code", "Steam", "bash", "grep", "GNOME Shell"],
    color: "border-cyan/40 bg-cyan/5 text-cyan",
    analogy: "Citizens of a city who must go to the official city hall window to register permits or request resources.",
  },
  {
    id: "glibc",
    name: "GNU C Library & System Call Interface (Syscalls)",
    ring: "Bridge (Ring 3 → Ring 0)",
    role: "The standardized translation gateway. When a program wants to read a file or send a network packet, it calls POSIX functions in glibc, which triggers a hardware software interrupt (syscall).",
    examples: ["glibc", "musl libc", "POSIX API wrappers"],
    syscalls: ["sys_read()", "sys_write()", "sys_open()", "sys_fork()", "sys_mmap()", "sys_socket()"],
    color: "border-electric/40 bg-electric/5 text-electric",
    analogy: "The secure bank teller window or consular desk where official requests are validated before entry.",
  },
  {
    id: "kernel",
    name: "Kernel Space (Monolithic Linux Kernel)",
    ring: "Ring 0 (Fully Privileged)",
    role: "The supreme supervisor. Runs with full hardware access. Manages memory paging, schedules process threads, routes network packets, and enforces permission boundaries.",
    examples: ["Process Scheduler (EEVDF)", "Memory Manager", "Virtual Filesystem (VFS)", "Netfilter", "Device Drivers"],
    color: "border-violet/40 bg-violet/5 text-violet",
    analogy: "The city's air traffic control and electrical grid operators controlling the entire physical infrastructure.",
  },
  {
    id: "hardware",
    name: "Physical Hardware (Silicon & Busses)",
    ring: "Physical Layer",
    role: "The physical silicon executing CPU machine code instructions, storing bits in DRAM capacitors, and writing magnetic/NAND memory blocks on SSDs.",
    examples: ["CPU (x86_64 / ARM64)", "RAM", "NVMe SSD", "GPU", "NIC Network Card", "PCIe Bus"],
    color: "border-success/40 bg-success/5 text-success",
    analogy: "The physical roads, electrical wiring, and physical land upon which the entire civilization rests.",
  },
];

export function KernelUserlandDiagram() {
  const [selectedLayer, setSelectedLayer] = useState<LayerInfo>(LAYERS[0]);

  return (
    <GlassPanel className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle pb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Layers className="text-cyan" size={22} />
            The Two Worlds: User Space vs. Kernel Space
          </h3>
          <p className="text-xs text-ink-secondary mt-1">
            Click any layer to inspect privilege levels, boundaries, and system call handshakes.
          </p>
        </div>
        <span className="rounded-full bg-cyan/10 px-3 py-1 font-mono text-xs font-semibold text-cyan">
          Interactive Architecture Model
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Interactive Layer Visualizer */}
        <div className="space-y-3 lg:col-span-7">
          {LAYERS.map((layer, index) => {
            const isSelected = selectedLayer.id === layer.id;
            return (
              <div key={layer.id} className="relative">
                <button
                  type="button"
                  onClick={() => setSelectedLayer(layer)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? `border-2 ${layer.color} shadow-glow scale-[1.01]`
                      : "border-line-subtle bg-surface/60 hover:bg-surface hover:border-line text-ink-secondary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase font-bold tracking-wider">
                      {layer.ring}
                    </span>
                    {index === 0 && <Terminal size={16} className="text-cyan" />}
                    {index === 1 && <ArrowDown size={16} className="text-electric" />}
                    {index === 2 && <Shield size={16} className="text-violet" />}
                    {index === 3 && <Cpu size={16} className="text-success" />}
                  </div>
                  <h4 className="mt-1 font-bold text-ink-primary md:text-base">
                    {layer.name}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-secondary">
                    {layer.role}
                  </p>
                </button>

                {/* Animated transition indicator between Userland and Kernel */}
                {index === 1 && (
                  <div className="my-1.5 flex items-center justify-center gap-2 font-mono text-[10px] text-ink-muted">
                    <ArrowDown size={12} className="text-cyan animate-bounce" />
                    <span>System Call Transition (Context Switch)</span>
                    <ArrowUp size={12} className="text-cyan animate-bounce" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Layer Deep Dive Detail Card */}
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-line-accent/50 bg-base/80 p-6 shadow-lg backdrop-blur-md h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan">
                  {selectedLayer.ring}
                </span>
                <span className="rounded bg-elevated px-2 py-0.5 font-mono text-[11px] text-ink-muted">
                  Linux Architecture
                </span>
              </div>

              <h4 className="mt-2 text-xl font-bold text-ink-primary">
                {selectedLayer.name}
              </h4>

              <p className="mt-3 text-sm text-ink-secondary leading-relaxed">
                {selectedLayer.role}
              </p>

              {/* Analogy Box */}
              <div className="mt-4 rounded-lg border border-line-subtle bg-surface/50 p-3">
                <p className="text-xs font-semibold text-cyan">Everyday Analogy</p>
                <p className="mt-1 text-xs text-ink-secondary italic">
                  "{selectedLayer.analogy}"
                </p>
              </div>

              {/* Examples */}
              <div className="mt-5">
                <p className="text-xs font-mono font-semibold uppercase text-ink-muted">
                  Representative Components:
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedLayer.examples.map((ex) => (
                    <span
                      key={ex}
                      className="rounded border border-line-subtle bg-elevated px-2 py-0.5 font-mono text-xs text-ink-primary"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              {/* Syscalls (if applicable) */}
              {selectedLayer.syscalls && (
                <div className="mt-4">
                  <p className="text-xs font-mono font-semibold uppercase text-electric">
                    Common System Calls (C to Kernel):
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedLayer.syscalls.map((sc) => (
                      <span
                        key={sc}
                        className="rounded border border-electric/30 bg-electric/10 px-2 py-0.5 font-mono text-xs text-electric"
                      >
                        {sc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-line-subtle pt-3 text-[11px] text-ink-muted flex items-center justify-between">
              <span>Security: Hardware privilege isolation</span>
              <TermLink term="kernel">Open in Translator</TermLink>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
