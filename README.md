# GitLab Notifier

## Features

Stay tuned to what's happening in merge requests you're reviewing or assigned to

## Installing

Set your private token in VS Code settings

```javascript
{
    "gitlab-notifier.privateToken": "YOUR-TOKEN"
}
```

### Set server url if yours is different than `gitlab.com`
```javascript
{
    "gitlab-notifier.url": "https://gitlab.yourcompany.com/"
}
```

### Set your username
```javascript
{
    "gitlab-notifications.username": "@username"
}
```

### Configure a different fetch interval if you want to. The default is 300000 ms (5 minutes)

```javascript
{
    "gitlab-notifications.interval": 600000
}
```
