declare global {
  interface Window {
    goatcounter: {
      count?: Function;
      no_onload?: boolean;
    };
  }
}

if (typeof window !== 'undefined' && window.goatcounter) {
  if (window.location.hash === '#skipgc') {
    window.localStorage.setItem('skipgc', 't');
  }
  window.goatcounter = { no_onload: localStorage.getItem('skipgc') === 't' };
}

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
