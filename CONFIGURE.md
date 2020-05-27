# How to configure breakglass

The config for Breakglass lives in a Kubernetes configmap in the file `K8s/breakglass-configmap.yaml` file. Take a look at `K8s/breakglass-configmap.yaml.example` for an example configuration. Al the breakglass settings are in `data > config`

## OAuth Key

Breakglass needs google OAuth to be configured to work, so be sure to include

```yaml
OAuthClientId: 1234567890-XYZWVUTSRQP...
```

In `data > config > OAuthClientID: 123...`

## Global Settings

Modify the config for all GCP projects under the global tag

```yml
global:
  whitelist:
    - ...
  permissions:
    - ...
  notify:
    - ...
```

These settings will be applied by default to all projects.

Available settings are

- `whitelist` - A list of users (their emails) that are allowed to use Breakglass
- `blacklist` - Users that are not allowed. This wont do much at the top level until user groups are implemented because every user is blacklisted by default. _Note_ including a user here will not allow them access even if they are whitelisted.
- `permissions` - A list of roles a user can elevate to
- `notify` - See **Configuring Notifications** below

## Project-Specific Settings

To add specific settings to a project that will override the inherited global settings, add top level labels for the project

```yml
sql-server-1337: #projectID
  blacklist:
    - ...
  permissions:
    - ...
  notify:
    - ...
```

The options here are the same as above

- `whitelist` - Users on here will have access to Breakglass for this product even if they are blacklisted globally.
- `blacklist` - This will prevent the user from elevating on this project even if they are whiteliested globally.
- `permissions` - These are the _**additional**_ permissions that are able to be assumed for this project. All global ones will be available automatically
- `notify` - These are _**additional**_ sources to notify in addition to the global ones

## Configuring Notifications

Notification sources are configurable both globally and on a project level.

```yaml
global:
  notify:
    emails:
      - Chief.Of.Security@yourcompany.com
      - Other.Guy@gmail.com
    chatrooms:
      - https://WEBHOOK-URL-FROM-GOOGLE-CHAT/asdf

sql-server-1337:
  notify:
    emails:
      - Database.Admin@yourcompany.com
    chatrooms:
      - https://DATABASE-MANAGERS-CHATROOM-HOOK/qwerty
```

If you want to have email notifications you must get a [SendGrid API Key](https://signup.sendgrid.com/). You can get 100 emails a day for free. Include the key on the top level of the config as follows

```yaml
SendGridKey: SG.XYZABC...
```

`chatrooms` is a list of webhooks that point at specific Google Chat Spaces. Read about webhooks [here](https://developers.google.com/hangouts/chat/how-tos/webhooks).

The recipients of all notifications will be a concatination of the global and project level lists.
