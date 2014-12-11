# MSD Staywell

TECHNICAL INFO

- server: node.js
- login: node passport local
- database: mongo db (mongoose)
- front-end: angular.js

INSTALL

1. Clone the repository: 'git clone git@bitbucket.org:qualitance/msd-new.git'
2. Install all plug-ins: 'npm install'
3. Run: 'npm start'


CONFIG

database: /config/database.js

amazon:   - open /packaje.json
          - scroll down to "scripts" key
          - change bucket: edit "amazonBucket" environment variable
          - change root credentials (optionally): edit "AWS_ACCESS_KEY_ID" and "AWS_SECRET_ACCESS_KEY" variables

node modules:     /package.json
angular modules:  /bower.json
server config:    /server.js