export interface SampledImage {
  positions: Float32Array;
  colors: Float32Array;
  count: number;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function sampleImageToPoints(
  img: HTMLImageElement,
  width: number,
  height: number,
  step: number
): SampledImage {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");

  const scale = Math.max(width / img.width, height / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const dx = (width - drawW) / 2;
  const dy = (height - drawH) / 2;
  ctx.drawImage(img, dx, dy, drawW, drawH);

  const { data } = ctx.getImageData(0, 0, width, height);

  const cols = Math.floor(width / step);
  const rows = Math.floor(height / step);
  const count = cols * rows;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  let i = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const px = Math.min(width - 1, col * step + step / 2);
      const py = Math.min(height - 1, row * step + step / 2);
      const idx = (Math.floor(py) * width + Math.floor(px)) * 4;

      positions[i * 3] = px - width / 2;
      positions[i * 3 + 1] = height / 2 - py;
      positions[i * 3 + 2] = 0;

      colors[i * 3] = data[idx] / 255;
      colors[i * 3 + 1] = data[idx + 1] / 255;
      colors[i * 3 + 2] = data[idx + 2] / 255;

      i++;
    }
  }

  return { positions, colors, count };
}

export function scatterPositions(
  count: number,
  spread: { x: number; y: number; z: number }
): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * spread.x;
    arr[i * 3 + 1] = (Math.random() - 0.5) * spread.y;
    arr[i * 3 + 2] = (Math.random() - 0.5) * spread.z;
  }
  return arr;
}
