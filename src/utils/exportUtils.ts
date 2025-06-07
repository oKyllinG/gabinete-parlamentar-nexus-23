
export const exportToCSV = (data: any[], filename: string, headers: string[]) => {
  // Convert data to CSV format
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = getNestedValue(row, header);
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const getNestedValue = (obj: any, path: string): any => {
  if (path.includes('.')) {
    const keys = path.split('.');
    return keys.reduce((current, key) => current?.[key], obj);
  }
  return obj[path];
};

export const exportContacts = (contacts: any[]) => {
  const headers = [
    'nome',
    'sobrenome', 
    'telefone',
    'email',
    'tipo',
    'cargo',
    'empresa',
    'endereco.rua',
    'endereco.numero',
    'endereco.bairro',
    'endereco.cidade',
    'endereco.cep',
    'endereco.estado',
    'nascimento.dia',
    'nascimento.mes',
    'nascimento.ano',
    'observacoes',
    'dataCriacao'
  ];

  const filename = `contatos_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(contacts, filename, headers);
};

export const exportOficios = (oficios: any[]) => {
  const headers = [
    'numero',
    'dataFormatada',
    'tipo',
    'assunto',
    'destinatario',
    'origem',
    'orgao',
    'municipio',
    'responsavel',
    'protocolo',
    'evento',
    'dataEvento'
  ];

  const filename = `oficios_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(oficios, filename, headers);
};
