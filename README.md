# MSD Staywell

TECHNICAL INFO

- server: node.js
- login: node passport local
- database: mongo db (mongoose)
- front-end: angular.js
- search: elastic

ENVIRONMENTS
1. development (local database)
2. QA - where testing is done
3. Staging - where the app is presented (as close to production as possible)
4. Production

INSTALL

1. Clone the repository: 'git clone git@gitlab.qualitance.com:msd/staywell.git'
2. Install all modules: 'npm install' (installs bower modules as well)
3. Seed db: 'gulp populateDB'. WARNING:
	- developed and tested on mongodb-org 3.0.5
	- this will connect to localhost mongo (expecting no user and password to be set),
	  create a database called "msd" and insert everything into it. If the database
	  already exists, it will drop every collection from it.
	- this will insert everything from the QA environment database into your localhost
	  msd database. It may be helpful to run this script again to locally reproduce
	  an issue discovered by the test team

4. Run: 'npm start'

CONFIG

database: /config/database.js

amazon:   - open /packaje.json
          - scroll down to "scripts" -> "start"
          - change bucket: edit "amazonBucket" environment variable
          - change root credentials (optionally): edit "AWS_ACCESS_KEY_ID" and "AWS_SECRET_ACCESS_KEY" variables
          - open gulpfile.js
          - change vaiables in task prefixed "run"

ports:    - dev app: - default: 8080
                     - change: add devPORT environment variable to server start script (/package.json -> "scripts" -> "start")
          - production app (ssl): - default: 3000
                                  - change: add ssPORT environment variable to server start script (/package.json -> "scripts" -> "start")

everything else: - open /config/environment.js

node modules:     /package.json
angular modules:  /bower.json
server config:    /server.js
