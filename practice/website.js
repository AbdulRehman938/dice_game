import  fs  from 'fs';
import http from 'http';

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html')
    if (req.url === '/') {
        res.statusCode = 200;
        res.end('<h1>Hello this is http server of node module</h1>')
    }
    else if (req.url === '/about') {
        res.statusCode = 200;
        res.end('<h1>This is about page</h1>')
    }
    else if (req.url === '/home') {
        res.statusCode = 200;
        const data = fs.readFileSync('index.html')
        res.end(data.toString())
    }
    else {
        res.statusCode = 404;
        res.end('<h1>Page not found</h1>')
    }
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})