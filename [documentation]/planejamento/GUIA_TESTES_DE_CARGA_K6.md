# 🚀 Guia de Teste de Carga & Estresse de Natal (Grafana k6)
## Simulação de 500 a 5.000 Fiéis Simultâneos no Ecclesiam App

> **Documento Oficial de Infraestrutura & Engenharia de Confiabilidade (SRE)**  
> **Status:** Homologado e Testado com Grafana k6 v2.4.0  
> **Data:** 23 de Novembro de 2026  
> **Referência:** Alinhado com o benchmark oficial do Supabase ([supabase/benchmarks](https://github.com/supabase/benchmarks))

---

## 1. Visão Geral da Arquitetura de Testes

Para garantir que o portal da **Catedral do Sagrado Coração de Jesus** e suas **12 Comunidades Eclesiais de Base (CEBs)** suportem o pico de acessos simultâneos na Solenidade do Natal de 2026 (especialmente na **Missa da Vigília / Missa do Galo** do dia 24/12 e dia 25/12), foi implementada uma esteira de testes de carga baseada no **Grafana k6**.

### Pilares da Simulação:
1. **Navegação Pastoral (90% dos Fiéis):**
   * Acesso à Home (`/`): Leitura de avisos, missas de hoje, banner especial e coroa do advento.
   * Consulta à Agenda Litúrgica (`/agenda-liturgica`): Consulta de horários de missas e confissões.
   * Liturgia Diária Oficial (`/api/liturgia`): Consumo com cache resiliente.
2. **Submissão Concorrente (10% dos Fiéis):**
   * Envio de intenções de Santa Missa (`/api/secretaria/intentions`).
   * Inclusão da tag obrigatória `[CARGA-NATAL]` para isolamento total.
   * Simulação de IPs e telefones distintos para validar a proteção anti-abuso sem falsos positivos.

---

## 2. Comandos Disponíveis no `package.json`

| Comando | Descrição | Duração / Usuários Virtuais (VUs) |
| :--- | :--- | :---: |
| `npm run test:load:smoke` | **Teste de Fumaça (Rápido):** Valida a saúde dos endpoints e conectividade do banco com 10 VUs. | 20 segundos (10 VUs) |
| `npm run test:load:quick` | **Teste Intermediário:** Simula um domingo comum movimentado com 100 fiéis simultâneos. | 40 segundos (100 VUs) |
| `npm run test:load:full` | **Simulação Completa do Natal:** Rampa realista atingindo o pico de **5.000 fiéis simultâneos**. | ~7 minutos (até 5.000 VUs) |
| `npm run test:load:clean` | **Purga de Dados:** Executa o script Node.js para deletar todos os registros marcados com `[CARGA-NATAL]`. | Instantâneo (< 2s) |

---

## 3. Como Executar um Teste de Carga Passo a Passo

### Passo 1: Iniciar o Servidor em Modo Produção (Recomendado)
Para medir a velocidade real sem a sobrecarga do compilador de desenvolvimento do Next.js:
```bash
npm run build
npm start -- -p 3001
```

### Passo 2: Disparar o Teste com o k6
Em outro terminal:
```bash
npm run test:load:smoke
# ou para o teste completo de Natal:
npm run test:load:full
```

### Passo 3: Abrir o Relatório Visual HTML
Ao final do teste, abra no seu navegador o dashboard com gráficos de percentis e vazão:
👉 [`tests/load/load-test-report.html`](file:///c:/Users/Start/ecclesiam-app/tests/load/load-test-report.html)

### Passo 4: Limpar os Dados de Teste
Para expurgar as intenções de teste geradas:
```bash
npm run test:load:clean
```

---

## 4. Script SQL Manual de Limpeza

Caso prefira rodar diretamente no **Supabase SQL Editor**, utilize o script oficial [`tests/load/cleanup-test-data.sql`](file:///c:/Users/Start/ecclesiam-app/tests/load/cleanup-test-data.sql):

```sql
BEGIN;

-- 1. Remover nomes associados às intenções de teste de carga
DELETE FROM public.mass_intention_names
WHERE name LIKE '%[CARGA-NATAL]%'
   OR intention_id IN (
     SELECT id FROM public.mass_intentions 
     WHERE notes LIKE '%[CARGA-NATAL]%' 
        OR offered_by LIKE '%[CARGA-NATAL]%'
        OR intention_for LIKE '%[CARGA-NATAL]%'
   );

-- 2. Remover registros de intenções de Santa Missa de teste de carga
DELETE FROM public.mass_intentions
WHERE notes LIKE '%[CARGA-NATAL]%'
   OR offered_by LIKE '%[CARGA-NATAL]%'
   OR intention_for LIKE '%[CARGA-NATAL]%'
   OR protocol_code LIKE 'INT-CARGA-%';

-- 3. Remover agendamentos pastorais gerados durante o teste de estresse
DELETE FROM public.pastoral_appointments
WHERE notes LIKE '%[CARGA-NATAL]%'
   OR parishioner_name LIKE '%[CARGA-NATAL]%'
   OR notes LIKE '%Teste de Carga%';

COMMIT;
```
