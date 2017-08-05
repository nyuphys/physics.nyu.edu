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

Then, `cd` to the project directory and install the project files with
```
npm i .
```
This will set up the project and build it for the first time. While working on the project, it would be handy to use `gulp watch`. This will build the project once any files are saved in the project `src` directory.

## Running the Development Site
To deploy the site, build the project and then run the Docker container via
```
docker-compose up
```

This should build the container for the site and mirror any changes in the `web` directory to the live site, which should be running on `localhost:8010`. NB: `docker-compose` is bundled with Docker for OSX and Docker for Windows *but if you are using a Linux distro, you will need to install it separately.*
