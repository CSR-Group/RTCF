package com.csrg.dsynk.hub.controllers.v1.models;

import com.csrg.dsynk.hub.service.DataType;
import lombok.Data;

@Data
public class VariableDefinition {

    DataType type;
    String value;
}
