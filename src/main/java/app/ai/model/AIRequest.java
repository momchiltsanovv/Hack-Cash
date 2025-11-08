package app.ai.model;

import lombok.Data;

@Data
public class AIRequest {
    public String sessionId;
    private String userMessage;
}
