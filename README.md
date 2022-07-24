# 🎯 Air quality

Get Air quality for the nearest city or specefic city or a given city by lat long

## 📋 Description

The assessment is to make an API that is able to get the weather information for
certain cities.

## ⬇ Installation

Make sure you have Nodejs and Nestjs/cli installed

```bash
~ node -v
~ nest --version
```

```bash
# Clone via SSH or any other method
$ git clone git@github.com:oussamabouchikhi/air-quality.git

# CD into the project
$ cd air-quality

# Install the dependencies
$ yarn
```

## 🛠️ Configuration

Rename the `sample.env.development` file to `.env.development` and put your Mongodb Atlas connection string & IQAIR api key


```.env
IQAIR_KEY=YOUR_API_KEY
MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
```

## 🚀 Running the app

```bash
# development
$ npm start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 🧪 Test

```bash
# unit tests (you can add the prefix --watch)
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

### Test scheduler

in `air-quality.service.ts` file add the bellow code

```typescript
private count = 0
numberOfSeconds = 7;

  startTime = new Date().getTime();
  @Cron(`0-59/1 * * * * *`, {
    name: 'myJob',
  })
  handleCron() {
    console.log(`${this.count + 1} - Called every second`);
    this.count++;
    this.closeJob();
  }

  closeJob() {
    const job = this.schedulerRegistry.getCronJob('myJob');

    const endTime = this.startTime + 1000 * (this.numberOfSeconds || 7);

    if (job.lastDate().getTime() > endTime) {
      job.stop();
    }
  }
```

in `cities.controller.ts` file add the bellow code

```typescript
@Get('test')
testFunc() {
  return this.airQualityService.handleCron();
}
```

you should get

```markdown
1 - Called every second
2 - Called every second
3 - Called every second
4 - Called every second
5 - Called every second
6 - Called every second
7 - Called every second
```