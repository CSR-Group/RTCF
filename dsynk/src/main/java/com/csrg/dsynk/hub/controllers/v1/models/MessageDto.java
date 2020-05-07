package com.csrg.dsynk.hub.controllers.v1.models;

import com.csrg.dsynk.hub.service.DataType;
import com.csrg.dsynk.hub.service.RequestMessage;
import lombok.Data;

@Data
public class MessageDto
{
    DataType type;
    String key;
    String value;
    String delValue;

    // specific to document
    Double line;

    public RequestMessage asRequestMessage() {

        return new RequestMessage(this.type, this.key, this.value, this.line, this.delValue);
    }
}
