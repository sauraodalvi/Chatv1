# Velora

Your portal to living conversations, fantasy characters, and untamed group chats.

## About Velora

Velora is a completely autonomous, login-free, character-driven chat world where users can:

- Instantly select characters and start talking
- Create custom fantasy, deep talk, or random chat scenarios
- Talk in many-to-many group chats (not boring 1-1)
- Save chats locally (as JSON) and upload them later to resume conversations
- Paste a video link to theme their chat room based on the video's vibe

## Features

- **No Login/Signup**: Anyone can start chatting instantly
- **Character Selection**: Select from a pre-built library of characters
- **Custom Character Creation**: Edit mode to create your own chat characters
- **Many-to-Many Group Chat**: Multiple characters talk like a real conversation
- **Local Save & Resume**: Download chat session (JSON) and upload it later to continue
- **Video Link Scenario Creation**: Paste a video link → Velora suggests a chat theme based on it
- **Random Surprise Mode**: Auto-pick characters and vibe for quick fun
- **Light & Dark Mode**: Option for different UI themes

## Tech Stack

- **Frontend**: React with Vite
- **UI Library**: Tailark CSS (https://tailark.com/)
- **Data**: Static JSON for characters
- **Local Save/Load**: Browser download/upload (JSON file)
- **Hosting**: Can be deployed on Vercel, Netlify, or GitHub Pages

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

```
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to your hosting provider of choice.

## Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions. When you push to the `main` branch, the site will automatically be built and deployed to GitHub Pages.

The live site is available at: https://sauraodalvi.github.io/Chatv1/

To manually deploy to GitHub Pages:

1. Push your changes to the `main` branch
2. GitHub Actions will automatically build and deploy the site
3. Check the Actions tab in the GitHub repository to monitor the deployment progress

### Manual Deployment

You can also manually deploy the site using the provided script:

```
bash deploy-to-github.sh
```

This script will build the project and push it to the `gh-pages` branch.

## Project Structure

- `src/components/` - React components for the UI
- `src/data/` - Character data and other static information
- `src/utils/` - Utility functions for chat and video processing
- `src/styles/` - CSS styles including Tailark CSS
- `src/App.jsx` - Main application component
- `src/main.jsx` - Entry point for the application

## CSS Configuration

This project uses Tailark CSS for styling. The CSS is imported in `src/styles/tailark.css` and included in the main entry point `src/main.jsx`.

To ensure consistent styling across all deployments:

1. Make sure `src/styles/tailark.css` imports the Tailark CSS:
   ```css
   /* Import Tailark CSS */
   @import url('https://tailark.com/styles.css');
   ```

2. Make sure `src/main.jsx` imports the Tailark CSS:
   ```jsx
   import './styles/tailark.css'
   ```

3. Do not add any other CSS frameworks or libraries that might conflict with Tailark CSS.

## License

MIT

---

"Instant Connection, Infinite Worlds."
