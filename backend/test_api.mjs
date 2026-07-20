import http from 'http';

const req = http.get('http://localhost:5000/api/products', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    let parsed = JSON.parse(data);
    let arr = parsed.data || parsed.items || parsed;
    if (Array.isArray(arr)) {
      console.log(JSON.stringify(arr.slice(0, 2), null, 2));
    } else {
      console.log(JSON.stringify(parsed).substring(0, 500));
    }
  });
});
req.on('error', console.error);
