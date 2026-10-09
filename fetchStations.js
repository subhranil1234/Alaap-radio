const https = require('https');
https.get('https://raw.githubusercontent.com/codito/akashvani/master/stations.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const stations = JSON.parse(data);
    const kolkata = stations.filter(s => s.name.toLowerCase().includes('kolkata') || s.state.toLowerCase().includes('bengal'));
    console.log(kolkata);
  });
});
