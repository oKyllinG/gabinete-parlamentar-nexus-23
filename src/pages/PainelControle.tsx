
const PainelControle = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Painel de Controle</h1>
        <p className="text-muted-foreground">
          Dashboard executivo do sistema de gestão
        </p>
      </div>
      
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="text-6xl">📊</div>
          <h2 className="text-xl font-semibold text-muted-foreground">
            Painel de Controle
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Este módulo será desenvolvido para apresentar métricas e indicadores executivos do gabinete.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PainelControle
