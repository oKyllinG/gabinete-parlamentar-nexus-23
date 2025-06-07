
export const exportToCSV = (data: any[], filename: string, headers: string[]) => {
  // Convert data to CSV format
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        let value = row[header];
        
        // Handle null, undefined, or missing values
        if (value === null || value === undefined) {
          value = '';
        }
        
        // Convert to string
        const stringValue = String(value);
        
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes(';')) {
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

export const exportContacts = (contacts: any[], selectedType?: string, startDate?: Date, endDate?: Date) => {
  // Filter contacts by type and date range
  let filteredContacts = contacts;
  
  if (selectedType && selectedType !== 'all') {
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
    'Numero',
    'Bairro',
    'Cidade',
    'CEP',
    'Estado',
    'Dia Nascimento',
    'Mes Nascimento',
    'Ano Nascimento',
    'Observacoes',
    'Data Criacao'
  ];

  // Map the data to match the headers exactly
  const mappedData = filteredContacts.map(contact => ({
    'Nome': contact.nome || '',
    'Sobrenome': contact.sobrenome || '',
    'Telefone': contact.telefone || '',
    'Email': contact.email || '',
    'Tipo': contact.tipo || '',
    'Cargo': contact.cargo || '',
    'Empresa': contact.empresa || '',
    'Rua': contact.endereco?.rua || '',
    'Numero': contact.endereco?.numero || '',
    'Bairro': contact.endereco?.bairro || '',
    'Cidade': contact.endereco?.cidade || '',
    'CEP': contact.endereco?.cep || '',
    'Estado': contact.endereco?.estado || '',
    'Dia Nascimento': contact.nascimento?.dia || '',
    'Mes Nascimento': contact.nascimento?.mes || '',
    'Ano Nascimento': contact.nascimento?.ano || '',
    'Observacoes': contact.observacoes || '',
    'Data Criacao': contact.dataCriacao ? new Date(contact.dataCriacao).toLocaleDateString('pt-BR') : ''
  }));

  const filename = `contatos_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(mappedData, filename, headers);
};

export const exportOficios = (oficios: any[], selectedType?: string, startDate?: Date, endDate?: Date, selectedMunicipio?: string, selectedOrgao?: string) => {
  // Filter oficios by type, date range, municipality and organ
  let filteredOficios = oficios;
  
  if (selectedType && selectedType !== 'all') {
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

  if (selectedMunicipio && selectedMunicipio !== 'all') {
    filteredOficios = filteredOficios.filter(oficio => oficio.municipio === selectedMunicipio);
  }

  if (selectedOrgao && selectedOrgao !== 'all') {
    filteredOficios = filteredOficios.filter(oficio => oficio.orgao === selectedOrgao);
  }

  const headers = [
    'Numero',
    'Data',
    'Tipo',
    'Assunto',
    'Destinatario',
    'Origem',
    'Orgao',
    'Municipio',
    'Responsavel',
    'Protocolo',
    'Evento',
    'Data Evento'
  ];

  // Map the data to match the headers exactly
  const mappedData = filteredOficios.map(oficio => ({
    'Numero': oficio.numero || '',
    'Data': oficio.data ? new Date(oficio.data).toLocaleDateString('pt-BR') : '',
    'Tipo': oficio.tipo || '',
    'Assunto': oficio.assunto || '',
    'Destinatario': oficio.destinatario || '',
    'Origem': oficio.origem || '',
    'Orgao': oficio.orgao || '',
    'Municipio': oficio.municipio || '',
    'Responsavel': oficio.responsavel || '',
    'Protocolo': oficio.protocolo || '',
    'Evento': oficio.evento || '',
    'Data Evento': oficio.dataEvento ? new Date(oficio.dataEvento).toLocaleDateString('pt-BR') : ''
  }));

  const filename = `oficios_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(mappedData, filename, headers);
};
