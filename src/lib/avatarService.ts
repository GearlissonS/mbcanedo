// Serviço para upload e remoção de avatar de corretor
// Pode ser adaptado para Supabase Storage ou outro backend

export async function uploadAvatar(file: File, brokerId: string): Promise<string> {
  // Exemplo: compressão e upload para Supabase Storage
  // Retorna a URL do avatar
  // Aqui apenas simula o upload e retorna um dataUrl
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = String(e.target?.result);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 512, 512);
          const dataUrl = canvas.toDataURL('image/webp', 0.8);
          resolve(dataUrl);
        } else {
          reject('Erro ao processar imagem');
        }
      };
    };
    reader.onerror = () => reject('Erro ao ler arquivo');
    reader.readAsDataURL(file);
  });
}

export async function removeAvatar(brokerId: string): Promise<void> {
  // Exemplo: remover do Supabase Storage
  // Aqui apenas simula
  return Promise.resolve();
}
