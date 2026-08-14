export type MonitorBridgeMessage =
  | { type: "monitor-enter" }
  | { type: "monitor-leave" }
  | { type: "os-ready" };

export function postToOs(message: MonitorBridgeMessage) {
  const iframe = document.getElementById("workbench-os") as HTMLIFrameElement | null;
  iframe?.contentWindow?.postMessage(message, "*");
}

export function onOsReady(callback: () => void) {
  const handler = (event: MessageEvent) => {
    if (event.data?.type === "os-ready") callback();
  };
  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}
