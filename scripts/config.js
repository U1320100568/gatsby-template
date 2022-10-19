const fs = require('fs');

function config() {
  const data = {
    
  };

  if (process.env.ENV === 'stg') {
    data.stage = 'stg';
    data.apiHost = '';
  } else {
    data.stage = 'prod';
    data.apiHost = '';
  }

  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2), 'utf8');
  console.log('done');
}

config();
