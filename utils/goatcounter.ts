declare global {
  interface Window {
    goatcounter: {
      count?: Function;
    };
  }
}

window.goatcounter = window.goatcounter || {};

export function emitEvent({
  path,
  title,
}: {
  path: string;
  title: string;
}): void {
  if (window.goatcounter.count) {
    window.goatcounter.count({
      path,
      title,
      event: true,
    });
  }
}
