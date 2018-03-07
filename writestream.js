const fs = require('fs');
const file = fs.createWriteStream('test.log');

for(let i=0; i<= 1e6; i++) {
  file.write('Lorem ipsum dolor sit amet.\nconsectetur adipisicing elit.\nsed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis nostrud exercitation.\nullamco laboris nisi ut aliquip ex ea commodo consequat.\nDuis aute irure dolor in reprehenderit in.\nvoluptate velit esse cillum dolore eu fugiat nulla pariatur.\nExcepteur sint occaecat cupidatat non proident.\nsunt in culpa qui officia deserunt mollit anim id est laborum.\n');
}

file.end();