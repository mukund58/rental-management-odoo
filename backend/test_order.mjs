import http from 'http';

const postData = JSON.stringify({ email: 'admin@rentx.com', password: 'password' });

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    const token = JSON.parse(data).token;
    console.log("Logged in, fetching orders...");
    
    http.get({
      hostname: 'localhost',
      port: 5000,
      path: '/api/checkout/orders',
      headers: { 'Authorization': `Bearer ${token}` }
    }, (res2) => {
      let data2 = '';
      res2.on('data', d => data2 += d);
      res2.on('end', () => {
        const orders = JSON.parse(data2);
        console.log(`Found ${orders.length} orders`);
        if(orders.length > 0) {
          const id = orders[0].id;
          console.log(`Fetching order ${id}...`);
          http.get({
            hostname: 'localhost',
            port: 5000,
            path: `/api/checkout/orders/${id}`,
            headers: { 'Authorization': `Bearer ${token}` }
          }, (res3) => {
            let data3 = '';
            res3.on('data', d => data3 += d);
            res3.on('end', () => {
              console.log("GET ORDER Response Status:", res3.statusCode);
              console.log(JSON.stringify(JSON.parse(data3), null, 2));
            });
          });
        }
      });
    });
  });
});

req.write(postData);
req.end();
