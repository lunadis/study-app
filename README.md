# FlashStudy - Aplicativo de Flashcards PWA

## 📚 Sobre o Projeto

FlashStudy é um aplicativo web progressivo (PWA) completo para gerenciamento e estudo de flashcards. Desenvolvido com tecnologias web modernas, oferece uma experiência rica tanto online quanto offline.

### ✨ Principais Características

- **Progressive Web App (PWA)**: Instalável em qualquer dispositivo
- **Funcionamento Offline**: Estude mesmo sem conexão à internet
- **Design Responsivo**: Interface otimizada para mobile, tablet e desktop
- **Importação CSV**: Adicione flashcards em massa via arquivo CSV
- **Estatísticas de Estudo**: Acompanhe seu progresso de aprendizado
- **Interface Intuitiva**: Design moderno seguindo princípios de Material Design

## 🚀 Funcionalidades

### Gerenciamento de Decks
- ✅ Criar novos decks com validação de nome único
- ✅ Listar todos os decks com contador de flashcards
- ✅ Editar nomes e descrições dos decks
- ✅ Excluir decks com confirmação de segurança

### Criação de Flashcards
- ✅ **Criação Manual**: Interface intuitiva com preview em tempo real
- ✅ **Importação CSV**: Upload de arquivo ou texto no formato específico
- ✅ **Validação**: Verificação rigorosa de dados e formato
- ✅ **Edição**: Modificação e exclusão de cards existentes

### Sistema de Estudo
- ✅ Apresentação aleatória sem repetição
- ✅ Interface flip-card com animações suaves
- ✅ Navegação fluida (anterior/próximo/embaralhar)
- ✅ Contador de progresso visual
- ✅ Controles por teclado (espaço para virar, setas para navegar)

### Progressive Web App
- ✅ Service Worker para cache inteligente
- ✅ Manifest para instalação no dispositivo
- ✅ Ícones em múltiplas resoluções
- ✅ Funcionamento offline completo

## 📋 Formato CSV

Para importar flashcards em massa, use o formato:

```csv
pergunta1,resposta1
pergunta2,resposta2
pergunta3,resposta3
```

### Exemplo Prático:
```csv
O que é JavaScript?,Uma linguagem de programação
Capital do Brasil?,Brasília
2 + 2 = ?,4
Qual é a fórmula da água?,H2O
Quem escreveu Dom Casmurro?,Machado de Assis
```

### Regras Importantes:
- Uma linha por flashcard
- Use vírgula para separar pergunta e resposta
- Máximo 500 caracteres por pergunta/resposta
- Aspas são opcionais mas recomendadas para textos com vírgulas
- Perguntas duplicadas são automaticamente ignoradas

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com Grid/Flexbox
- **JavaScript ES6+**: Lógica da aplicação
- **Service Worker**: Funcionalidade offline
- **Web App Manifest**: Instalação PWA
- **LocalStorage**: Armazenamento local de dados

## 💻 Instalação e Uso

### Instalação no Dispositivo

1. **No Navegador**:
   - Abra o FlashStudy no seu navegador
   - Procure pelo ícone de instalação na barra de endereços
   - Clique em "Instalar" quando o banner aparecer

2. **No Mobile**:
   - Abra no Chrome/Safari
   - Toque no menu do navegador
   - Selecione "Adicionar à tela inicial"

### Primeiros Passos

1. **Criar Primeiro Deck**:
   ```
   1. Clique em "Novo Deck"
   2. Digite um nome único
   3. Adicione uma descrição (opcional)
   4. Clique em "Salvar"
   ```

2. **Adicionar Flashcards**:
   ```
   Manual:
   1. Clique em "Gerenciar Cards" no deck
   2. Digite pergunta e resposta
   3. Use o preview para verificar
   4. Clique em "Adicionar Flashcard"
   
   Via CSV:
   1. Va para a aba "Importar CSV"
   2. Cole o texto ou selecione arquivo
   3. Clique em "Validar"
   4. Revise o preview e clique em "Importar"
   ```

3. **Estudar**:
   ```
   1. Vá para a aba "Estudar"
   2. Selecione um deck
   3. Use espaço para virar cards
   4. Use setas para navegar
   5. Clique em "Finalizar" ao terminar
   ```

## 🎯 Navegação e Controles

### Controles por Teclado (durante estudo)
- **Espaço/Enter**: Virar card
- **Seta Esquerda**: Card anterior
- **Seta Direita**: Próximo card
- **Ctrl+R**: Embaralhar cards

