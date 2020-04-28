package com.csrg.dsynk.hub.controllers.v1.models;

import com.csrg.dsynk.hub.service.StateDefinition;
import com.csrg.dsynk.hub.service.Variable;
import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
public class CreateStateDto {


    private String topic;
    private String from;
    Map<String, VariableDefinition> variables = new HashMap<>();

    public StateDefinition asStateDefinition() {

        StateDefinition definition = new StateDefinition();
        List<Variable> varList = variables.keySet()
                                          .stream()
                                          .map(name -> new Variable(name,
                                                                    variables.get(name).type,
                                                                    variables.get(name).value))
                                          .collect(Collectors.toList());
        definition.setVariables(varList);
        return definition;
    }
}
