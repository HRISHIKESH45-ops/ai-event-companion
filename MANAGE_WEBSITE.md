# 🚀 How to Manage Your AI Event Companion

Follow these instructions to start, stop, or reset your website development server.

## 🟢 How to Turn ON the Website
To start the website so you can access it in your browser:

1.  Open your **Terminal** or **PowerShell**.
2.  Navigate to the project folder:
    `cd ai-event-companion`
3.  Run the development command:
    ```bash
    npm run dev
    ```
4.  Once you see `✓ Ready`, open your browser and go to:
    **http://localhost:3000**

---

## 🔴 How to Turn OFF the Website
To completely stop the server and free up your computer's memory:

1.  **The Quick Way:** Go to the Terminal where the website is running and press:
    `Ctrl + C`
2.  **The "Force Stop" Way (Windows):** If the website is stuck or you can't find the terminal, run this command in any PowerShell window:
    ```powershell
    taskkill /F /IM node.exe
    ```
    *(Warning: This will stop ALL running Node.js projects on your machine.)*

---

## 🔄 How to Restart / Fix Errors
If the website feels slow or you keep seeing "Failed to generate":

1.  Stop the website (see "Turn OFF" above).
2.  Run the turn-on command again:
    ```bash
    npm run dev
    ```

---

## 🛠️ Performance Tips
- **Port Conflicts:** If you see an error about "Port 3000 is in use", the website is already running in another window. Stop it first or try `http://localhost:3001`.
- **API Limits:** If the schedule stops generating after many tests, you may have hit the daily free limit for the Gemini API. Wait 24 hours or try switching models in `route.ts`.
