import { PraiseCard } from '../types';
import { CATEGORY_INFO, THEME_STYLES } from '../data/presetData';

export function generateCardPNGDataUrl(card: PraiseCard): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // High-DPI canvas
    const width = 800;
    const height = 1000;
    canvas.width = width;
    canvas.height = height;

    if (!ctx) {
      resolve('');
      return;
    }

    const theme = THEME_STYLES[card.theme] || THEME_STYLES.coral;
    const category = CATEGORY_INFO[card.category] || CATEGORY_INFO.kindness;

    // Background base
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Outer decorative border and card background
    const margin = 30;
    const cardW = width - margin * 2;
    const cardH = height - margin * 2;
    const rx = 40;

    // Draw card background rounded rect
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(margin, margin, cardW, cardH, rx);
    ctx.clip();

    // Create theme gradient
    const grad = ctx.createLinearGradient(margin, margin, margin + cardW, margin + cardH);
    if (card.theme === 'mint') {
      grad.addColorStop(0, '#e6fffa');
      grad.addColorStop(0.5, '#e6fcf5');
      grad.addColorStop(1, '#c3fae8');
    } else if (card.theme === 'yellow') {
      grad.addColorStop(0, '#fff9db');
      grad.addColorStop(0.5, '#fff3bf');
      grad.addColorStop(1, '#ffe066');
    } else if (card.theme === 'purple') {
      grad.addColorStop(0, '#f3d9fa');
      grad.addColorStop(0.5, '#eebefa');
      grad.addColorStop(1, '#e599f7');
    } else if (card.theme === 'blue') {
      grad.addColorStop(0, '#e7f5ff');
      grad.addColorStop(0.5, '#d0ebff');
      grad.addColorStop(1, '#a5d8ff');
    } else if (card.theme === 'rose') {
      grad.addColorStop(0, '#ffe3e3');
      grad.addColorStop(0.5, '#ffc9c9');
      grad.addColorStop(1, '#ffec99');
    } else {
      // coral default
      grad.addColorStop(0, '#fff5f5');
      grad.addColorStop(0.5, '#ffe3e3');
      grad.addColorStop(1, '#ffd8a8');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(margin, margin, cardW, cardH);

    // Decorative inner white card overlay
    const innerPadding = 35;
    const innerX = margin + innerPadding;
    const innerY = margin + 110;
    const innerW = cardW - innerPadding * 2;
    const innerH = cardH - 220;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.05)';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.roundRect(innerX, innerY, innerW, innerH, 24);
    ctx.fill();
    ctx.shadowColor = 'transparent'; // reset

    // Top Header: App Name & Class Badge
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 30px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    ctx.fillText('✨ 칭찬 릴레이 카드', margin + 35, margin + 65);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 22px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    ctx.fillText(`[ 학급 코드: ${card.classCode} ]`, margin + cardW - 200, margin + 65);

    // Recipient Section (To)
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    const receiverClassText = card.receiverClass ? `[${card.receiverClass}] ` : '';
    const toText = `To. ${receiverClassText}${card.receiverName} ${card.receiverAvatar}`;
    ctx.fillText(toText, innerX + 35, innerY + 65);

    // Category Tag Badge
    const tagX = innerX + innerW - 200;
    const tagY = innerY + 30;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(tagX, tagY, 160, 45, 20);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#334155';
    ctx.font = '600 20px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    ctx.fillText(`${category.icon} ${category.label}`, tagX + 18, tagY + 30);

    // Divider Line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(innerX + 35, innerY + 95);
    ctx.lineTo(innerX + innerW - 35, innerY + 95);
    ctx.stroke();

    // Content Body (Multi-line text wrapping)
    ctx.fillStyle = '#1e293b';
    ctx.font = '500 28px/1.6 "Pretendard", "Apple SD Gothic Neo", sans-serif';

    const words = card.content.split(' ');
    let line = '';
    let currentY = innerY + 155;
    const maxTextWidth = innerW - 70;
    const lineHeight = 46;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxTextWidth && n > 0) {
        ctx.fillText(line, innerX + 35, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, innerX + 35, currentY);

    // Stickers line at bottom of inner box
    if (card.stickers && card.stickers.length > 0) {
      ctx.font = '36px sans-serif';
      ctx.fillText(card.stickers.join('  '), innerX + 35, innerY + innerH - 35);
    }

    // Sender Section (From)
    const senderName = card.isAnonymous ? '익명의 친구 🕵️' : `${card.senderName} ${card.senderAvatar}`;
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 30px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`From. ${senderName}`, margin + cardW - 35, margin + cardH - 55);
    ctx.textAlign = 'left';

    // Footer copyright / Privacy badge
    ctx.fillStyle = '#64748b';
    ctx.font = '500 20px "Pretendard", "Apple SD Gothic Neo", sans-serif';
    ctx.fillText('🏫 우리 반 마음을 이어주는 칭찬 릴레이 (Local Storage Only)', margin + 35, margin + cardH - 55);

    ctx.restore();

    resolve(canvas.toDataURL('image/png'));
  });
}
