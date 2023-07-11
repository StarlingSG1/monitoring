import { Router } from "express";
const dotenv = require("dotenv");
dotenv.config();
const fs = require('fs');
const path = require('path');

const api = Router();

api.get("/", async ({ body }, res) => {
  
  const sitesAvailableDir = '/etc/nginx/sites-available';

  fs.readdir(sitesAvailableDir, (err, files) => {
    if (err) {
      console.error(`Could not list the directory: ${err}`);
      return;
    }

    const sitePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const filePath = path.join(sitesAvailableDir, file);

        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Could not read the file: ${err}`);
            reject(err);
            return;
          }

          // Split the data into lines
          const lines = data.split('\n');

          // Filter the lines to get only the server_name and proxy_pass lines
          const serverNameLine = lines.find(line => line.includes('server_name'));
          const localHostPassLines = lines.filter(line => line.includes('localhost'));

          // Extract the server name and port from those lines
          const serverName = serverNameLine ? serverNameLine.match(/server_name\s+(.+);/)[1] : null;
          const port = localHostPassLines.map(line => {
            const matches = line.match(/localhost:(\d+)/);
            return matches ? matches[1] : null;
          });

          resolve({ url: serverName, port: port[0] });
        });
      });
    });
    Promise.all(sitePromises)
      .then(sites => {
        const result = {
          front: [],
          back: [],
          other: []
        };

        sites.forEach(site => {
          if (!site.port) {
            result.other.push(site);
            return
          }

          if (site.port.startsWith('3')) {
            result.front.push(site);
          } else if (site.port.startsWith('8')) {
            result.back.push(site);
          }
        });

        result.front.sort((a, b) => a.port - b.port);
        result.back.sort((a, b) => a.port - b.port);
        result.other.sort((a, b) => a.port - b.port);

        res.status(200).send(result);
      })
      .catch(err => {
        console.error(err);
      });
  });


});


// Specify the path to the sites-available directory



export default api;
