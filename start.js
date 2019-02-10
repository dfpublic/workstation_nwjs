const { exec } = require('child_process');
const config = process.argv[2];
const config_name = config ? config : 'user_default';
console.log(`Starting workstation with ${config_name} configuration.`);
exec(`CONFIG="${config_name}" npx nw . --user-data-dir="user_data/${config_name}"`);