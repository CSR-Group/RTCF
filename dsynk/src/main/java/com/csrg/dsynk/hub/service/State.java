package com.csrg.dsynk.hub.service;

import lombok.Getter;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

@Getter
public class State {

    private Map<String, Integer> integerMap = new HashMap<>();
    private Map<String, String> stringMap = new HashMap<>();
    private Map<String, TreeMap<Double,String>> docMap = new HashMap<>();

    public void initialize(String from, StateDefinition definition) {

        for(Variable variable : definition.getVariables()) {

            if(DataType.int64.equals(variable.type)) {
                integerMap.put(variable.name, Integer.parseInt(variable.value));
            }
            else if (DataType.str.equals(variable.type)) {
                stringMap.put(variable.name, variable.value);
            }
            else if(DataType.doc.equals(variable.type)) {
                docMap.put(variable.name, new TreeMap<>());
                docMap.get(variable.name).put(0.0, variable.value);
            }
        }
    }

    public void handleEvent(String from, RequestMessage message)
    {
        if(DataType.doc.equals(message.type))
        {
            handleDocumentChange(message);
        }
        else if(DataType.str.equals(message.type))
        {
            stringMap.put(message.key, message.value);
        }
        else if(DataType.int64.equals(message.type))
        {
            integerMap.put(message.key, Integer.parseInt(message.value));
        }
    }

    private void handleDocumentChange(RequestMessage message)
    {
        if(message.delValue == "DELETE")
        {
            if(docMap.containsKey(message.key) && docMap.get(message.key).containsKey(message.line))
            docMap.get(message.key).remove(message.line);
        }
        else
        {
            docMap.putIfAbsent(message.key, new TreeMap<>());
            docMap.get(message.key).put(message.line,message.value);
        }
    }
}
