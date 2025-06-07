
export const exportToCSV = (data: any[], filename: string, headers: string[]) => {
  // Convert data to CSV format
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = getNestedValue(row, header);
        // Convert to string and escape quotes
        const stringValue = String(value || '');
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  // Add BOM for proper UTF-8 encoding in Excel
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
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

export const exportContacts = (contacts: any[], selectedType?: string, startDate?: Date, endDate?: Date) => {
  // Filter contacts by type and date range
  let filteredContacts = contacts;
  
  if (selectedType) {
    filteredContacts = filteredContacts.filter(contact => contact.tipo === selectedType);
  }
  
  if (startDate) {
    filteredContacts = filteredContacts.filter(contact => 
      new Date(contact.dataCriacao) >= startDate
    );
  }
  
  if (endDate) {
    filteredContacts = filteredContacts.filter(contact => 
      new Date(contact.dataCriacao) <= endDate
    );
  }

  const headers = [
    'Nome',
    'Sobrenome', 
    'Telefone',
    'Email',
    'Tipo',
    'Cargo',
    'Empresa',
    'Rua',
    'Número',
    'Bairro',
    'Cidade',
    'CEP',
    'Estado',
    'Dia Nascimento',
    'Mês Nascimento',
    'Ano Nascimento',
    'Observações',
    'Data Criação'
  ];

  // Map the data to match the headers
  const mappedData = filteredContacts.map(contact => ({
    'Nome': contact.nome,
    'Sobrenome': contact.sobrenome,
    'Telefone': contact.telefone,
    'Email': contact.email,
    'Tipo': contact.tipo,
    'Cargo': contact.cargo || '',
    'Empresa': contact.empresa || '',
    'Rua': contact.endereco?.rua || '',
    'Número': contact.endereco?.numero || '',
    'Bairro': contact.endereco?.bairro || '',
    'Cidade': contact.endereco?.cidade || '',
    'CEP': contact.endereco?.cep || '',
    'Estado': contact.endereco?.estado || '',
    'Dia Nascimento': contact.nascimento?.dia || '',
    'Mês Nascimento': contact.nascimento?.mes || '',
    'Ano Nascimento': contact.nascimento?.ano || '',
    'Observações': contact.observacoes || '',
    'Data Criação': new Date(contact.dataCriacao).toLocaleDateString('pt-BR')
  }));

  const filename = `contatos_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(mappedData, filename, headers);
};

export const exportOficios = (oficios: any[], selectedType?: string, startDate?: Date, endDate?: Date, selectedMunicipio?: string, selectedOrgao?: string) => {
  // Filter oficios by type, date range, municipality and organ
  let filteredOficios = oficios;
  
  if (selectedType) {
    filteredOficios = filteredOficios.filter(oficio => oficio.tipo === selectedType);
  }
  
  if (startDate) {
    filteredOficios = filteredOficios.filter(oficio => 
      new Date(oficio.data) >= startDate
    );
  }
  
  if (endDate) {
    filteredOficios = filteredOficios.filter(oficio => 
      new Date(oficio.data) <= endDate
    );
  }

  if (selectedMunicipio) {
    filteredOficios = filteredOficios.filter(oficio => oficio.municipio === selectedMunicipio);
  }

  if (selectedOrgao) {
    filteredOficios = filteredOficios.filter(oficio => oficio.orgao === selectedOrgao);
  }

  const headers = [
    'Número',
    'Data',
    'Tipo',
    'Assunto',
    'Destinatário',
    'Origem',
    'Órgão',
    'Município',
    'Responsável',
    'Protocolo',
    'Evento',
    'Data Evento'
  ];

  // Map the data to match the headers
  const mappedData = filteredOficios.map(oficio => ({
    'Número': oficio.numero,
    'Data': oficio.dataFormatada || new Date(oficio.data).toLocaleDateString('pt-BR'),
    'Tipo': oficio.tipo,
    'Assunto': oficio.assunto,
    'Destinatário': oficio.destinatario || '',
    'Origem': oficio.origem || '',
    'Órgão': oficio.orgao || '',
    'Município': oficio.municipio || '',
    'Responsável': oficio.responsavel || '',
    'Protocolo': oficio.protocolo || '',
    'Evento': oficio.evento || '',
    'Data Evento': oficio.dataEvento ? new Date(oficio.dataEvento).toLocaleDateString('pt-BR') : ''
  }));

  const filename = `oficios_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(mappedData, filename, headers);
};
