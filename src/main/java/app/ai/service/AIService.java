package app.ai.service;

import app.ai.client.AIClientFeign;
import app.ai.model.AIRequest;
import app.ai.model.AIResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final AIClientFeign aiClientFeign;

    @Autowired
    public AIService(AIClientFeign aiClientFeign) {
        this.aiClientFeign = aiClientFeign;
    }

    public AIResponse chatWithAI(AIRequest aiRequest) {

        ResponseEntity<AIResponse> responseEntity = aiClientFeign.sendMessageToAI(aiRequest);


        if (responseEntity.getStatusCode().is2xxSuccessful()) {

            System.out.println("AI Response: " + responseEntity.getBody());

            return responseEntity.getBody();
        } else {

            AIResponse aiResponse = new AIResponse();
            aiResponse.setSuccess(false);
            aiResponse.setError("Error communicating with AI service");
            return aiResponse;
        }
    }
}
