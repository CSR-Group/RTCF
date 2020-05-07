import { subscribe, publish } from "./relay";

const DataType = {
  int64: 'int64',
  str: 'str',
  doc: 'doc'
}

class State  {
  /*
      input: 
         {
              "asd": {type: "int", value="0"}
              "asd2": {type: "doc", value="0"}, 
              "adsad": {type: "doc", value="1"}, 
          }
   */

  constructor(definition, clientID, topic, dsynkHubHost, callback) {

      this.intVars = {};
      this.strVars = {}; 
      this.docVars = {};
      this.typeMap = {}; 
      this.clientID = clientID;
      this.topic = topic;
      this.dsynkHubHost = dsynkHubHost;
      this.callback = callback; 

      for(var name in definition) {
          if(definition[name].type === DataType.int64) {
              this.intVars[name] = definition[name].value; 
              this.typeMap[name] = DataType.int64;
          }
          if(definition[name].type === DataType.str) {
              this.strVars[name] = definition[name].value; 
              this.typeMap[name] = DataType.str;
          }
          if(definition[name].type === DataType.doc) {
              this.docVars[name] = { "0.00000" : definition[name].value }; 
              this.typeMap[name] = DataType.doc;
          }
      }
  }

  del(variableName, docKey) {
    
    var message; 
    if(!(variableName in this.typeMap)) {
      throw "variable " + variableName + " does not exist"; 
    }
    docKey = docKey.toFixed(5)
    var type = this.typeMap[variableName];
    if(variableName in this.docVars) {
      delete this.docVars[variableName][docKey];
      message = { 'type': DataType[type],
                  'key': variableName,
                  'line': docKey,
                  'delValue': "DELETE"}  
    }
    publish(this.dsynkHubHost, this.topic, this.clientID, message);
  }

  set(variableName, value = '0', docKey = -1) {
    if(!(variableName in this.typeMap)) {
      throw "variable " + variableName + " does not exist"; 
    }

    var type = this.typeMap[variableName];
    var message; 
    docKey = docKey.toFixed(5)

    if(type === DataType.int64) {
      this.intVars[variableName] = value;
      message = { 'type': DataType[type],
                  'key': variableName,
                  'value': value.toString()}
    }
    if(type === DataType.str) {
      this.strVars[variableName] = value;
      message = { 'type': DataType[type],
                  'key': variableName,
                  'value': value}
    }
    if(type === DataType.doc) {
      this.docVars[variableName][docKey] = value;
      message = { 'type': DataType[type],
                  'key': variableName,
                  'line': docKey,
                  'value': value}
    }

    publish(this.dsynkHubHost, this.topic, this.clientID, message);
  }

  get(variableName) {
    if(!(variableName in this.typeMap)) {
      throw "variable " + variableName + " does not exist"; 
    }

    var type = this.typeMap[variableName];
    if(type === DataType.int64) {
      return this.intVars[variableName];
    }
    if(type === DataType.str) {
      return this.strVars[variableName];
    }
    if(type === DataType.doc) {
      return this.docVars[variableName];
    }
  }

  handle(message) {

    console.log("handle change:",message);
    const event = JSON.parse(message.body);

    if(event.from === this.clientID) {
      return;
    }
 
    var change = event.message; 
    var type;

    if(!(change.key in this.typeMap)) {
      type = change.type;
    } else {
      type = this.typeMap[change.key];
    }

    if(type === DataType.int64) { 
      console.log("change state : " + change.key + " - "+ change.value);
      this.intVars[change.key] = change.value;
    }
    if(type === DataType.str) {
      console.log("change state : " + change.key + " - "+ change.value);
      this.strVars[change.key] = change.value;
    }
    if(type === DataType.doc) {
      console.log(change.line);
      console.log(this.docVars[change.key]);
      var docKey = parseFloat(change.line).toFixed(5)
      if(change.delValue == undefined) {
        console.log("change state : " + change.key + " - "+ docKey + " - "+ change.value);
        this.docVars[change.key][docKey] = change.value;  
      } else {
        console.log("change state : " + change.key + " - delete ("+ docKey + ")");
        console.log("deleting", this.docVars[change.key][docKey]);
        delete this.docVars[change.key][docKey];
      }
    }

    this.callback(); 
  }

  buildState(message) {

    const parsedState = JSON.parse(message.body);

    console.log(parsedState);
    for(var name in parsedState.integers) {
      if(!(name in this.typeMap)) {
        this.intVars[name] = parsedState.integers[name]; 
        this.typeMap[name] = DataType.int64;
        console.log("building state int: " + name + " = " + parsedState.integers[name]);
      }
    }
    for(var name in parsedState.strings) {
      if(!(name in this.typeMap)) {
        this.strVars[name] = parsedState.strings[name]; 
        this.typeMap[name] = DataType.str;
        console.log("building state str: " + name + " = " + parsedState.strings[name]);
      }
    }
    for(var name in parsedState.docs) {
      if(!(name in this.typeMap)) {

        var doc = {}
        for(var key in parsedState.docs[name]) {
          doc[parseFloat(key).toFixed(5)] = parsedState.docs[name][key];
        }

        this.docVars[name] = doc; 
        this.typeMap[name] = DataType.doc;
        console.log("building state doc: " + name + " = " + parsedState.docs[name]);
      }
    }

    console.log(this);
    this.callback(); 
  }

}

export { State, DataType }; 
