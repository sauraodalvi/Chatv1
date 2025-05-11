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

### Vercel (Recommended)

This project is configured for deployment on Vercel, which provides the best experience for React applications.

To deploy to Vercel:

1. Push your changes to GitHub:
   ```
   powershell -ExecutionPolicy Bypass -File setup-github.ps1
   ```

2. Deploy to Vercel:
   ```
   powershell -ExecutionPolicy Bypass -File deploy-to-vercel.ps1
   ```

Alternatively, you can deploy directly from the Vercel dashboard:

1. Go to [Vercel](https://vercel.com/) and sign up/login with your GitHub account
2. Click "Add New..." > "Project"
3. Select your "Chatv1" repository
4. Vercel will automatically detect it's a React/Vite project
5. Click "Deploy"

The live site will be available at a URL like: https://chatv1.vercel.app/

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
