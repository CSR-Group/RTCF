package com.csrg.dsynk.hub.controllers.v1.models;

import com.csrg.dsynk.hub.service.State;
import lombok.Data;

import java.util.Map;
import java.util.TreeMap;

@Data
public class StateDto {

    private Map<String, Integer> integers;
    private Map<String, String> strings;
    private Map<String, TreeMap<Integer,String>> docs;

    public StateDto(State state) {

        integers = state.getIntegerMap();
        strings = state.getStringMap();
        docs = state.getDocMap();
    }
}
