export const addLogo = (doc: any, x: number, y: number, width: number) => {
  const logoUrl = 'https://imgur.com/DT6IwWn.jpg';
  try {
    doc.addImage(logoUrl, 'PNG', x, y, width, width * 0.3);
    return y + (width * 0.3) + 5;
  } catch (error) {
    console.error('Erro ao adicionar logo:', error);
    return y;
  }
};
