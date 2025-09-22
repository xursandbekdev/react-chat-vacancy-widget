react-chat-vacancy-widget

A customizable React widget for chat and vacancy management with token-based authentication and plain CSS styling. This widget allows users to interact with a chat interface, view job vacancies, upload resumes, and download generated files.

O‘zbekcha: Ushbu loyiha token asosidagi autentifikatsiya bilan chat va vakansiya boshqaruvi uchun moslashtiriladigan React vidjetini taqdim etadi. Tailwind CSS o‘rniga oddiy CSS ishlatilgan.

Features





Chat Interface: Send and receive messages with a typing animation and system messages.



Vacancy Management: Display job vacancies with expandable details and apply options.



File Upload: Upload PDF resumes for job applications.



File Download: Download generated files from the server.



Customizable Styling: Uses plain CSS for styling, fully customizable via props.



Positioning: Configurable widget position (e.g., bottom-right, top-left).



TypeScript Support: Fully typed with TypeScript for better developer experience.



Responsive Design: Adapts to different screen sizes with customizable width and height.

O‘zbekcha: Chat interfeysi, vakansiya ko‘rsatish, PDF rezume yuklash, fayl yuklab olish, moslashtiriladigan CSS va TypeScript qo‘llab-quvvatlash kabi xususiyatlar mavjud.

Installation

To use the widget in your React project, install it via npm:

npm install react-chat-vacancy-widget

O‘zbekcha: Vidjetni React loyihangizda ishlatish uchun npm orqali o‘rnating.

Usage

Import the WidgetComponent and the associated CSS file into your React application. Below is an example of how to integrate the widget:

import React from 'react';
import { WidgetComponent } from 'react-chat-vacancy-widget';
import 'react-chat-vacancy-widget/dist/styles.css';

const App: React.FC = () => {
  const handleWidgetReady = () => {
    console.log('Widget loaded!');
  };

  return (
    <div>
      <h1>My Application</h1>
      <WidgetComponent
        token="your-token-123"
        theme="#2563eb"
        siteName="My Company"
        enableLogging={true}
        position="bottom-right"
        width="400px"
        height="600px"
        onReady={handleWidgetReady}
      />
    </div>
  );
};

export default App;

Props:





token (string, required): Authentication token for API requests.



theme (string, optional): Primary color for the widget (hex code, default: #2563eb).



siteName (string, optional): Company name displayed in the widget header (default: "Kompaniya").



enableLogging (boolean, optional): Enable console logging for debugging (default: false).



position (string, optional): Widget position on the screen ("bottom-right", "bottom-left", "top-right", "top-left", default: "bottom-right").



width (string, optional): Widget width (e.g., "400px", default: "370px").



height (string, optional): Widget height (e.g., "600px", default: "500px").



onReady (function, optional): Callback function triggered when the widget is fully loaded.

O‘zbekcha: Vidjetni ishlatish uchun WidgetComponent ni va CSS faylini import qiling. Yuqoridagi misolda token, theme, siteName va boshqa props’lar orqali sozlash ko‘rsatilgan.

Project Structure

react-chat-vacancy-widget/
├── src/
│   ├── index.tsx              # Entry point for exports
│   ├── WidgetComponent.tsx    # Main widget component
│   ├── LoadingSpinner.tsx     # Loading spinner component
│   ├── types.ts               # TypeScript type definitions
│   ├── styles.css             # Plain CSS styles
├── package.json               # Project metadata and dependencies
├── rollup.config.js           # Rollup configuration for bundling
├── tsconfig.json              # TypeScript configuration

Development Setup

To set up the project for development:





Clone the Repository (if applicable):

git clone <repository-url>
cd react-chat-vacancy-widget



Install Dependencies:

npm install



Build the Project:

npm run build

This generates the dist folder with CommonJS (dist/cjs/index.js), ES Module (dist/esm/index.js), CSS (dist/styles.css), and TypeScript declaration (dist/index.d.ts) files.



Publish to npm (if you’re the maintainer):

npm login
npm publish

Note: Ensure the name in package.json is unique (e.g., @xursandbekdev/react-chat-vacancy-widget).

O‘zbekcha: Loyihani ishlab chiqish uchun yuqoridagi qadamlar orqali loyihani sozlang, build qiling va npm’ga nashr qiling.

Dependencies





Production:





lucide-react: For icons used in the widget.



react and react-dom (peer dependencies): Required in the consuming project.



Development:





@rollup/plugin-commonjs



@rollup/plugin-node-resolve



@rollup/plugin-typescript



rollup



rollup-plugin-dts



rollup-plugin-peer-deps-external



rollup-plugin-postcss



typescript



@types/react



@types/react-dom

API Integration

The widget interacts with the following API endpoints:





Chat API: https://chatai.my-blog.uz/webhook/{token} (POST)



Upload API: ${VITE_API_URL}/upload/ (POST)



Vacancy API: ${VITE_API_URL}/vakansiya/ (GET)



Download API: ${VITE_API_URL}/download/{filename} (GET)

Ensure the token prop is valid for authentication with the chat API.

O‘zbekcha: Vidjet API’lar bilan ishlash uchun token to‘g‘ri bo‘lishi kerak. Yuqoridagi endpoint’lar chat, fayl yuklash, vakansiya olish va fayl yuklab olish uchun ishlatiladi.

Styling

The widget uses plain CSS (no Tailwind) defined in src/styles.css. The CSS is bundled into dist/styles.css and must be imported in the consuming application (see Usage section). Customize styles by modifying src/styles.css before building.

O‘zbekcha: Vidjet Tailwind’siz oddiy CSS’dan foydalanadi. Uslublarni src/styles.css faylida o‘zgartirish mumkin.

Troubleshooting





Build Errors: If you encounter build issues, ensure all dependencies are installed and src/styles.css has no syntax errors. Run npm install and check rollup.config.js.



CSS Not Applied: Ensure import 'react-chat-vacancy-widget/dist/styles.css'; is included in your application.



API Errors: Verify the token prop and API endpoint availability. Enable enableLogging={true} to debug API issues in the console.



Windows Terminal: Use cls instead of clear to clear the Command Prompt.

O‘zbekcha: Muammolar bo‘lsa, bog‘liqliklarni tekshiring, CSS faylida xatolik yo‘qligiga ishonch hosil qiling va enableLogging ni yoqing.

Contributing

Contributions are welcome! Please submit a pull request or open an issue on the repository for bug reports or feature requests.
License
MIT License

O‘zbekcha: Loyiha MIT litsenziyasi ostida tarqatiladi.