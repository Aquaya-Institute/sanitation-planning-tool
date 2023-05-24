## DEV NOTES
In VS Code install Eslint and Prettier extension. Use prettier to format all your files before commiting to git (there is a shorcut to do this). Prettier forces a consistent code style and will take care of that. Eslint will warn you of any errors as you write code. Also, install the React Developer Tools extensions in your browser as it is very helpful in debugging.

## SETUP ENV
Create a local an environment file at the root of the repo. Name it `.env.local`. This file will be ignored by git (it's listed in `.gitignore`) and will not be part of the repository. Never push this file to github because we don't want our API keys going public!

In this file insert and restart server 
```
REACT_APP_CARTO_DEV_API_KEY=<DEV_API_KEY_FROM_CARTO>
REACT_APP_CARTO_USERNAME=<USERNAME>
```

Then followed by: \
Do this first time only. This installs all the dependencies. \
`yarn install`

Run this to start the dev server. It will open a browser tab and reload as you edit files. \
`yarn start`

## RESOURCES
 - An Operation Manual is available within the repository: SanPlan Operating Manual.pdf
 - An introductory webinar, including a tutorial and discussion, is available at https://aquaya.org/sanplan-the-sanitation-planning-tool/
