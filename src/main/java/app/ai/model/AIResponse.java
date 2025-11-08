package app.ai.model;

import lombok.Data;

@Data
public class AIResponse {
    private boolean success;
    private String response;
    private String model;
    private String error;


}
