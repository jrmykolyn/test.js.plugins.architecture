# Test - JS - Plugins - Architecture

## Table of Contents
- [About](#about)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Key Findings](#key-findings)
- [Research](#research)
- [Documentation](#documentation)

## About
The purpose of this project is as follows:
- Generally, to explore plugin-based architecture.
- Generally, to explore how the Logic layer will instantiate, configure, and make use of plugins.
- Generally, to explore how the Logic and View layers will communicate.
- Specifically, to create a proof-of-concept for the SF-X Logic layer.
- Specifically, to create a concrete implementation of the 'Core' entity.
- Specifically, to create a concrete implementation of the following plugins:
  - DataSource
  - Events
- Specifically, to demonstrate a mechanism by which the Logic and View layers will share information.

Additionally, this repository includes concrete implementations of the following plugins:
  - Cache
  - Filter
  - Logger

## Prerequisites
In order to run this project, please ensure that both Node and npm are installed on your system.

## Installation
To install this project, as well as its dependencies, complete the following steps:
- Download or clone the repository to your local file system.
- Using the command line, navigate to the root of the repository.
- Run `npm install`.

## Usage
To view and interact with the entities and experiments that this repository exposes, complete the following steps:
- Open the following file in a browser of your choice: `/public/index.html`.

The demo allows for the following interactions:
- Entering a search term; viewing the resulting product suggestions.
- Entering a search term; submitting a search by hitting the enter key.
- Entering a search term; submitting a search by selecting one of the resulting suggested searches.

## Key Findings

### Successes
- The system is flexible.
  - It does not require specific plugins to exist in order to function as expected.
  - It exposes a mechanism for configuring plugins at instantiation time.
- The system is extensible.
  - New 'Core' functionality may be added by extended the Core class.
  - New application functionality may be added via additional plugins.
  - New plugins may extend either the abstract or concrete plugin classes.
- The 'Core' entity is unaware of which plugins have been registered.
  - 'Core' does not act on or access *specific* plugins.
- There is a clear separation of concerns between 'Core' and plugins.
  - 'Core' is responsible for:
    - Receiving plugins, instantiating them, and managing their lifecycle.
    - Resolving plugin dependencies.
  - Plugins are responsible for:
    - Providing information about themselves, including an identifier (eg. name) and type.
    - Exposing methods that extend the functionality of the application.
    - Specifying their dependencies (either 'hard' or 'soft').

### Limitations
- Name collisions.
  - Each plugin must provide its name via an instance property.
  - In cases where two or more plugins share the same name, whichever plugin is injected *last* will shadow the others.
- Event in, event out.
  - In the current implementation, event-based communication is handled in the following way:
    - A DataSource-type plugin provides an event to 'listen on' and a callback to invoke when the event is emitted.
    - The same DataSource plugin also provides an event to emit if and when the callback resolves.
    - The payload of the second event will be the return value of callback function.
  - In this implementation, each 'inbound' event maps to one and only one 'outbound' event.
    - If a developer wishes to emit multiple events with the result of a single callback, they must register 1x
    event listener for each.
- Runtime registration.
  - The 'Core' entity does not currently expose a method or mechanism for registering plugins after it has been instantiated.
- 'Unregistration'.
  - The 'Core' entity does not currently expose a method for removing plugins.

### Additional Areas For Exploration
- The mechanism for the Filter-type plugins is not fully resolved, and warrants further investigation.
  - Filter-type plugins are currently 'applied' to data via `Core#applyFilters()`, which represents the tightest coupling between the 'Core' entity and the plugins.
- The dependency injection and plugin mocking mechanisms warrant further investigation.

## Research
The architecture of the system included within this repository was informed by the following:
- *Building a Plugin Architecture with Swift*
  - https://www.youtube.com/watch?v=irK8Tcy2aRQ
- *MagicBeans: A Platform for Deploying Plugin Components*
  - https://link.springer.com/chapter/10.1007/978-3-540-24848-4_7
- *Microkernel Pattern*
  - http://rezagh.wikidot.com/microkernel-pattern
- *On Plugin-Ins and Extensible Architectures*
  - https://queue.acm.org/detail.cfm?id=1053345
- *Painless Plugins*
  - http://chatley.com/articles/pp.pdf
- *Software Architecture Patterns: Microkernel Architecture*
  - https://www.oreilly.com/ideas/software-architecture-patterns/page/4/microkernel-architecture
- *Software Design Patterns and Principles in Pictures*
  - https://www.codeproject.com/Articles/1233123/Software-Design-Principles-and-Patterns-in-Picture
- *Web Applications: A Simple Pluggable Architecture for Business Rich Clients*
  - https://link.springer.com/chapter/10.1007/11531371_63

## Documentation
Currently, this project does not include any external documentation.

For an overview of the project's evolution, please consult the CHANGELOG.

- The plugin registration system (eg. the use of names) warrants further investigation.
