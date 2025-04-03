
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Check, Clock, MapPin, TrendingUp, Truck, Users } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    if (email) {
      toast({
        title: "Inscrição realizada!",
        description: "Agradecemos por se inscrever em nossa newsletter.",
      });
      e.currentTarget.reset();
    }
  };
  
  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve.",
    });
    e.currentTarget.reset();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-50 to-white py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-12 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Feed the Future <span className="text-green-600">BR</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Conectando estabelecimentos comerciais a ONGs para reduzir o desperdício de alimentos
                e ajudar comunidades vulneráveis.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700" size="lg">
                    Cadastre-se
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastre-se</DialogTitle>
                    <DialogDescription>
                      Escolha o tipo de perfil para começar.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <Card className="cursor-pointer hover:border-green-500 transition-colors">
                      <CardHeader>
                        <CardTitle>Estabelecimento</CardTitle>
                        <CardDescription>Para empresas que desejam doar alimentos</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>Cadastro de alimentos para doação</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>Relatórios de impacto ambiental</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:border-green-500 transition-colors">
                      <CardHeader>
                        <CardTitle>ONG</CardTitle>
                        <CardDescription>Para instituições que recebem doações</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>Busca de doações próximas</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>Agendamento de coletas</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg">
                Saiba mais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" id="features">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Como funciona
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Nossa plataforma facilita todo o processo de doação de alimentos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 mb-4 text-green-600" />
                <CardTitle>Cadastro</CardTitle>
                <CardDescription>
                  Estabelecimentos cadastram alimentos disponíveis para doação.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <MapPin className="h-10 w-10 mb-4 text-green-600" />
                <CardTitle>Localização</CardTitle>
                <CardDescription>
                  ONGs encontram doações próximas utilizando geolocalização.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Truck className="h-10 w-10 mb-4 text-green-600" />
                <CardTitle>Logística</CardTitle>
                <CardDescription>
                  Agendamento de coletas e rotas para voluntários.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 mb-4 text-green-600" />
                <CardTitle>Acompanhamento</CardTitle>
                <CardDescription>
                  Status em tempo real das entregas e coletas.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 mb-4 text-green-600" />
                <CardTitle>Impacto</CardTitle>
                <CardDescription>
                  Relatórios sobre alimentos doados e impacto ambiental.
                </CardDescription>
              </CardHeader>
            </Card>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Card className="cursor-help">
                  <CardHeader>
                    <CardTitle>Descubra mais</CardTitle>
                    <CardDescription>
                      Passe o mouse para ver funcionalidades adicionais.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Funcionalidades adicionais</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Notificações sobre doações disponíveis</li>
                    <li>• Histórico de doações realizadas</li>
                    <li>• Certificados de participação</li>
                    <li>• Integração com sistemas fiscais</li>
                  </ul>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-green-50">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-green-600">+1.500</h3>
              <p className="text-gray-500">Estabelecimentos cadastrados</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-green-600">+5 tons</h3>
              <p className="text-gray-500">Alimentos doados por mês</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-green-600">+300</h3>
              <p className="text-gray-500">ONGs beneficiadas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white" id="contato">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter">Entre em contato</h2>
              <p className="text-gray-500">
                Tem alguma dúvida ou sugestão? Entre em contato conosco!
              </p>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Nome</label>
                  <Input id="name" name="name" placeholder="Seu nome" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" name="email" type="email" placeholder="seu.email@exemplo.com" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Mensagem</label>
                  <Textarea id="message" name="message" placeholder="Digite sua mensagem" required />
                </div>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full">Enviar mensagem</Button>
              </form>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter">Newsletter</h2>
              <p className="text-gray-500">
                Assine nossa newsletter para receber novidades e atualizações.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="newsletter-email" className="text-sm font-medium">Email</label>
                  <div className="flex space-x-2">
                    <Input id="newsletter-email" name="email" type="email" placeholder="seu.email@exemplo.com" required />
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">Assinar</Button>
                  </div>
                </div>
              </form>
              <div className="pt-8">
                <h3 className="text-xl font-bold mb-4">Endereço</h3>
                <p className="text-gray-500">
                  Av. Paulista, 1000<br />
                  São Paulo - SP<br />
                  Brasil<br />
                  <br />
                  contato@feedthefuturebr.com.br<br />
                  +55 11 9999-9999
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-2xl">Feed the Future BR</h3>
              <p className="text-green-100 max-w-xs">
                Conectando estabelecimentos comerciais a ONGs para reduzir o desperdício de alimentos.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="font-bold">Plataforma</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-green-100 hover:text-white">Início</a></li>
                  <li><a href="#features" className="text-green-100 hover:text-white">Como funciona</a></li>
                  <li><a href="#contato" className="text-green-100 hover:text-white">Contato</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-green-100 hover:text-white">Termos de Uso</a></li>
                  <li><a href="#" className="text-green-100 hover:text-white">Política de Privacidade</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold">Social</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-green-100 hover:text-white">Instagram</a></li>
                  <li><a href="#" className="text-green-100 hover:text-white">Twitter</a></li>
                  <li><a href="#" className="text-green-100 hover:text-white">LinkedIn</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-green-800 text-center text-green-100">
            <p>&copy; {new Date().getFullYear()} Feed the Future BR. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index;
