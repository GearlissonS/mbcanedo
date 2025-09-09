import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { useSettings } from "@/context/SettingsContext";
import { Building2, BarChart3, Trophy, TrendingUp, Users, Target, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const statsData = [
  { value: "248", label: "Vendas Ativas" },
  { value: "12", label: "Corretores" },
  { value: "R$ 2.4M", label: "VGV Total" },
  { value: "18.5%", label: "Taxa Conversão" },
];

const features = [
  {
    icon: BarChart3,
    title: "Dashboard Inteligente",
    description: "Visualize seus KPIs e métricas em tempo real com gráficos interativos"
  },
  {
    icon: Trophy,
    title: "Ranking Gamificado",
    description: "Sistema de ranking que motiva sua equipe de vendas com competição saudável"
  },
  {
    icon: Building2,
    title: "Gestão de Vendas",
    description: "Controle completo de todas as vendas com filtros avançados e relatórios"
  },
  {
    icon: Users,
    title: "Equipe Conectada",
    description: "Gerencie corretores, metas e performance de forma centralizada"
  }
];

const Index = () => {
  const { settings } = useSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "My Broker — Gestão de Vendas Imobiliárias",
    url: typeof window !== "undefined" ? window.location.origin : "/",
  } as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Helmet>
        <title>My Broker — Gestão de Vendas Imobiliárias</title>
        <meta name="description" content="My Broker: sistema moderno para gestão de vendas imobiliárias com gamificação e dashboard." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-6xl py-24 sm:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <Building2 className="mx-auto h-16 w-16 text-blue-600 mb-4" />
            </motion.div>
            
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Transforme Suas
              <span className="block text-blue-600">Vendas Imobiliárias</span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Plataforma completa para gestão de vendas, ranking de corretores e análise de performance em tempo real
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/dashboard">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/ranking">Ver Ranking</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-blue-600 sm:text-4xl">{stat.value}</div>
                <div className="mt-2 text-sm font-medium text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Recursos Poderosos
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tudo que você precisa para gerenciar e potencializar suas vendas imobiliárias
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto para Começar?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Transforme sua gestão de vendas hoje mesmo com nossa plataforma completa
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" variant="secondary">
                <Link to="/dashboard">
                  Acessar Dashboard
                  <Target className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/sales">Ver Vendas</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
