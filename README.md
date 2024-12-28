
### How to start

In order to start the project use:
```bash
 git clone https://dev.azure.com/infinitysoftsas/Plantilla/_git/FrontEnd
 cd [RutaLocal]
 
# install the project's dependencies
 npm install
# watches your files and uses livereload by default run `npm start` for a dev server. Navigate to `http://localhost:4600/`. The app will automatically reload if you change any of the source files.
npm start

# prod build, will output the production application in `dist`
# the produced code can be deployed (rsynced) to a remote server
# if it will be run in root domain/subdomain
 npm run build

# if it will be run in test virtual directory
ng build --prod --base-href /FrontEnd/ --deploy-url /FrontEnd/


git remote add origin https://dev.azure.com/infinitysoftsas/Plantilla/_git/FrontEnd
git push -u origin --all
 
```