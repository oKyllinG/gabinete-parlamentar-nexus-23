

export const exportToCSV = (data: any[], filename: string, headers: string[]) => {
  // Convert data to CSV format using semicolon separator (Brazilian standard)
  const csvContent = [
    headers.join(';'), // Header row with semicolon separator
    ...data.map(row => 
      headers.map(header => {
        let value = row[header];
        
        // Handle null, undefined, or missing values
        if (value === null || value === undefined) {
          value = '';
        }
        
        // Convert to string
        const stringValue = String(value);
        
        // Always wrap in quotes to ensure proper column separation
        // Escape internal quotes by doubling them
        const escapedValue = stringValue.replace(/"/g, '""');
        return `"${escapedValue}"`;
      }).join(';') // Use semicolon separator
    )
  ].join('\n');

  // Add BOM for proper UTF-8 encoding in Excel and use semicolon-compatible MIME type
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Clean up the URL object
    URL.revokeObjectURL(url);
  }
};

export const exportToPDF = (data: any[], filename: string, headers: string[], title: string) => {
  // Create a simple HTML structure for PDF generation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .summary { margin-bottom: 20px; padding: 10px; background-color: #f0f8ff; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="summary">
        <p><strong>Total de registros:</strong> ${data.length}</p>
        <p><strong>Data da exportação:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
      </div>
      <table>
        <thead>
          <tr>
            ${headers.map(header => `<th>${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

export const exportEmendas = (emendas: any[], selectedType?: string, selectedStatus?: string, startDate?: Date, endDate?: Date) => {
  // Filter emendas by type, status and date range
  let filteredEmendas = emendas;
  
  if (selectedType && selectedType !== 'all') {
    filteredEmendas = filteredEmendas.filter(emenda => emenda.tipo === selectedType);
  }
  
  if (selectedStatus && selectedStatus !== 'all') {
    filteredEmendas = filteredEmendas.filter(emenda => emenda.status === selectedStatus);
  }
  
  if (startDate) {
    filteredEmendas = filteredEmendas.filter(emenda => 
      new Date(emenda.dataCriacao) >= startDate
    );
  }
  
  if (endDate) {
    filteredEmendas = filteredEmendas.filter(emenda => 
      new Date(emenda.dataCriacao) <= endDate
    );
  }

  const headers = [
    'Numero',
    'Ano',
    'Tipo',
    'Autor',
    'Programa',
    'Acao',
    'Localizador',
    'Valor',
    'Valor Destinado',
    'Valor Disponivel',
    'Prazo Execucao',
    'Objeto',
    'Justificativa',
    'Status',
    'Observacoes',
    'Data Criacao',
    'Destinacoes'
  ];

  // Map the data to match the headers exactly
  const mappedData = filteredEmendas.map(emenda => ({
    'Numero': emenda.numero || '',
    'Ano': emenda.ano || '',
    'Tipo': emenda.tipo || '',
    'Autor': emenda.autor || '',
    'Programa': emenda.programa || '',
    'Acao': emenda.acao || '',
    'Localizador': emenda.localizador || '',
    'Valor': emenda.valor ? emenda.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
    'Valor Destinado': emenda.valorDestinado ? emenda.valorDestinado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
    'Valor Disponivel': emenda.valor && emenda.valorDestinado ? (emenda.valor - emenda.valorDestinado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
    'Prazo Execucao': emenda.prazoExecucao || '',
    'Objeto': emenda.objeto || '',
    'Justificativa': emenda.justificativa || '',
    'Status': emenda.status || '',
    'Observacoes': emenda.observacoes || '',
    'Data Criacao': emenda.dataCriacao ? new Date(emenda.dataCriacao).toLocaleDateString('pt-BR') : '',
    'Destinacoes': emenda.destinacoes ? emenda.destinacoes.map((d: any) => `${d.destinatario} (${d.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`).join('; ') : ''
  }));

  const filename = `emendas_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(mappedData, filename, headers);
};

export const exportObras = (obras: any[], format: "pdf" | "csv" = "csv", selectedMunicipio?: string, selectedStatus?: string, selectedCategoria?: string, selectedArea?: string, startDate?: Date, endDate?: Date) => {
  // Filter obras by municipality, status, category, area and date range
  let filteredObras = obras;
  
  if (selectedMunicipio && selectedMunicipio !== 'all') {
    filteredObras = filteredObras.filter(obra => obra.municipio === selectedMunicipio);
  }
  
  if (selectedStatus && selectedStatus !== 'all') {
    filteredObras = filteredObras.filter(obra => obra.status === selectedStatus);
  }
  
  if (selectedCategoria && selectedCategoria !== 'all') {
    filteredObras = filteredObras.filter(obra => obra.categoria === selectedCategoria);
  }
  
  if (selectedArea && selectedArea !== 'all') {
    filteredObras = filteredObras.filter(obra => obra.area === selectedArea);
  }
  
  if (startDate) {
    filteredObras = filteredObras.filter(obra => 
      obra.dataInicio && new Date(obra.dataInicio) >= startDate
    );
  }
  
  if (endDate) {
    filteredObras = filteredObras.filter(obra => 
      obra.dataTermino && new Date(obra.dataTermino) <= endDate
    );
  }

  const headers = [
    'Nome',
    'Municipio',
    'Categoria',
    'Area',
    'Status',
    'Valor Total',
    'Percentual Execucao',
    'Data Inicio',
    'Data Termino',
    'Responsavel Gabinete'
  ];

  // Map the data to match the headers exactly
  const mappedData = filteredObras.map(obra => ({
    'Nome': obra.nome || '',
    'Municipio': obra.municipio || '',
    'Categoria': obra.categoria || '',
    'Area': obra.area || '',
    'Status': obra.status || '',
    'Valor Total': obra.valorTotal ? obra.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
    'Percentual Execucao': obra.percentualExecucao ? `${obra.percentualExecucao}%` : '0%',
    'Data Inicio': obra.dataInicio ? new Date(obra.dataInicio).toLocaleDateString('pt-BR') : '',
    'Data Termino': obra.dataTermino ? new Date(obra.dataTermino).toLocaleDateString('pt-BR') : '',
    'Responsavel Gabinete': obra.responsavelGabinete || ''
  }));

  const timestamp = new Date().toISOString().split('T')[0];
  
  if (format === "pdf") {
    const filename = `obras_${timestamp}.html`;
    exportToPDF(mappedData, filename, headers, "Relatório de Obras e Equipamentos");
  } else {
    const filename = `obras_${timestamp}.csv`;
    exportToCSV(mappedData, filename, headers);
  }
};

