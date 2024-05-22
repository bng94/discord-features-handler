# Setting up Events

**A simple way to setup your discord.js events. All you need to do is set the property name as the event name, and then pass in the parameters needed for the events in the execute function, and set up the rest of the events functionality in it.  You can name the event file as anything you want.**

=== "JS" 
    ```javascript  title="ready.js"

    const { Events } from "discord.js";
    module.exports = {
        name: Events.ClientReady, // name of the discord.js event
        once: true, // if this event should run once only
        async execute(client) { // when the event is invoked we execute this function
          console.log(`${client.user.tag}`,"Ready!");
        },
      };
    ```
=== "TS"
    ```typescript title="ready.ts"

    import { Events } from "discord.js";
    module.exports = {
        name: Events.ClientReady, // name of the discord.js event
        once: true, // if this event should run once only
        async execute(client) { // when the event is invoked we execute this function
          console.log(`${client.user.tag}`,"Ready!");
        },
      };
    ```

### Properties

<p>
  <strong>name</strong> <span class="varType">string</span><br/>
  This is the name of the Discord client event. You can find the full list of Discord event names in the <a href="https://discord.js.org/docs/packages/discord.js/main/Events:Enum">enum Events documentation</a><br/>

</p>

<p>
  <strong>once</strong> <span class="varType">boolean</span><br/>
  If this Discord event should run once or whenever it is called. For example, you would need this property if you are using the ready event.<br/>
</p>

<p>
  <strong>async execute(client, ...args)</strong><br/>
  This is the method used to execute and handle the Discord event trigger. The first argument is always the <a href="https://discord.js.org/docs/packages/discord.js/main/BaseClient:Class">Discord Client object</a>.
</p>

!!! info
    This is an example of using Events.GuildMemberUpdate execute function.

```javascript
execute(client, oldMember, newMember) { 
    // do something
},
```



###
