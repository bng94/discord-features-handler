# Setting up Modules files 

Modules files are files that contains code that run after all the events and commands are loaded in. These files are ran after your bot client is ready to ensure you can access channels and users information. These are optional files you can create. An example would be creating intervals or timeouts or calling an Database after the client is ready. 

!!! info
    The Discord Client is always passed into these functions and is optional to use based off your needs.

=== "JS"

    ```javascript
    module.exports = (client) => {
        // do something
    }
    ```

=== "TS"
    ```typescript
    const myFunction = (client) =>{
        // do something
    }

    export default myFunction;

    ```

