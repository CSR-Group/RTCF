package com.csrg.dsynk.hub.service;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RequestMessage
{
    DataType type;
    String key;
    String value;
    Double line;
}
