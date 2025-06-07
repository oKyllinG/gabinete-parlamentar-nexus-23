
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageCircle, Gift, Cake } from "lucide-react";
import { Contact } from "@/pages/Contatos";

interface BirthdayListProps {
  contacts: Contact[];
}

const tipoColors = {
  servidor: 'bg-blue-100 text-blue-800 border-blue-200',
  lideranca: 'bg-green-100 text-green-800 border-green-200',
  empresario: 'bg-purple-100 text-purple-800 border-purple-200',
  cidadao: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  politico: 'bg-red-100 text-red-800 border-red-200'
};

const tipoLabels = {
  servidor: 'Servidor',
  lideranca: 'Liderança',
  empresario: 'Empresário',
  cidadao: 'Cidadão',
  politico: 'Político'
};

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const BirthdayList: React.FC<BirthdayListProps> = ({ contacts }) => {
  const { todayBirthdays, upcomingBirthdays, birthdaysByMonth } = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    
    const contactsWithBirthday = contacts.filter(contact => 
      contact.nascimento && contact.nascimento.dia && contact.nascimento.mes
    );

    const todayBirthdays = contactsWithBirthday.filter(contact => 
      contact.nascimento!.dia === currentDay && contact.nascimento!.mes === currentMonth
    );

    const upcomingBirthdays = contactsWithBirthday
      .filter(contact => {
        const birthMonth = contact.nascimento!.mes;
        const birthDay = contact.nascimento!.dia;
        
        if (birthMonth === currentMonth) {
          return birthDay > currentDay;
        }
        
        const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
        return birthMonth === nextMonth;
      })
      .sort((a, b) => {
        const aMonth = a.nascimento!.mes;
        const bMonth = b.nascimento!.mes;
        const aDay = a.nascimento!.dia;
        const bDay = b.nascimento!.dia;
        
        if (aMonth !== bMonth) {
          return aMonth - bMonth;
        }
        return aDay - bDay;
      });

    const birthdaysByMonth = meses.map((mes, index) => {
      const monthNumber = index + 1;
      const monthBirthdays = contactsWithBirthday
        .filter(contact => contact.nascimento!.mes === monthNumber)
        .sort((a, b) => a.nascimento!.dia - b.nascimento!.dia);
      
      return {
        mes,
        monthNumber,
        birthdays: monthBirthdays
      };
    }).filter(month => month.birthdays.length > 0);

    return { todayBirthdays, upcomingBirthdays, birthdaysByMonth };
  }, [contacts]);

  const handleWhatsApp = (telefone: string, nome: string, isToday: boolean = false) => {
    const cleanPhone = telefone.replace(/\D/g, '');
    const message = isToday 
      ? `🎉 Feliz aniversário, ${nome}! Desejamos um dia repleto de alegrias! 🎂`
      : `Olá ${nome}! Mensagem do Gabinete do Deputado Federal.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const calculateAge = (nascimento: { dia: number; mes: number; ano?: number }) => {
    if (!nascimento.ano) return null;
    
    const today = new Date();
    const birthDate = new Date(nascimento.ano, nascimento.mes - 1, nascimento.dia);
    let age = today.getFullYear() - birthDate.getFullYear();
    
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Aniversariantes de Hoje */}
      {todayBirthdays.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Cake className="w-5 h-5" />
              Aniversariantes de Hoje ({todayBirthdays.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {todayBirthdays.map((contact) => {
                const age = calculateAge(contact.nascimento!);
                return (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Gift className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{contact.nome} {contact.sobrenome}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={tipoColors[contact.tipo]}>
                            {tipoLabels[contact.tipo]}
                          </Badge>
                          {age && <span className="text-sm text-muted-foreground">{age} anos</span>}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleWhatsApp(contact.telefone, contact.nome, true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Parabenizar
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Próximos Aniversários */}
      {upcomingBirthdays.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximos Aniversários ({upcomingBirthdays.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {upcomingBirthdays.map((contact) => {
                const age = calculateAge(contact.nascimento!);
                return (
                  <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {contact.nascimento!.dia}/{contact.nascimento!.mes}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{contact.nome} {contact.sobrenome}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={tipoColors[contact.tipo]}>
                            {tipoLabels[contact.tipo]}
                          </Badge>
                          {age && <span className="text-sm text-muted-foreground">{age + 1} anos</span>}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWhatsApp(contact.telefone, contact.nome)}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aniversários por Mês */}
      <div className="grid gap-4">
        <h2 className="text-lg font-semibold">Aniversários por Mês</h2>
        {birthdaysByMonth.map(({ mes, birthdays }) => (
          <Card key={mes}>
            <CardHeader>
              <CardTitle className="text-base">{mes} ({birthdays.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {birthdays.map((contact) => {
                  const age = calculateAge(contact.nascimento!);
                  return (
                    <div key={contact.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium w-8">
                          {contact.nascimento!.dia}
                        </span>
                        <div>
                          <span className="font-medium">{contact.nome} {contact.sobrenome}</span>
                          <div className="flex items-center gap-2">
                            <Badge className={tipoColors[contact.tipo]} variant="outline">
                              {tipoLabels[contact.tipo]}
                            </Badge>
                            {age && <span className="text-sm text-muted-foreground">{age} anos</span>}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleWhatsApp(contact.telefone, contact.nome)}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {todayBirthdays.length === 0 && upcomingBirthdays.length === 0 && birthdaysByMonth.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum aniversário cadastrado</h3>
            <p className="text-muted-foreground">
              Adicione datas de nascimento aos contatos para ver os aniversários aqui.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
