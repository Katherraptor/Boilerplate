# FrontEnd HTML Boilerplate
To expedite the initialization of front end projects we have put together this quick boilerplate. It includes our most frequently used javascript plugins, a complete setup of our customized gulp config that improves the efficiency of optimising and testing our frontend code as well as Bower that manages our development dependencies to help keep our git repo's clean. Follow these steps to get started with the HTML Boilerplate.

## Step 1: Install Node
If you don't already have Node.js installed on our system navigate to (https://nodejs.org/en/ "Nodejs.org") to download. This should install both node.js and the Node Package Manager (npm) on your system. Once installed you should be able to run ```$ node -v``` and ```$ npm -v``` on your command line and see your version number respectively.

## Step 2: Install Bower & Gulp
Bower can be installed once globally but to work properly you'll need gulp installed both globally on your system and locally in your project. Thankfully both of these tasks can be handled by npm. Open git bash or command line run:  
```
$ npm install -g bower
```
To add dependencies to our project you'd add them to the bower.json file found in the root folder of the project. We decided not to include any dependencies by default as our projects vary so frequently on which ones are required. We'll handle installing these bower dependencies with our gulpfile.  

To Install Gulp globally run this command  
```
$ npm install -g gulp-cli
```  
This should mean you should be able to run ```gulp -v``` anywhere on your system and get your global gulp version number back. Next we'll need to install Gulp locally in your project. Navigate to your project root folder and run this command.  
```
$ npm install gulp
```
Because this boilerplate has a gulp dependency already specified in our package.json file we don't need to add a ```--save-dev ``` to the command.  

## Step 3: Install Gulp Plugins
Our package.json specifies a number of npm plugins for our gulpfile to use. We'll need to install these plugins in our project. They'll be placed inside a node_modules folder in the project root. To install these plugins run this on your git bash or command line  
```
$ npm install
```
Npm will loop through our package.json file and install all our gulp dependencies we have listed.  

## Step 4: Set Gulp Paths
In our gulpfile.js you'll find some variable objects: paths, dests and options. The properties for each object have straight-forward names descriptive of their use and should be set before the first build. Important properties to note:

- paths.cssSrc points to the topfile of either your less or sass file structure, the file that imports all your partial files.
- paths.cssParts points to the folder where all your scss/less partial files are placed
- removing the initial backslash from your file paths for css, js and images allows gulp.watch to watch not just for existing files but also for new ones
- options.production when set to true will minify css and js files, when set to false these files will output unminified


## Step 5: Run Gulp Tasks
Gulp is a task manager, with this boilerplate gulp setup we've automated the following tasks:

- Install Bower dependencies
- Less/Sass preprocessing, compiling to CSS and minification
- JavaScript Linting, Concatenation and minification
- Watching less/sass/js files for changes and re-compiling/minifying on save
- Error reporting on js lint failure or css precompiling as a system notification and sound
- Image optimization and compression
- Launching a Node.js server
- Reloading the browser on HTML, css and javascript changes

We've collected all these tasks under the gulp default task so all you need to do on your git bash or command line is the following.
```
$ gulp
```
Once your bower components are installed and your server is running be sure to navigate to your html file and include script and css links to your bower_components elements. And with that you're ready to start coding!
