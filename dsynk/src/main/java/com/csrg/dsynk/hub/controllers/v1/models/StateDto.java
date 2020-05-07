package com.csrg.dsynk.hub.controllers.v1.models;

import com.csrg.dsynk.hub.service.State;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

@Data
public class StateDto {

    private Map<String, Integer> integers;
    private Map<String, String> strings;
    private Map<String, Map<Double,String>> docs;

    public StateDto(State state) {

        integers = state.getIntegerMap();
        strings = state.getStringMap();
        docs = new HashMap<>();
        Map<String, Map<Double, String>> docMap = state.getDocMap();
        for(String key: docMap.keySet()) {
            if(docMap.get(key) != null) {
                HashMap<Double,String> object = new HashMap<>();
                for(Double line: docMap.get(key).keySet()) {
                    String value = docMap.get(key).get(line);
                    object.put(line, value);
                }
                docs.put(key, object);
            }
        }
    }
}
