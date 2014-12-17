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
          - scroll down to "scripts" -> "start"
          - change bucket: edit "amazonBucket" environment variable
          - change root credentials (optionally): edit "AWS_ACCESS_KEY_ID" and "AWS_SECRET_ACCESS_KEY" variables

ports:    - app: - default: 8080
                 - change: add PORT environment variable to server start script (/package.json -> "scripts" -> "start")
          - socketComm : - default: 3000
                         - change: add SOCKET_PORT environment variable to server start script (/package.json -> "scripts" -> "start")

mandrill: - open /packaje.json
          - scroll down to "scripts" -> "start"
          - edit "mandrillKey" environment variable

node modules:     /package.json
angular modules:  /bower.json
server config:    /server.js