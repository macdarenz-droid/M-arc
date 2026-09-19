/**
 * One photo from the camera or gallery, downscaled and compressed on the
 * device before it ever leaves it — the proxy only ever sees a small JPEG,
 * never the original. Plain web APIs throughout: they behave the same in
 * the Capacitor WebView and in a browser, so no extra native plugin or
 * permission is needed to declare.
 */
const MAX_DIMENSION = 900;
const QUALITY_STEPS = [0.72, 0.55, 0.4];
/** Base64 chars; comfortably under the proxy's per-request cap even before overhead. */
const TARGET_CHARS = 700_000;

export interface CapturedPhoto { mediaType: 'image/jpeg'; data: string }

function pickFile(): Promise<File | null> {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    // No "capture" attribute: that forces the camera open directly with no
    // way back out to the gallery or Files. Leaving it off shows the normal
    // Android/iOS chooser (camera, gallery, files), which is what a photo
    // taken earlier or a screenshot of a programme needs.
    input.style.display = 'none';
    const done = (file: File | null) => { resolve(file); input.remove(); };
    input.addEventListener('change', () => done(input.files?.[0] ?? null), { once: true });
    // Cancelling the picker fires "change" with no file on some browsers, "cancel" on others.
    input.addEventListener('cancel', () => done(null), { once: true });
    document.body.appendChild(input);
    input.click();
  });
}

async function toCanvas(file: File): Promise<HTMLCanvasElement> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas;
}

function canvasToBase64(canvas: HTMLCanvasElement, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) { reject(new Error('Could not encode the photo')); return; }
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
      reader.onerror = () => reject(reader.error ?? new Error('Could not read the photo'));
      reader.readAsDataURL(blob);
    }, 'image/jpeg', quality);
  });
}

/**
 * Opens the camera/gallery picker, downscales to at most 900px on the long
 * side and re-encodes as JPEG, stepping quality down until it is
 * comfortably small. Returns null when the person cancels rather than
 * throwing, since cancelling is not an error.
 */
export async function pickAndCompressPhoto(): Promise<CapturedPhoto | null> {
  const file = await pickFile();
  if (!file) return null;
  const canvas = await toCanvas(file);
  let data = '';
  for (const quality of QUALITY_STEPS) {
    data = await canvasToBase64(canvas, quality);
    if (data.length <= TARGET_CHARS) break;
  }
  return { mediaType: 'image/jpeg', data };
}
