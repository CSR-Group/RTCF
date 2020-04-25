package com.csrg.dsynk.hub.service;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Variable {

    String name;
    DataType type;
    String value;
}
