package com.csrg.dsynk.hub.controllers.v1.models;

import com.csrg.dsynk.hub.service.StateDefinition;
import com.csrg.dsynk.hub.service.Variable;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class CreateStateDto {


    private String topic;
    private String from;
    List<VariableDefinition> variables;

    public StateDefinition asStateDefinition() {

        StateDefinition definition = new StateDefinition();
        List<Variable> varList = variables.stream()
                                          .map(var -> new Variable(var.name, var.type, var.value))
                                          .collect(Collectors.toList());
        definition.setVariables(varList);
        return definition;
    }
}
