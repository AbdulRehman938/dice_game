import http from 'http';

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    console.log(req.url);
    console.log(req.method);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html')
    res.end('<h1>Hello this is http server of node module</h1>')
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})