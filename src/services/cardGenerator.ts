import { PokemonApiData, PokemonMatchResult } from './api';

/**
 * Generates a high-resolution shareable PNG image card using HTML5 Canvas.
 */
export async function generateResultCard(
  match: PokemonMatchResult,
  pokemonData: PokemonApiData,
  includeUserPhoto: boolean,
  userPhotoUrl: string | null
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize canvas context');

  // Background Gradient (Sleek dark Poké-deck theme)
  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
  bgGrad.addColorStop(0, '#0f172a'); // slate-900
  bgGrad.addColorStop(0.5, '#1e293b'); // slate-800
  bgGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1350);

  // Decorative Pokéball Background Motif (subtle watermark)
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(880, 200, 260, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(620, 200);
  ctx.lineTo(1140, 200);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(880, 200, 70, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Outer border & card header container
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'; // Poké red subtle
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, 1008, 1278);

  // App Brand Header
  ctx.fillStyle = '#ef4444'; // Red accent
  ctx.beginPath();
  ctx.arc(90, 96, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 36px "Outfit", sans-serif';
  ctx.fillText('PokéLook', 124, 106);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Which Pokémon Do You Look Like?', 320, 104);

  // Main Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 48px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Your Pokémon Lookalike Is...', 540, 200);

  // Content Area: Either side-by-side (if user photo included) or centered showcase
  if (includeUserPhoto && userPhotoUrl) {
    // Two panels side-by-side
    // User Photo Panel
    const userImg = await loadImage(userPhotoUrl);
    drawRoundedPanel(ctx, 90, 240, 420, 440, 24, '#1e293b');
    drawClippedImage(ctx, userImg, 100, 250, 400, 420, 18);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Your Photo', 300, 715);

    // Pokémon Panel
    const pokeImg = await loadImage(pokemonData.artworkUrl);
    drawRoundedPanel(ctx, 570, 240, 420, 440, 24, '#1e293b');
    drawClippedImage(ctx, pokeImg, 580, 250, 400, 420, 18, true);

    ctx.fillStyle = '#facc15';
    ctx.font = '700 28px "Outfit", sans-serif';
    ctx.fillText(`${pokemonData.displayName} (#${pokemonData.id})`, 780, 715);
  } else {
    // Single grand Pokémon showcase
    const pokeImg = await loadImage(pokemonData.artworkUrl);
    drawRoundedPanel(ctx, 290, 240, 500, 460, 28, '#1e293b');
    drawClippedImage(ctx, pokeImg, 300, 250, 480, 440, 20, true);

    ctx.fillStyle = '#facc15';
    ctx.font = '800 42px "Outfit", sans-serif';
    ctx.fillText(`${pokemonData.displayName}`, 540, 750);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `Pokédex #${pokemonData.id} · ${pokemonData.types.join(' / ').toUpperCase()}`,
      540,
      785
    );
  }

  // Explanation Banner
  ctx.textAlign = 'center';
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, `"${match.explanation}"`, 540, 840, 920, 36);

  // Visual Reasons Container
  drawRoundedPanel(ctx, 90, 930, 900, 280, 20, '#111827');

  ctx.textAlign = 'left';
  ctx.fillStyle = '#38bdf8';
  ctx.font = '700 22px "Outfit", sans-serif';
  ctx.fillText('KEY VISUAL CONNECTIONS', 130, 975);

  ctx.fillStyle = '#f1f5f9';
  ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
  const reasons = match.visualReasons.slice(0, 3);
  reasons.forEach((reason, index) => {
    const y = 1025 + index * 52;
    // Bullet marker
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(140, y - 8, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.fillText(reason, 165, y);
  });

  // Footer Disclaimer & Attribution
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748b';
  ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    'Just for fun! Result based on visual styling and expression · Pokémon data: PokéAPI',
    540,
    1255
  );
  ctx.fillText(
    'Unofficial educational fan project. Not affiliated with or endorsed by Pokémon.',
    540,
    1285
  );

  return canvas.toDataURL('image/png');
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from ${src}`));
    img.src = src;
  });
}

function drawRoundedPanel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fillColor: string
) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawClippedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  contain = false
) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.clip();

  if (contain) {
    // Preserve aspect ratio inside panel
    const scale = Math.min(w / img.width, h / img.height) * 0.9;
    const iw = img.width * scale;
    const ih = img.height * scale;
    const ix = x + (w - iw) / 2;
    const iy = y + (h - ih) / 2;
    ctx.drawImage(img, ix, iy, iw, ih);
  } else {
    // Cover fill (for user photo)
    const scale = Math.max(w / img.width, h / img.height);
    const iw = img.width * scale;
    const ih = img.height * scale;
    const ix = x + (w - iw) / 2;
    const iy = y + (h - ih) / 2;
    ctx.drawImage(img, ix, iy, iw, ih);
  }
  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}
