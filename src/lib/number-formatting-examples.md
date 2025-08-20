# Exemplos de Formatação de Números no Padrão Brasileiro

Este arquivo demonstra como usar as funções utilitárias para formatação de números no padrão brasileiro.

## Funções Disponíveis

### 1. `formatNumberBR(value, options?)`
Formata um número para o padrão brasileiro (vírgula como decimal, ponto para milhares).

```typescript
import { formatNumberBR } from "@/lib/utils";

// Exemplos:
formatNumberBR(1234.56)        // "1.234,56"
formatNumberBR(1234.56, { minimumFractionDigits: 2 })  // "1.234,56"
formatNumberBR(1234, { minimumFractionDigits: 0 })     // "1.234"
```

### 2. `formatCurrencyBR(value, options?)`
Formata um número de moeda para o padrão brasileiro (R$).

```typescript
import { formatCurrencyBR } from "@/lib/utils";

// Exemplos:
formatCurrencyBR(1234.56)      // "R$ 1.234,56"
formatCurrencyBR(1234.56, { minimumFractionDigits: 0 })  // "R$ 1.234"
formatCurrencyBR(1234.56, { minimumFractionDigits: 2, maximumFractionDigits: 2 })  // "R$ 1.234,56"
```

### 3. `formatThousandsBR(value)`
Formata um número para exibição com separadores de milhares no padrão brasileiro.

```typescript
import { formatThousandsBR } from "@/lib/utils";

// Exemplos:
formatThousandsBR(1234567)     // "1.234.567"
formatThousandsBR(1234.56)     // "1.235" (arredonda para inteiro)
```

## Padrão Brasileiro vs. Padrão Americano

| Padrão | Decimal | Milhares | Exemplo |
|--------|---------|----------|---------|
| Brasileiro | Vírgula (,) | Ponto (.) | 1.234,56 |
| Americano | Ponto (.) | Vírgula (,) | 1,234.56 |

## Uso nos Componentes

### KPICard
```typescript
<KPICard
  title="VGV Total"
  value={formatCurrencyBR(kpis.totalVgv, { minimumFractionDigits: 0 })}
  subtitle="Volume Geral de Vendas"
/>
```

### Tabelas
```typescript
<td className="text-right">
  {formatCurrencyBR(sale.vgv)}
</td>
```

### Gráficos
```typescript
const data = [
  { mes: "Jan", VGV: 150000, VGC: 7500 },
  { mes: "Fev", VGV: 200000, VGC: 10000 }
];
```

## Configuração do Intl.NumberFormat

As funções utilizam `Intl.NumberFormat` com as seguintes configurações padrão:

- **Locale**: `pt-BR` (Português do Brasil)
- **Moeda**: `BRL` (Real Brasileiro)
- **Separador decimal**: Vírgula (,)
- **Separador de milhares**: Ponto (.)

## Exemplos de Casos de Uso

### 1. Valores Monetários
```typescript
// Para exibição em cards e tabelas
const formattedValue = formatCurrencyBR(1234567.89);
// Resultado: "R$ 1.234.567,89"
```

### 2. Percentuais
```typescript
// Para taxas e percentuais
const formattedRate = formatNumberBR(12.5, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
// Resultado: "12,5"
```

### 3. Números Inteiros
```typescript
// Para contadores e quantidades
const formattedCount = formatThousandsBR(12345);
// Resultado: "12.345"
```

## Notas Importantes

1. **Performance**: As funções são otimizadas e reutilizam as configurações do `Intl.NumberFormat`
2. **Consistência**: Todas as funções seguem o mesmo padrão brasileiro
3. **Flexibilidade**: As opções permitem personalizar a formatação conforme necessário
4. **Internacionalização**: Fácil de adaptar para outros idiomas no futuro
