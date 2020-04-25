package com.csrg.dsynk.hub.service;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

public class State {

    Map<String, Integer> integerMap;
    Map<String, String> stringMap;
    Map<String, TreeMap<Integer,String>> docMap;

    public void handleEvent(String from, requestMessage message)
    {
        if(message.type == "doc")
        {
            docMap.putIfAbsent(message.docId, new TreeMap<Integer, String>());
            if(message.value == "\\n")
            {
                TreeMap<Integer,String> doc = docMap.get(message.docId);
                Integer line = Integer.parseInt(message.key);
                if(doc.higherEntry(line) == null)
                {
                    docMap.get(message.docId).putIfAbsent(line + 1 ,message.value);
                }
                else
                {
                    Integer key = line + doc.higherEntry(line).getKey()/2;
                    docMap.get(message.docId).putIfAbsent(key,message.value);
                }
            }
            else
            {
                docMap.get(message.docId).putIfAbsent(Integer.parseInt(message.key),message.value);
            }
        }
        else if(message.type == "string")
        {
            stringMap.putIfAbsent(message.key, message.value);
        }
        else if(message.type == "int")
        {
            integerMap.putIfAbsent(message.key, Integer.parseInt(message.value));
        }
    }
}
