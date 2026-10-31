import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TermLink } from "@/components/translator/TermLink";
import { Lock, ShieldAlert, Copy, Check } from "lucide-react";

interface PermSet {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export function PermissionsCalculator() {
  const [user, setUser] = useState<PermSet>({ read: true, write: true, execute: true });
  const [group, setGroup] = useState<PermSet>({ read: true, write: false, execute: true });
  const [others, setOthers] = useState<PermSet>({ read: true, write: false, execute: true });
  const [copied, setCopied] = useState(false);

  // Compute octal digits
  const calcOctal = (p: PermSet) => (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
  const octal = `${calcOctal(user)}${calcOctal(group)}${calcOctal(others)}`;

  // Compute symbolic representation
  const calcSymbolic = (p: PermSet) => `${p.read ? "r" : "-"}${p.write ? "w" : "-"}${p.execute ? "x" : "-"}`;
  const symbolic = `-${calcSymbolic(user)}${calcSymbolic(group)}${calcSymbolic(others)}`;

  const command = `chmod ${octal} myfile.sh`;

  const copyCommand = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (u: number, g: number, o: number) => {
    setUser({ read: (u & 4) !== 0, write: (u & 2) !== 0, execute: (u & 1) !== 0 });
    setGroup({ read: (g & 4) !== 0, write: (g & 2) !== 0, execute: (g & 1) !== 0 });
    setOthers({ read: (o & 4) !== 0, write: (o & 2) !== 0, execute: (o & 1) !== 0 });
  };

  return (
    <GlassPanel className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle pb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Lock className="text-cyan" size={22} />
            Interactive Linux Permissions Calculator
          </h3>
          <p className="text-xs text-ink-secondary mt-1">
            Toggle Read (4), Write (2), and Execute (1) bits to see how numeric octal modes and symbolic flags are calculated.
          </p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => applyPreset(7, 5, 5)}
            className="rounded border border-line-subtle bg-surface px-2.5 py-1 text-xs font-mono text-cyan hover:border-cyan"
          >
            755 (Program)
          </button>
          <button
            onClick={() => applyPreset(6, 4, 4)}
            className="rounded border border-line-subtle bg-surface px-2.5 py-1 text-xs font-mono text-electric hover:border-electric"
          >
            644 (Document)
          </button>
          <button
            onClick={() => applyPreset(6, 0, 0)}
            className="rounded border border-line-subtle bg-surface px-2.5 py-1 text-xs font-mono text-warning hover:border-warning"
          >
            600 (SSH Key)
          </button>
          <button
            onClick={() => applyPreset(7, 7, 7)}
            className="rounded border border-error/40 bg-error/10 px-2.5 py-1 text-xs font-mono text-error hover:bg-error/20"
          >
            777 (Insecure)
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Checkbox Matrix */}
        <div className="lg:col-span-7 space-y-4">
          {/* Owner Block */}
          <div className="rounded-xl border border-line-subtle bg-surface/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-ink-primary flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan" />
                User / Owner (u)
              </span>
              <span className="font-mono text-xs font-bold text-cyan">
                Value: {calcOctal(user)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex items-center gap-2 rounded bg-base/50 p-2 text-xs cursor-pointer hover:bg-base">
                <input
                  type="checkbox"
                  checked={user.read}
                  onChange={(e) => setUser({ ...user, read: e.target.checked })}
                  className="rounded border-line text-cyan focus:ring-cyan"
                />
                <span>Read (r = 4)</span>
              </label>
              <label className="flex items-center gap-2 rounded bg-base/50 p-2 text-xs cursor-pointer hover:bg-base">
                <input
                  type="checkbox"
                  checked={user.write}
                  onChange={(e) => setUser({ ...user, write: e.target.checked })}
                  className="rounded border-line text-cyan focus:ring-cyan"
                />
                <span>Write (w = 2)</span>
              </label>
              <label className="flex items-center gap-2 rounded bg-base/50 p-2 text-xs cursor-pointer hover:bg-base">
                <input
                  type="checkbox"
                  checked={user.execute}
                  onChange={(e) => setUser({ ...user, execute: e.target.checked })}
                  className="rounded border-line text-cyan focus:ring-cyan"
                />
                <span>Execute (x = 1)</span>
              </label>
            </div>
          </div>

          {/* Group Block */}
          <div className="rounded-xl border border-line-subtle bg-surface/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-ink-primary flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-electric" />
                Group (g)
              </span>
              <span className="font-mono text-xs font-bold text-electric">
                Value: {calcOctal(group)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex items-center gap-2 rounded bg-base/50 p-2 text-xs cursor-pointer hover:bg-base">
                <input
                  type="checkbox"
                  checked={group.read}
                  onChange={(e) => setGroup({ ...group, read: e.target.checked })}
                  className="rounded border-line text-electric focus:ring-electric"
                />
                <span>Read (r = 4)</span>
              </label>
              <label className="flex items-center gap-2 rounded bg-base/50 p-2 text-xs cursor-pointer hover:bg-base">
                <input
                  type="checkbox"
                  checked={group.write}
                  onChange={(e) => setGroup({ ...group, write: e.target.checked })}
                  className="rounded border-line text-electric focus:ring-electric"
                />
                <span>Write (w = 2)</span>
              </label>
              <label className="flex items-center gap-2 rounded bg-base/50 p-2 text-xs cursor-pointer hover:bg-base">
                <input
                  type="checkbox"
                  checked={group.execute}
                  onChange={(e) => setGroup({ ...group, execute: e.target.checked })}
                  className="rounded border-line text-electric focus:ring-electric"
                />
                <span>Execute (x = 1)</span>
              </label>
            </div>
          </div>

          {/* Others Block */}
          <div className="rounded-xl border border-line-subtle bg-surface/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-ink-primary flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet" />
                Others / World (o)
              </span>
              <span className="font-mono text-xs font-bold text-violet">
                Value: {calcOctal(others)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex items-center gap-2 rounded bg-base/50 p-2 text-xs cursor-pointer hover:bg-base">
                <input
                  type="checkbox"
                  checked={others.read}
                  onChange={(e) => setOthers({ ...others, read: e.target.checked })}
                  className="rounded border-line text-violet focus:ring-violet"
                />
                <span>Read (r = 4)</span>
              </label>
              <label className="flex items-center gap-2 rounded bg-base/50 p-2 text-xs cursor-pointer hover:bg-base">
                <input
                  type="checkbox"
                  checked={others.write}
                  onChange={(e) => setOthers({ ...others, write: e.target.checked })}
                  className="rounded border-line text-violet focus:ring-violet"
                />
                <span>Write (w = 2)</span>
              </label>
              <label className="flex items-center gap-2 rounded bg-base/50 p-2 text-xs cursor-pointer hover:bg-base">
                <input
                  type="checkbox"
                  checked={others.execute}
                  onChange={(e) => setOthers({ ...others, execute: e.target.checked })}
                  className="rounded border-line text-violet focus:ring-violet"
                />
                <span>Execute (x = 1)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Live Calculation Output Card */}
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-line-accent/50 bg-base/80 p-6 shadow-lg backdrop-blur-md h-full flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Calculated Mode:
              </p>

              <div className="mt-3 flex items-center justify-between border-b border-line-subtle pb-4">
                <div>
                  <span className="text-4xl font-mono font-extrabold text-cyan">
                    {octal}
                  </span>
                  <p className="text-xs font-mono text-ink-muted mt-1">Numeric (Octal)</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-bold text-ink-primary">
                    {symbolic}
                  </span>
                  <p className="text-xs font-mono text-ink-muted mt-1">Symbolic Representation</p>
                </div>
              </div>

              {/* Terminal command block */}
              <div className="mt-4">
                <p className="text-xs font-mono text-ink-muted mb-1.5">Apply with command:</p>
                <div className="flex items-center justify-between rounded-lg border border-line-subtle bg-void px-3 py-2 font-mono text-xs text-ink-primary">
                  <code>{command}</code>
                  <button
                    onClick={copyCommand}
                    className="ml-2 text-ink-muted hover:text-cyan transition-colors"
                    title="Copy command"
                  >
                    {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Plain English Translation */}
              <div className="mt-5 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-ink-secondary">
                  <span className="font-semibold text-cyan shrink-0">Owner:</span>
                  <span>
                    {user.read && user.write && user.execute
                      ? "Full read, write, and execute authority."
                      : [user.read && "Can read", user.write && "Can edit/delete", user.execute && "Can execute"]
                          .filter(Boolean)
                          .join(", ") || "No permissions."}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-ink-secondary">
                  <span className="font-semibold text-electric shrink-0">Group:</span>
                  <span>
                    {group.read && group.write && group.execute
                      ? "Full read, write, and execute authority."
                      : [group.read && "Can read", group.write && "Can edit/delete", group.execute && "Can execute"]
                          .filter(Boolean)
                          .join(", ") || "No permissions."}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-ink-secondary">
                  <span className="font-semibold text-violet shrink-0">Others:</span>
                  <span>
                    {others.read && others.write && others.execute
                      ? "Full read, write, and execute authority (Publicly vulnerable)."
                      : [others.read && "Can read", others.write && "Can edit/delete", others.execute && "Can execute"]
                          .filter(Boolean)
                          .join(", ") || "Zero access."}
                  </span>
                </div>
              </div>

              {/* Security Warning Badge */}
              {octal === "777" && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-error/40 bg-error/10 p-2.5 text-xs text-error">
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>
                    <strong>Warning:</strong> chmod 777 allows any process or unauthorized local user to overwrite or delete this file!
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-line-subtle pt-3 flex items-center justify-between text-xs text-ink-muted">
              <span>Security Model: Discretionary Access Control (DAC)</span>
              <TermLink term="permissions">Review Rules</TermLink>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
