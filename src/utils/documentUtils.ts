export const addLogo = (doc: any, x: number, y: number, width: number) => {
  const logoUrl = 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=200';
  try {
    doc.addImage(logoUrl, 'JPEG', x, y, width, width * 0.3);
    return y + (width * 0.3) + 5;
  } catch (error) {
    console.error('Error adding logo:', error);
    return y;
  }
};