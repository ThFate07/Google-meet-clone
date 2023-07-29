const { exec } = require('child_process');
const path = require('path');

// Define the paths to your frontend, backend, and websocket server files.
const frontendPath = path.join(__dirname, '/Frontend');
const backendPath = path.join(__dirname, '/Backend');
const websocketPath = path.join(__dirname, '/websocket server');

// Function to start a service using a command.
function startService(command, workingDir) {
  exec(command, { cwd: workingDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting service: ${error.message}`);
    }
    console.log(stdout);
    console.error(stderr);
  });
}

// Start each service.
startService('npm run dev', frontendPath); // Replace 'npm run start' with your frontend start command.
startService('node index.js', backendPath); // Replace 'node server.js' with your backend start command.
startService('node server.js', websocketPath); // Replace 'node websocket-server.js' with your websocket server start command.
