## RKI Mirror

This project is a web app for an overview over the german corona incidences in
your state and district. It uses the incidences published daily by the
Robert-Koch-Institute.

This repository is a reboot of the former repository due to me being dumb and
accidentally leaking my personal information.

### About

This web server is built using [Quarkus](https://quarkus.io/). It can thus be
built into a native image (provided you have [GraalVM Native Image](https://www.graalvm.org/reference-manual/native-image/)
installed). Said image does not need a Java VM, making Quarkus a lightweight and
fast alternative to other Frameworks such as Spring Boot.

The web server provides only a single REST resource, providing the data of the
configured state and district. To achieve this, the server periodically
downloads the [Excel spreadsheet](https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Fallzahlen_Kum_Tab.xlsx)
published daily by the RKI and retrieves the incidence data from there.

I have considered using an API like https://api.corona-zahlen.org/. However,
they do not provide the frozen incidence data for german states which are the
ones I am interested in.

The frontend is done with [React](https://reactjs.org/).

#### Corona incidences

The lockdown in Germany is regulated by the corona incidences published by the
RKI. The lower the incidences, the lower the incidence level, resulting in less
strict lockdown policies.

Each incidence level has a threshold. If the corona incidences are below that
threshold for 5 consecutive workdays, the incidence level is reached. If the
incidences are above that threshold for 3 consecutive days (including holidays),
the next incidence level the incidences were below for these 3 days is reached.
An incidence level change always occurs after two days.

If the incidence is above the threshold for the third incidence level, the
german [Infection Control Act §28b](https://www.gesetze-im-internet.de/ifsg/__28b.html)
are used instead of state and disctrict policies.

The incidence level thresholds are the following:

| Incidence Level | Threshold |
| --- | --- |
| 1 | 35 |
| 2 | 50 |
| 3 | 100 |

### Configuration

For the frontend icons, see `src/main/typescript/public/manifest.json` for the
icons you need to provide.

In src/main/typescript:

| File | Contains |
| --- | --- |
| public/index.html | Web app title and noscript message |
| public/manifest.json | The web app manifest. See https://developers.google.com/web/fundamentals/web-app-manifest/ |
| public/robots.txt | See http://www.robotstxt.org/ |
| src/lang.json | Every message except the noscript message |
| src/theme.scss | The theme styling |

In src/main/resources:

| File | Contains |
| --- | --- |
| application.properties | Quarkus and web server configuration |

In config:

| File | Contains |
| --- | --- |
| application.properties | Resource and service configuration, needs to be edited before build |
| frontend.json | Frontend configuration, downloaded by the React frontend |

### Building

To compile the TypeScipt and Java files and package the web server into a Jar
file, use `mvn package`. Said JAR can directly be built into a native image by
adding the `-Pnative` flag.

Plase note that for building the jar file, you need a working JDK as well as
Maven.

### Development

The React components are written in TypeScript and can be found in the
`src/main/typescript` directory. The Java files can be found in the
`src/main/java` directory, `email.preuschoff.rki.App` being the application
class. Resources providing the endpoints can be found in
`de.vflkamen.server.app.resource`.

To start the web server in development mode with live coding enabled, use
`maven quarkus:dev`. The endpoints can then be reached via
http://localhost:8080.

To start the React frontend in development mode with live
coding enabled, navigate to `src/main/typescript` and run npm start. The
frontend can then be reached via http://localhost:3000. Please note that the
frontend checks downloads the data from the quarkus web server, so running the
quarkus server alongside the frontend server is not optional.

### Issues and Feature Requests

Please use the GitHub issues tracker for issues. You can also post Feature
Requests there, but keep in mind that I started this project mainly for the
sports club I'm in. Thus I may only implement your Feature Requests when I feel
like they are a good addition for said sports club to have.

Feel free to fork this project if you want to.
