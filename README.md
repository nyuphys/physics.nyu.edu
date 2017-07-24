# New SPS website - DEVELOPMENT BRANCH

Aight. So I configured this the best I can.

## Installation
To work on the design, you need [Node](https://nodejs.org). The current LTS version would be preferable. Node will handle all the design asset building.

You will need [Docker](https://www.docker.com/) as well in order to run the server.

## Configuration
Firstly, install the `gulp` command line interface if you don't already have it via
```
npm i -g gulp-cli
```

Then, install the project files with
```
npm i .
gulp config
```
This will set up the project and build it for the first time. While working on the project, it would be handy to use `gulp watch`. This will build the project once any files are saved in the project `src` directory.

## Running the Development Site
To deploy the site, build the project and then run the Docker container via
```
docker run -p 8010:80 sps
```

After that, the site should be running on `localhost:8010`.

Once you initially `docker pull` the Apache server with PHP 5.4 (`uknetweb/php-5.4-apache`) you won't need to run that command again.
