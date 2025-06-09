import "./App.css";

function App() {
  return (
    <div className="download-container">
      <h1>System Installer</h1>
      <p className="subtitle">
        Download the installer for your platform below.
        <br />
        Quick setup for server and mobile app.
      </p>
      <div className="button-group">
        <a
          href="/installer/main_installer.exe"
          download
          className="download-link"
        >
          <button className="download-btn">
            Download Windows Installer (.exe)
          </button>
        </a>
        <a href="/installer/app-debug.apk" download className="download-link">
          <button className="download-btn">Download Android App (.apk)</button>
        </a>
      </div>
    </div>
  );
}

export default App;
