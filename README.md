# Volty <img src="https://i.imgur.com/BsSEgd9.png" width="30" height="30" align="center" alt="Volty Logo">

An experimental project aiming to build a neural interface for AI interaction.  

Currently it features a web based AI integration with plans to evolve into a hardware based neural interface system  

> Note: The current version focuses on software only features as I continue learning about the hardware side of neural interfaces. Future updates will introduce hardware components for enhanced neural interface capabilities.

## Tech Stack

- Svelte 5, SvelteKit 2.0, TailwindCSS 4.0
- AI SDK (@ai-sdk/google, @ai-sdk/svelte) 
- SvelteKit endpoints for AI integration and IP detection

## Project Structure

```
src/
├── routes/
│   ├── api/
│   │   ├── chat/    # ai integration
│   │   └── ip/      # ip detection endpoint
│   ├── +page.svelte # main interface
│   └── +layout.svelte
├── app.css          # global styles
└── app.html         # html template
```

## Setup

- Clone the repo:
    ```bash
    git clone https://github.com/HeySkidee/volty.git
    cd volty
    ```
- Run `npm instal` followed by `npm run dev`.
- Create a `.env` file in the project folder and add environment variables from `.env.example`.
- Open http://localhost:5173

## Status: 
- Software: Web prototype 
- Hardware: Planning phase