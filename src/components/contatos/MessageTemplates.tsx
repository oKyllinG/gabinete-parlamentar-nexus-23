
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, MessageSquare } from "lucide-react";
import { MessageTemplate } from "./WhatsAppTab";

interface MessageTemplatesProps {
  templates: MessageTemplate[];
  onTemplateSelect: (template: MessageTemplate) => void;
  onClose: () => void;
  onTemplatesChange: (templates: MessageTemplate[]) => void;
}

const categoryLabels = {
  general: 'Geral',
  birthday: 'Aniversário',
  event: 'Evento',
  custom: 'Personalizado'
};

const categoryColors = {
  general: 'bg-blue-100 text-blue-800',
  birthday: 'bg-pink-100 text-pink-800',
  event: 'bg-green-100 text-green-800',
  custom: 'bg-purple-100 text-purple-800'
};

export const MessageTemplates: React.FC<MessageTemplatesProps> = ({
  templates,
  onTemplateSelect,
  onClose,
  onTemplatesChange
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    category: 'general' as MessageTemplate['category']
  });

  const handleSaveTemplate = () => {
    if (!formData.name.trim() || !formData.content.trim()) return;

    if (editingTemplate) {
      // Editar template existente
      const updatedTemplates = templates.map(t =>
        t.id === editingTemplate.id
          ? { ...editingTemplate, ...formData }
          : t
      );
      onTemplatesChange(updatedTemplates);
    } else {
      // Criar novo template
      const newTemplate: MessageTemplate = {
        id: Date.now().toString(),
        ...formData
      };
      onTemplatesChange([...templates, newTemplate]);
    }

    handleCloseForm();
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    onTemplatesChange(updatedTemplates);
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      content: template.content,
      category: template.category
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTemplate(null);
    setFormData({ name: '', content: '', category: 'general' });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Templates de Mensagem
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {showForm ? (
            <div className="space-y-4 p-4">
              <div>
                <Label htmlFor="template-name">Nome do Template</Label>
                <Input
                  id="template-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Saudação de Bom Dia"
                />
              </div>

              <div>
                <Label htmlFor="template-category">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: MessageTemplate['category']) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="template-content">Conteúdo da Mensagem</Label>
                <Textarea
                  id="template-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Digite o conteúdo do template..."
                  className="min-h-[120px]"
                  maxLength={1000}
                />
                <div className="text-sm text-muted-foreground mt-1">
                  {formData.content.length}/1000 caracteres
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveTemplate} disabled={!formData.name.trim() || !formData.content.trim()}>
                  {editingTemplate ? 'Atualizar' : 'Criar'} Template
                </Button>
                <Button variant="outline" onClick={handleCloseForm}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-4">
                <p className="text-sm text-muted-foreground">
                  {templates.length} template(s) disponível(is)
                </p>
                <Button onClick={() => setShowForm(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Template
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-h-[400px] overflow-y-auto">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                          <Badge className={`${categoryColors[template.category]} text-xs mt-1`}>
                            {categoryLabels[template.category]}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {template.content}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => onTemplateSelect(template)}
                        className="w-full"
                      >
                        Usar Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {templates.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum template criado ainda</p>
                    <p className="text-sm mt-1">Clique em "Novo Template" para começar</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
