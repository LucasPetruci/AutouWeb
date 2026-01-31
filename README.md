# Email Classifier

Aplicação web para classificação inteligente de emails usando IA. Classifica emails como **Produtivos** ou **Improdutivos** e fornece análises contextuais com sugestões de resposta.

**🔗 Teste a aplicação:** [https://autou-web-d7e6.vercel.app/](https://autou-web-d7e6.vercel.app/) <br>
**Video no Youtube:** [https://www.youtube.com/watch?v=QvN-87UT67U)](https://www.youtube.com/watch?v=QvN-87UT67U)

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Ant Design 6
- Tailwind CSS

## Instalação

### Backend (API)

Acesse o repositório da API e siga o passo a passo de instalação:

- [Repositório da API](https://github.com/LucasPetruci/AutouApi)

### Frontend

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

## Estrutura

```text
src/
├── components/     # Componentes React
├── services/       # Serviços de API
├── types/          # Tipos TypeScript
└── i18n/           # Traduções (pt, en, es)
```

## Autor

### Lucas Petruci

- [LinkedIn](https://www.linkedin.com/in/lucaspetruci/)
- [GitHub](https://github.com/LucasPetruci)
