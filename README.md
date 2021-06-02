# PKU Piazza

This is a project for the course _Introduction to Database Systems(Honor Track)_.

## Getting Started

First, clone the repository with `git`:

```
git clone https://github.com/lrh2000/pku-piazza
```

Second, update dependencies with `npm`:

```
npm update
```

For contribution, install a git hook to enforce the code style is suggested. This can be done by:

```
npm run prepare
```

Finally, start the server for development by:

```
npm run dev
```

But before this, make sure the PostgreSQL database has been configured according to `src/db/common.js` and initialized with `sql/init.sql`.
