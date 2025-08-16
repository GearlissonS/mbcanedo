# My Broker - Sistema de Gestão de Vendas Imobiliárias

Um sistema moderno e completo para gestão de vendas imobiliárias, com ranking gamificado, dashboard interativo e ferramentas de análise.

## ✨ Funcionalidades

### 📊 Dashboard
- **KPIs em tempo real**: VGV, VGC, número de vendas e taxa de conversão
- **Gráficos interativos**: VGV/VGC mensal, ranking de corretores, distribuição por tipo e origem
- **Comparação com períodos anteriores**: Análise de tendências e crescimento
- **Filtros por período**: Mensal, anual ou personalizado

### 🏆 Ranking Gamificado
- **Pódio visual**: Top 3 corretores com medalhas e avatares
- **Animações**: Efeitos visuais e sons para ultrapassagens
- **Períodos flexíveis**: Ranking mensal ou anual
- **Avatar personalizado**: Suporte a fotos dos corretores

### 💰 Gestão de Vendas
- **Cadastro completo**: Todos os dados da venda com validação
- **Filtros avançados**: Por vendedor, status, período
- **Exportação**: CSV, XLSX e PDF
- **Edição inline**: Modificar vendas diretamente na tabela

### ⚙️ Configurações
- **Personalização visual**: Cores, logo, título
- **Gestão de corretores**: Adicionar, editar e remover
- **Listas customizáveis**: Origens, estilos, produtos
- **Import/Export**: Backup e restauração de dados

## 🚀 Melhorias Implementadas

### ✅ Validação e UX
- **Validação robusta de formulários** com feedback visual
- **Mensagens de erro claras** e específicas
- **Estados de loading** com indicadores visuais
- **Confirmações** para ações destrutivas
- **Feedback toast** para todas as ações

### ✅ Performance
- **Memoização otimizada** com useCallback e useMemo
- **Remoção de dados fictícios** hardcoded
- **Lazy loading** de componentes pesados
- **Otimização de re-renders**

### ✅ Acessibilidade
- **Atributos ARIA** adequados
- **Navegação por teclado** melhorada
- **Foco visível** em todos os elementos interativos
- **Contraste de cores** otimizado
- **Screen reader friendly**

### ✅ Código e Arquitetura
- **Error boundaries** para tratamento de erros
- **Validação centralizada** no DataContext
- **Tipagem TypeScript** melhorada
- **Hooks customizados** otimizados
- **Utilitários de exportação** robustos

### ✅ UI/UX
- **Animações CSS** suaves e performáticas
- **Estados vazios** informativos
- **Indicadores visuais** de status
- **Responsividade** aprimorada
- **Scrollbar customizada**

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Shadcn/ui** para componentes
- **React Router** para navegação
- **Recharts** para gráficos
- **React Query** para cache
- **LocalStorage** para persistência

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🔧 Configuração

1. **Personalizar cores**: Vá em Configurações > Tema
2. **Adicionar corretores**: Configurações > Corretores
3. **Configurar listas**: Configurações > Listas
4. **Importar dados**: Configurações > Importar/Exportar

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Dispositivos móveis
- 💻 Tablets
- 🖥️ Desktops
- 🖥️ Telas grandes

## 🎨 Temas

- **Tema claro** por padrão
- **Tema escuro** automático
- **Cores customizáveis** via configurações
- **Logo personalizada** suportada

## 📊 Exportação

Suporte completo para exportação:
- **CSV**: Para análise em Excel
- **XLSX**: Formato nativo do Excel
- **PDF**: Relatórios profissionais

## 🔒 Dados

- **Armazenamento local** no navegador
- **Backup automático** via exportação
- **Importação segura** de dados
- **Validação completa** de entrada

## 🚀 Próximas Funcionalidades

- [ ] Sincronização em nuvem
- [ ] Relatórios avançados
- [ ] Notificações push
- [ ] API REST
- [ ] Multi-tenant
- [ ] Auditoria de mudanças

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ para facilitar a gestão de vendas imobiliárias**

## 🗄️ Configuração do Banco (Supabase)

Siga estes passos para o app funcionar 100% com dados online (GitHub Pages ou outro hosting):

1) Criar projeto no Supabase
- Crie um projeto em supabase.com e anote:
	- Project URL (Settings > API > Project URL)
	- anon public key (Settings > API > anon key)

2) Variáveis de ambiente
- Local (.env):
	- `VITE_SUPABASE_URL=...`
	- `VITE_SUPABASE_ANON_KEY=...`
- CI (GitHub > Settings > Secrets and variables > Actions):
	- `VITE_SUPABASE_URL`
	- `VITE_SUPABASE_ANON_KEY`

3) Rodar o schema no Supabase
- Abra SQL Editor e rode o arquivo em `supabase/migrations/20250815_full_schema.sql`.
- Isso cria as tabelas necessárias (equipes, agents) e opcionais (corretores, brokers, vendas) e habilita RLS permissivo (demo, sem login).
- Se você usa autenticação, troque as políticas por versões que exigem `auth.role() = 'authenticated'`.

4) Seeds (opcional)
Execute no SQL Editor:

```sql
insert into public.equipes (nome, meta_equipe) values ('Equipe A', 100000), ('Equipe B', 150000)
on conflict (nome) do nothing;

insert into public.agents (nome, meta, realizado, equipe) values
('Ana', 20000, 5000, 'Equipe A'),
('Bruno', 30000, 15000, 'Equipe A');
```

5) Verificação rápida
- Configurações > Equipes: criar/listar/editar/excluir deve funcionar (tabela `public.equipes`).
- Metas (/cadastro-metas): atualizar metas de equipe e individuais (tabela `public.agents`).

Observações
- O client Supabase já está configurado em `src/context/supabaseClient.ts` e usa `VITE_SUPABASE_KEY` ou `VITE_SUPABASE_ANON_KEY`.
- Há migrações complementares em `supabase/migrations` (como criação inicial de `equipes`).
- Se quiser persistir corretores e vendas, habilite as tabelas `brokers` e `vendas` (já no schema) e ajuste a UI conforme necessidade.