### Controles Touch/Mouse
- **Toque no Card**: Virar card
- **Botões de Navegação**: Navegar entre cards
- **Menu do Deck**: Acesso rápido às opções

## 📊 Estatísticas

O aplicativo rastreia automaticamente:
- 📚 Total de decks criados
- 📄 Número total de flashcards
- 🎯 Sessões de estudo realizadas
- 🏆 Cards estudados
- ⏱️ Tempo total de estudo
- 🔥 Sequência de estudos

## 🔧 Troubleshooting

### Problemas Comuns

**1. Cards não aparecem no estudo**
```
Solução: Verifique se o deck possui flashcards adicionados
```

**2. Erro na importação CSV**
```
Possíveis causas:
- Formato incorreto (use vírgula como separador)
- Arquivo muito grande (limite: 1MB)
- Caracteres especiais mal formatados

Solução: Valide o CSV antes de importar
```

**3. Aplicativo não funciona offline**
```
Solução: 
1. Visite o app online pelo menos uma vez
2. Aguarde o cache ser criado
3. Teste o funcionamento offline
```

**4. Não consigo instalar como PWA**
```
Soluções:
- Use Chrome/Edge/Safari atualizado
- Acesse via HTTPS
- Aguarde o banner de instalação aparecer
- Use o menu "Adicionar à tela inicial"
```

**5. Dados perdidos**
```
Prevenção:
- Não limpe dados do navegador
- Faça backup exportando CSVs
- Use o mesmo navegador/dispositivo
```

### Limpeza de Dados

Para resetar completamente:
```javascript
// No console do navegador
localStorage.clear();
caches.keys().then(names => names.forEach(name => caches.delete(name)));
location.reload();
```

## 🔒 Privacidade e Segurança

- **Dados Locais**: Todos os dados ficam no seu dispositivo
- **Sem Servidor**: Não enviamos informações para servidores externos
- **Offline**: Funciona completamente sem internet
- **Seguro**: Não coleta dados pessoais

## 🌐 Compatibilidade

### Navegadores Suportados
- ✅ Chrome 80+
- ✅ Safari 13+
- ✅ Firefox 75+
- ✅ Edge 80+

### Dispositivos Testados
- ✅ Android 7+
- ✅ iOS 13+
- ✅ Windows 10+
- ✅ macOS 10.15+
- ✅ Linux (distribuições modernas)

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

Cada breakpoint tem layouts otimizados para melhor experiência do usuário.

## 🎨 Personalização

### Temas Disponíveis
- 🌞 **Modo Claro**: Design clean com cores claras
- 🌙 **Modo Escuro**: Interface escura para estudo noturno

### Alternar Tema
Use o botão 🌙/☀️ no canto superior direito ou as configurações do sistema operacional serão respeitadas automaticamente.

## 🏆 Dicas de Uso

### Para Melhor Aprendizado
1. **Estude Regularmente**: Sessões curtas e frequentes são mais eficazes
2. **Use Descrições**: Adicione contexto aos seus decks
3. **Embaralhe Cards**: Evite decorar a ordem
4. **Revise Estatísticas**: Acompanhe seu progresso

### Para Melhor Organização
1. **Nomes Únicos**: Use nomes descritivos para decks
2. **Categorize**: Crie decks por assunto/matéria
3. **Limite de Cards**: Decks menores são mais gerenciáveis
4. **Backup Regular**: Exporte CSVs importantes

## 📞 Suporte

Em caso de problemas:
1. Consulte a seção Troubleshooting
2. Verifique a compatibilidade do seu navegador
3. Teste em modo privado/anônimo
4. Reinicie o navegador

## 🔄 Atualizações

O FlashStudy se atualiza automaticamente quando:
- Uma nova versão está disponível
- Você visita o app online
- O cache é renovado pelo Service Worker

## 📊 Performance

### Métricas Alvo
- ⚡ Carregamento inicial: < 3 segundos
- 🔄 Transições: < 250ms
- 💾 Uso de memória: Otimizado
- 📶 Funcionamento offline: 100%

### Otimizações Implementadas
- Cache inteligente com Service Worker
- Carregamento progressivo de recursos
- Compressão de dados
- Imagens otimizadas (SVG)

---

**FlashStudy** - Sua ferramenta completa para estudos com flashcards! 📚✨